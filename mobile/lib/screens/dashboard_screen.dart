import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:encrypt/encrypt.dart' as encrypt;
import 'dart:async';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late io.Socket socket;
  Map<String, dynamic> stats = {
    'cpu': {'load': 0, 'temp': 0},
    'ram': {'used': 0, 'total': 0, 'active': 0},
    'gpu': {'load': 0, 'temp': 0, 'name': 'Unknown'},
    'volume': 50,
    'muted': false,
  };
  bool isConnected = false;
  static String pcIp = "10.0.2.2"; // Static to persist between screen navigations
  static final TextEditingController _ipController = TextEditingController(text: pcIp);

  // Clipboard Bridge state
  String _lastClipboardContent = "";
  Timer? _clipboardTimer;
  final String _sharedSecret = "ecobridge_secret_key_2026_bridge";
  final String _fixedIv = "ecobridge_init_v";

  // Input Bridge state
  static const _inputChannel = MethodChannel('com.acwoc.ecobridge/input');

  @override
  void initState() {
    super.initState();
    initSocket();
    _startClipboardMonitor();
  }

  @override
  void dispose() {
    _clipboardTimer?.cancel();
    socket.off('stats-update');
    socket.off('clipboard-sync');
    socket.disconnect();
    socket.dispose();
    super.dispose();
  }

  // Encryption Helpers (AES-256-CBC)
  String _encrypt(String text) {
    final key = encrypt.Key.fromUtf8(_sharedSecret);
    final iv = encrypt.IV.fromUtf8(_fixedIv);
    final encrypter = encrypt.Encrypter(encrypt.AES(key, mode: encrypt.AESMode.cbc));
    final encrypted = encrypter.encrypt(text, iv: iv);
    return encrypted.base64;
  }

  String _decrypt(String ciphertext) {
    final key = encrypt.Key.fromUtf8(_sharedSecret);
    final iv = encrypt.IV.fromUtf8(_fixedIv);
    final encrypter = encrypt.Encrypter(encrypt.AES(key, mode: encrypt.AESMode.cbc));
    return encrypter.decrypt64(ciphertext, iv: iv);
  }

  void _startClipboardMonitor() {
    _clipboardTimer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      if (!isConnected) return;
      
      final data = await Clipboard.getData(Clipboard.kTextPlain);
      if (data != null && data.text != null && data.text != _lastClipboardContent) {
        debugPrint("Local clipboard changed, syncing to PC...");
        _lastClipboardContent = data.text!;
        socket.emit('clipboard-sync', {
          'content': _encrypt(data.text!),
          'timestamp': DateTime.now().millisecondsSinceEpoch,
        });
      }
    });
  }

  void initSocket() {
    // Disconnect existing socket if it exists to avoid multiple listeners
    try {
      socket.off('stats-update');
      socket.disconnect();
      socket.dispose();
    } catch (_) {
      // Ignore if socket wasn't initialized yet
    }

    socket = io.io('http://$pcIp:3001', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
      'reconnection': true,
      'forceNew': true, // Ensure a fresh connection
    });

    socket.onConnect((_) {
      setState(() => isConnected = true);
      socket.emit('register', 'mobile_dashboard');
    });

    socket.onDisconnect((_) {
      setState(() => isConnected = false);
    });

    socket.on('stats-update', (data) {
      if (mounted) {
        setState(() {
          stats = Map<String, dynamic>.from(data);
        });
      }
    });

    socket.on('clipboard-sync', (data) {
      try {
        final decrypted = _decrypt(data['content']);
        if (decrypted != _lastClipboardContent) {
          debugPrint("Clipboard received from PC, updating local...");
          _lastClipboardContent = decrypted;
          Clipboard.setData(ClipboardData(text: decrypted));
          
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text("Clipboard synced from PC"),
                duration: Duration(seconds: 2),
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        }
      } catch (e) {
        debugPrint("Failed to decrypt clipboard from PC: $e");
      }
    });
  }

  void sendCommand(String action, [Map<String, dynamic>? params]) {
    socket.emit('command', {'action': action, 'params': params ?? {}});
  }

  void _showIpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF111111),
        title: const Text("Connect to PC", style: TextStyle(color: Colors.white)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Enter your PC's Local IP address. Use 10.0.2.2 for standard emulators.",
              style: TextStyle(color: Colors.white70, fontSize: 13),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _ipController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "e.g. 192.168.1.10",
                hintStyle: const TextStyle(color: Colors.white24),
                filled: true,
                fillColor: Colors.white.withOpacity(0.05),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                pcIp = _ipController.text.trim();
              });
              initSocket();
              Navigator.pop(context);
            },
            child: const Text("Connect"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('System Dashboard', style: TextStyle(fontWeight: FontWeight.w600)),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_input_component, color: Colors.white70),
            onPressed: _showIpDialog,
          ),
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Icon(
              Icons.circle,
              size: 12,
              color: isConnected ? Colors.green : Colors.red,
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Row
            Row(
              children: [
                Expanded(child: _buildStatCard("CPU", "${stats['cpu']['load']}%", Icons.memory, Colors.blue)),
                const SizedBox(width: 16),
                Expanded(child: _buildStatCard("RAM", "${stats['ram']['used']}%", Icons.storage, Colors.purple)),
              ],
            ),
            const SizedBox(height: 16),
            _buildStatCard(
              "GPU: ${stats['gpu']['name']}", 
              "${stats['gpu']['load']}% | ${stats['gpu']['temp']}°C", 
              Icons.speed, 
              Colors.orange,
              isFullWidth: true
            ),
            
            const SizedBox(height: 32),
            const Text("Media Control", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white70)),
            const SizedBox(height: 16),
            
            // Media Controls
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20),
              decoration: BoxDecoration(
                color: const Color(0xFF111111),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.skip_previous_rounded, size: 36),
                        onPressed: () => sendCommand('media', {'type': 'prev'}),
                      ),
                      Container(
                        decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.white),
                        child: IconButton(
                          icon: const Icon(Icons.play_arrow_rounded, size: 42, color: Colors.black),
                          onPressed: () => sendCommand('media', {'type': 'playPause'}),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.skip_next_rounded, size: 36),
                        onPressed: () => sendCommand('media', {'type': 'next'}),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Row(
                      children: [
                        Icon(stats['muted'] ? Icons.volume_off : Icons.volume_up, color: Colors.white54),
                        Expanded(
                          child: Slider(
                            value: (stats['volume'] as num).toDouble(),
                            min: 0,
                            max: 100,
                            activeColor: Colors.white,
                            inactiveColor: Colors.white12,
                            onChanged: (val) {
                              setState(() => stats['volume'] = val.toInt());
                            },
                            onChangeEnd: (val) {
                              sendCommand('volume', {'value': val.toInt()});
                            },
                          ),
                        ),
                        Text("${stats['volume']}%", style: const TextStyle(color: Colors.white54)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),
            const Text("Quick Actions", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white70)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    "Lock PC",
                    Icons.lock_outline,
                    Colors.redAccent,
                    () => sendCommand('system', {'type': 'lock'}),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildActionButton(
                    "Task Mgr",
                    Icons.assignment_outlined,
                    Colors.greenAccent,
                    () => sendCommand('system', {'type': 'taskmgr'}),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 120), // Bottom padding
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color, {bool isFullWidth = false}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF111111),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white54, fontSize: 12)),
                const SizedBox(height: 4),
                Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(String label, IconData icon, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 8),
            Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
