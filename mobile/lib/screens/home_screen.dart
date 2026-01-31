import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'dashboard_screen.dart';
import 'input_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const _inputChannel = MethodChannel('com.acwoc.ecobridge/input');

  // Shared Socket state
  static io.Socket? _socket;
  static bool _isConnected = false;
  static String _pcIp = "10.0.2.2";

  void _initGlobalSocket() {
    if (_socket != null) return;

    _socket = io.io('http://$_pcIp:3001', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
      'reconnection': true,
    });

    _socket!.onConnect((_) {
      _isConnected = true;
    });

    _socket!.on('clipboard-sync', (data) {
      if (data != null && data['text'] != null) {
        Clipboard.setData(ClipboardData(text: data['text']));
      }
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
    });
  }

  Future<void> _checkAccessibility(BuildContext context) async {
    _initGlobalSocket();
    final bool enabled = await _inputChannel.invokeMethod('isAccessibilityServiceEnabled');
    if (!enabled && context.mounted) {
      // ... same dialog logic ...
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: const Color(0xFF111111),
          title: const Text("Accessibility Required", style: TextStyle(color: Colors.white)),
          content: const Text(
            "To use Remote Input, you need to enable the EcoBridge Accessibility Service in your phone settings.",
            style: TextStyle(color: Colors.white70),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Later"),
            ),
            ElevatedButton(
              onPressed: () {
                _inputChannel.invokeMethod('openAccessibilitySettings');
                Navigator.pop(context);
              },
              child: const Text("Enable Now"),
            ),
          ],
        ),
      );
    } else if (enabled && context.mounted) {
       Navigator.push(
        context, 
        MaterialPageRoute(
          builder: (_) => InputScreen(socket: _socket!, isConnected: _isConnected)
        )
      );
    }
  }

  Future<void> _syncClipboard(BuildContext context) async {
    _initGlobalSocket();
    final data = await Clipboard.getData(Clipboard.kTextPlain);
    if (data != null && data.text != null && _isConnected) {
      _socket!.emit('clipboard-sync', {'text': data.text});
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Clipboard synced to PC"),
            duration: Duration(seconds: 2),
            backgroundColor: Color(0xFF111111),
          ),
        );
      }
    } else if (!_isConnected && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Not connected to PC"),
          duration: Duration(seconds: 2),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Minimal Ambient Aura
          Positioned(
            top: -100,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.03),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.white.withValues(alpha: 0.05),
                      blurRadius: 120,
                      spreadRadius: 40,
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'EcoBridge',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w600,
                        letterSpacing: -0.5,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                  
                const Spacer(),

                // Central Hero Section - Minimalist Glass
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Main Visual
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          color: const Color(0xFF111111),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.05),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.5),
                              blurRadius: 30,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.phonelink_ring_rounded,
                          size: 48,
                          color: Colors.white.withValues(alpha: 0.9),
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(),
                
                // Bottom Actions - Minimal Grid
                Row(
                  children: [
                    Expanded(child: _buildMinimalAction(context, Icons.videocam_outlined, "Webcam", () {})),
                    const SizedBox(width: 12),
                    Expanded(child: _buildMinimalAction(context, Icons.keyboard_outlined, "Input", () => _checkAccessibility(context))),
                    const SizedBox(width: 12),
                    Expanded(child: _buildMinimalAction(context, Icons.copy_rounded, "Clipboard", () => _syncClipboard(context))),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildMinimalAction(
                        context, 
                        Icons.dashboard_customize_outlined, 
                        "Dashboard", 
                        () => Navigator.push(context, MaterialPageRoute(builder: (_) => const DashboardScreen()))
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Container()), // Placeholder for symmetry
                    const SizedBox(width: 12),
                    Expanded(child: Container()), // Placeholder for symmetry
                  ],
                ),
                const SizedBox(height: 48),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMinimalAction(BuildContext context, IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 90,
        decoration: BoxDecoration(
          color: const Color(0xFF0F0F0F),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.05),
            width: 0.5,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white.withValues(alpha: 0.8), size: 26),
            const SizedBox(height: 10),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.white.withValues(alpha: 0.4),
                fontWeight: FontWeight.w500,
                letterSpacing: 0.3,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Keeping empty classes to satisfy imports if needed, though unused in new design
class GlassCard extends StatelessWidget {
  final Widget child;
  const GlassCard({super.key, required this.child});
  @override
  Widget build(BuildContext context) => child;
}

class FeaturePill extends StatelessWidget {
  final String text;
  const FeaturePill({super.key, required this.text});
  @override
  Widget build(BuildContext context) => const SizedBox();
}
