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

console.log("🚀 Starting EcoBridge Socket Server...");

// System monitoring function
async function getSystemStats() {
    try {
        const [cpu, mem, graphics, cpuTemp] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.graphics(),
            si.cpuTemperature()
        ]);
        
        // Find the primary GPU (usually the first one with a name)
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

        // Log stats for debugging (only if load is 0 to see if it's actually 0 or missing)
        if (stats.cpu.load === 0) {
            console.log("📊 Stats Debug - CPU Load is 0. Full data:", JSON.stringify(stats.cpu));
        }

        return stats;
    } catch (error) {
        console.error("❌ Error fetching stats:", error);
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
        console.log(`🎬 Media Action: ${key} (0x${vkCode.toString(16)})`);
        
        // PowerShell script to simulate media hardware key press
        const psScript = `
            $signature = '[DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);'
            $type = Add-Type -MemberDefinition $signature -Name "Win32Utils" -Namespace "Win32" -PassThru
            $type::keybd_event(${vkCode}, 0, 0, 0)
            $type::keybd_event(${vkCode}, 0, 2, 0)
        `;
        
        // Encode to Base64 (UTF-16LE) for PowerShell -EncodedCommand
        const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
        const result = shell.exec(`powershell -ExecutionPolicy Bypass -EncodedCommand ${encoded}`, { silent: true });
        if (result.code !== 0) {
            console.error(`❌ PowerShell Error (${result.code}):`, result.stderr);
        }
    }
}

io.on('connection', (socket) => {
    console.log('🔌 Device Connected:', socket.id);

    // Send initial stats on connection
    getSystemStats().then(stats => {
        if (stats) {
            console.log("📤 Sending initial stats to", socket.id);
            socket.emit('stats-update', stats);
        }
    });

    socket.on('register', (type) => {
        console.log(`📱 Registered as: ${type}`);
    });

    // Handle Commands
    socket.on('command', async (data) => {
        console.log(`🎮 Command Received: ${data.action}`, data.params);
        
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

    socket.on('disconnect', () => {
        console.log('❌ Disconnected:', socket.id);
    });
});

// Broadcast stats every 2 seconds
setInterval(async () => {
    if (io.engine.clientsCount > 0) {
        const stats = await getSystemStats();
        if (stats) {
            io.emit('stats-update', stats);
        }
    }
}, 2000);

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`   - Dashboard Server: http://localhost:${PORT}`);
});
