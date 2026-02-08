import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import si from 'systeminformation';
import loudness from 'loudness';
import shell from 'shelljs';
import clipboardy from 'clipboardy';
import { 
  SystemStatsSchema, 
  CommandSchema, 
  RemoteInputSchema, 
  ClipboardSyncSchema,
  RegisterSchema,
  VideoFrameSchema,
  type SystemStats
} from './src/types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = 3001;

console.log("Starting EcoBridge Socket Server...");

async function getSystemStats(): Promise<SystemStats | null> {
    try {
        const cpu = await si.currentLoad().catch(() => ({ currentLoad: 0 }));
        const mem = await si.mem().catch(() => ({ total: 1, available: 1 }));
        const graphics = await si.graphics().catch(() => ({ controllers: [] }));
        const cpuTemp = await si.cpuTemperature().catch(() => ({ main: 0 }));
        
        const controllers = graphics.controllers || [];
        const mainGpu = controllers.find(g => g.model && !g.model.includes('Virtual')) || controllers[0] || {};

        const stats: SystemStats = {
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
                load: Number(mainGpu.utilizationGpu || mainGpu.memoryUsed || 0),
                temp: Number(mainGpu.temperatureGpu || 0),
                name: mainGpu.model || 'Unknown'
            },
            volume: await loudness.getVolume().catch(() => 50),
            muted: await loudness.getMuted().catch(() => false)
        };

        return SystemStatsSchema.parse(stats);
    } catch (error) {
        console.error("Critical error in getSystemStats:", error);
        return null;
    }
}

function sendMediaKey(key: 'playPause' | 'next' | 'prev' | 'stop') {
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

function executeWin32Key(vkCode: number, flags: number = 0) {
    const psScript = `
        $signature = '[DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);'
        $type = Add-Type -MemberDefinition $signature -Name "Win32Utils" -Namespace "Win32" -PassThru
        $type::keybd_event(${vkCode}, 0, ${flags}, 0)
        ${flags === 0 ? `$type::keybd_event(${vkCode}, 0, 2, 0)` : ''}
    `;
    const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
    shell.exec(`powershell -ExecutionPolicy Bypass -EncodedCommand ${encoded}`, { silent: true });
}

let lastClipboard = '';

setInterval(async () => {
    try {
        let current: string;
        // @ts-ignore - clipboardy types can be tricky with ESM/CJS
        if (clipboardy.readSync) {
            // @ts-ignore
            current = clipboardy.readSync();
        } else if ((clipboardy as any).default && (clipboardy as any).default.readSync) {
            current = (clipboardy as any).default.readSync();
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
        // Silent fail
    }
}, 2000);

function executeWin32Mouse(dx: number, dy: number, flags: number) {
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

function executeWin32Text(text: string) {
    const psScript = `
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait("${text.replace(/"/g, '""')}")
    `;
    const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
    shell.exec(`powershell -ExecutionPolicy Bypass -EncodedCommand ${encoded}`, { silent: true });
}

io.on('connection', (socket: Socket) => {
    console.log('Device Connected:', socket.id);

    getSystemStats().then(stats => {
        if (stats) {
            socket.emit('stats-update', stats);
        }
    });

    socket.on('register', async (rawType: unknown) => {
        const result = RegisterSchema.safeParse(rawType);
        if (!result.success) return;
        
        const type = result.data;
        console.log(`Registered as: ${type}`);
        const stats = await getSystemStats();
        if (stats) {
            socket.emit('stats-update', stats);
        }
    });

    socket.on('command', async (rawData: unknown) => {
        const result = CommandSchema.safeParse(rawData);
        if (!result.success) {
            console.error('Invalid command data:', result.error.format());
            return;
        }
        
        const data = result.data;
        console.log(`Command Received: ${data.action}`, data.params);
        
        switch (data.action) {
            case 'media':
                if (data.params.type && ['playPause', 'next', 'prev', 'stop'].includes(data.params.type)) {
                    sendMediaKey(data.params.type as any);
                }
                break;
            case 'volume':
                if (typeof data.params.value === 'number') {
                    await loudness.setVolume(data.params.value);
                }
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
        
        const stats = await getSystemStats();
        if (stats) io.emit('stats-update', stats);
    });

    socket.on('remote-input', (rawData: unknown) => {
        const result = RemoteInputSchema.safeParse(rawData);
        if (!result.success) {
            console.error('Invalid remote-input data:', result.error.format());
            return;
        }

        const data = result.data;
        switch (data.type) {
            case 'mouse-move':
                executeWin32Mouse(data.params.dx, data.params.dy, 0x0001);
                break;
            case 'mouse-click':
                if (data.params.button === 'left') {
                    executeWin32Mouse(0, 0, 0x0002);
                    executeWin32Mouse(0, 0, 0x0004);
                } else if (data.params.button === 'right') {
                    executeWin32Mouse(0, 0, 0x0008);
                    executeWin32Mouse(0, 0, 0x0010);
                }
                break;
            case 'keyboard':
                if (data.params.text) {
                    executeWin32Text(data.params.text);
                }
                break;
        }
    });

    socket.on('clipboard-sync', async (rawData: unknown) => {
        const result = ClipboardSyncSchema.safeParse(rawData);
        if (!result.success) return;

        const data = result.data;
        if (data.text && data.text !== lastClipboard) {
            console.log('Clipboard sync received from mobile');
            lastClipboard = data.text;
            try {
                // @ts-ignore
                if (clipboardy.writeSync) {
                    // @ts-ignore
                    clipboardy.writeSync(data.text);
                } else if ((clipboardy as any).default && (clipboardy as any).default.writeSync) {
                    (clipboardy as any).default.writeSync(data.text);
                } else {
                    await clipboardy.write(data.text);
                }
            } catch (err: any) {
                console.error('Failed to write to clipboard:', err.message);
            }
        }
    });

    socket.on('video-frame', (rawData: unknown) => {
        // Broadcast raw binary data to all connected clients
        socket.broadcast.emit('video-frame', rawData);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
    });
});

setInterval(async () => {
    if (io.engine.clientsCount > 0) {
        const stats = await getSystemStats();
        if (stats) {
            io.emit('stats-update', stats);
        }
    }
}, 5000);

server.listen(PORT, () => {
    console.log(`Socket Server running on port ${PORT}`);
});
