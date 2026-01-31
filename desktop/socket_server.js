const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const si = require('systeminformation');
const loudness = require('loudness');
const shell = require('shelljs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = 3001; // Changed from 3000 to avoid conflict with Next.js

console.log("Starting EcoBridge Socket Server...");

// System monitoring function with individual error handling to prevent hanging
async function getSystemStats() {
    try {
        // Run calls individually with fallbacks to prevent one sensor from hanging the whole process
        const cpu = await si.currentLoad().catch(e => ({ currentLoad: 0 }));
        const mem = await si.mem().catch(e => ({ total: 1, available: 1 }));
        const graphics = await si.graphics().catch(e => ({ controllers: [] }));
        const cpuTemp = await si.cpuTemperature().catch(e => ({ main: 0 }));
        
        const controllers = graphics.controllers || [];
        const mainGpu = controllers.find(g => g.model && !g.model.includes('Virtual')) || controllers[0] || {};

        const stats = {
            cpu: {
                load: Math.round(cpu.currentLoad || 0),
                temp: Math.round(cpuTemp.main || 0)
            },
            ram: {
                used: Math.round(((mem.total - mem.available) / mem.total) * 100),
                total: Math.round(mem.total / (1024 * 1024 * 1024)),
                active: Math.round((mem.total - mem.available) / (1024 * 1024 * 1024))
            },
            gpu: {
                load: mainGpu.utilizationGpu || mainGpu.memoryUsed || 0,
                temp: mainGpu.temperatureGpu || 0,
                name: mainGpu.model || 'Unknown'
            },
            volume: await loudness.getVolume().catch(() => 50),
            muted: await loudness.getMuted().catch(() => false)
        };

        return stats;
    } catch (error) {
        console.error("Critical error in getSystemStats:", error);
        return null;
    }
}

// Media Control via PowerShell (Encoded for reliability)
function sendMediaKey(key) {
    const codes = {
        playPause: 0xB3,
        next: 0xB0,
        prev: 0xB1,
        stop: 0xB2
    };
    const vkCode = codes[key];
    if (vkCode) {
        executeWin32Key(vkCode);
    }
}

// Win32 Input Simulation via PowerShell
function executeWin32Key(vkCode, flags = 0) {
    const psScript = `
        $signature = '[DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);'
        $type = Add-Type -MemberDefinition $signature -Name "Win32Utils" -Namespace "Win32" -PassThru
        $type::keybd_event(${vkCode}, 0, ${flags}, 0)
        ${flags === 0 ? `$type::keybd_event(${vkCode}, 0, 2, 0)` : ''}
    `;
    const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
    shell.exec(`powershell -ExecutionPolicy Bypass -EncodedCommand ${encoded}`, { silent: true });
}

const clipboardy = require('clipboardy');

// Store last clipboard content to avoid loops
let lastClipboard = '';

// Watch clipboard for changes
setInterval(async () => {
    try {
        let current;
        if (clipboardy.readSync) {
            current = clipboardy.readSync();
        } else if (clipboardy.default && clipboardy.default.readSync) {
            current = clipboardy.default.readSync();
        } else {
            current = await clipboardy.read();
        }

        if (current && current !== lastClipboard) {
            lastClipboard = current;
            if (io.engine.clientsCount > 0) {
                console.log('Clipboard changed, syncing to devices...');
                io.emit('clipboard-sync', { text: current });
            }
        }
    } catch (err) {
        // Silent fail for clipboard read errors
    }
}, 2000);

function executeWin32Mouse(dx, dy, flags) {
    let psScript;
    if (flags === 0x0001) { // MOUSEEVENTF_MOVE
        psScript = `
            Add-Type -AssemblyName System.Windows.Forms
            $pos = [System.Windows.Forms.Cursor]::Position
            [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(($pos.X + ${Math.round(dx)}), ($pos.Y + ${Math.round(dy)}))
        `;
    } else {
        psScript = `
            $signature = '[DllImport("user32.dll")] public static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, int dwExtraInfo);'
            $type = Add-Type -MemberDefinition $signature -Name "Win32UtilsMouse${flags}" -Namespace "Win32" -PassThru
            $type::mouse_event(${flags}, ${dx}, ${dy}, 0, 0)
        `;
    }
    const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
    shell.exec(`powershell -ExecutionPolicy Bypass -EncodedCommand ${encoded}`, { silent: true });
}

function executeWin32Text(text) {
    const psScript = `
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait("${text.replace(/"/g, '""')}")
    `;
    const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
    shell.exec(`powershell -ExecutionPolicy Bypass -EncodedCommand ${encoded}`, { silent: true });
}

io.on('connection', (socket) => {
    console.log('Device Connected:', socket.id);

    // Send initial stats on connection
    getSystemStats().then(stats => {
        if (stats) {
            console.log("Sending initial stats to", socket.id);
            socket.emit('stats-update', stats);
        }
    });

    socket.on('register', async (type) => {
        console.log(`Registered as: ${type}`);
        // Send fresh stats immediately upon registration
        const stats = await getSystemStats();
        if (stats) {
            socket.emit('stats-update', stats);
        }
    });

    // Handle Commands
    socket.on('command', async (data) => {
        console.log(`Command Received: ${data.action}`, data.params);
        
        switch (data.action) {
            case 'media':
                sendMediaKey(data.params.type);
                break;
            case 'volume':
                await loudness.setVolume(data.params.value);
                break;
            case 'mute':
                const isMuted = await loudness.getMuted();
                await loudness.setMuted(!isMuted);
                break;
            case 'system':
                if (data.params.type === 'lock') {
                    shell.exec('rundll32.exe user32.dll,LockWorkStation');
                } else if (data.params.type === 'taskmgr') {
                    shell.exec('start taskmgr');
                }
                break;
        }
        
        // Send updated stats immediately after command
        const stats = await getSystemStats();
        io.emit('stats-update', stats);
    });

    socket.on('remote-input', (data) => {
        switch (data.type) {
            case 'mouse-move':
                // MOUSEEVENTF_MOVE = 0x0001
                executeWin32Mouse(data.params.dx, data.params.dy, 0x0001);
                break;
            case 'mouse-click':
                console.log(`Mouse ${data.params.button} click request received`);
                if (data.params.button === 'left') {
                    // LEFTDOWN = 0x0002, LEFTUP = 0x0004
                    executeWin32Mouse(0, 0, 0x0002);
                    executeWin32Mouse(0, 0, 0x0004);
                } else if (data.params.button === 'right') {
                    // RIGHTDOWN = 0x0008, RIGHTUP = 0x0010
                    executeWin32Mouse(0, 0, 0x0008);
                    executeWin32Mouse(0, 0, 0x0010);
                }
                break;
            case 'keyboard':
                if (data.params.text) {
                    console.log(`Keyboard text received: "${data.params.text}"`);
                    executeWin32Text(data.params.text);
                }
                break;
        }
    });

    socket.on('clipboard-sync', async (data) => {
        if (data.text && data.text !== lastClipboard) {
            console.log('Clipboard sync received from mobile');
            lastClipboard = data.text;
            try {
                // Handle both ESM and CJS styles if possible, or fallback to async write
                if (clipboardy.writeSync) {
                    clipboardy.writeSync(data.text);
                } else if (clipboardy.default && clipboardy.default.writeSync) {
                    clipboardy.default.writeSync(data.text);
                } else {
                    await clipboardy.write(data.text);
                }
            } catch (err) {
                console.error('Failed to write to clipboard:', err.message);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
    });
});

// Broadcast stats every 5 seconds
setInterval(async () => {
    if (io.engine.clientsCount > 0) {
        const stats = await getSystemStats();
        if (stats) {
            console.log(`Broadcasting stats to ${io.engine.clientsCount} devices`);
            io.emit('stats-update', stats);
        }
    }
}, 5000);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`   - Dashboard Server: http://localhost:${PORT}`);
});
