import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'dart:async';

class InputScreen extends StatefulWidget {
  final io.Socket socket;
  final bool isConnected;

  const InputScreen({
    super.key,
    required this.socket,
    required this.isConnected,
  });

  @override
  State<InputScreen> createState() => _InputScreenState();
}

class _InputScreenState extends State<InputScreen> {
  void sendRemoteInput(String type, Map<String, dynamic> params) {
    if (widget.isConnected) {
      widget.socket.emit('remote-input', {'type': type, 'params': params});
    }
  }

  void _showKeyboardDialog() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF111111),
        title: const Text("Remote Keyboard", style: TextStyle(color: Colors.white)),
        content: TextField(
          controller: controller,
          autofocus: true,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: "Type something...",
            hintStyle: TextStyle(color: Colors.white24),
          ),
          onSubmitted: (text) {
            if (text.isNotEmpty) {
              sendRemoteInput('keyboard', {'text': text});
              controller.clear();
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Close"),
          ),
          ElevatedButton(
            onPressed: () {
              if (controller.text.isNotEmpty) {
                sendRemoteInput('keyboard', {'text': controller.text});
                controller.clear();
              }
            },
            child: const Text("Send"),
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
        title: const Text('Remote Input', style: TextStyle(fontWeight: FontWeight.w600)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Icon(
              Icons.circle,
              size: 12,
              color: widget.isConnected ? Colors.green : Colors.red,
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Remote Trackpad",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white70),
            ),
            const SizedBox(height: 16),
            _buildTrackpad(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildTrackpad() {
    return GestureDetector(
      onPanUpdate: (details) {
        sendRemoteInput('mouse-move', {
          'dx': details.delta.dx * 2.5,
          'dy': details.delta.dy * 2.5,
        });
      },
      onTap: () {
        sendRemoteInput('mouse-click', {'button': 'left'});
      },
      onLongPress: () {
        sendRemoteInput('mouse-click', {'button': 'right'});
      },
      child: Container(
        height: 350,
        width: double.infinity,
        decoration: BoxDecoration(
          color: const Color(0xFF111111),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Stack(
          children: [
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.mouse_outlined, color: Colors.white.withOpacity(0.1), size: 64),
                  const SizedBox(height: 8),
                  Text(
                    "Touch to Move | Tap for Left Click | Long Press for Right Click",
                    style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 12),
                  ),
                ],
              ),
            ),
            Positioned(
              top: 16,
              right: 16,
              child: IconButton(
                icon: const Icon(Icons.keyboard, color: Colors.white38),
                onPressed: _showKeyboardDialog,
              ),
            ),
          ],
        ),
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
