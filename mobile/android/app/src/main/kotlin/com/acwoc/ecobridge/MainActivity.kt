package com.acwoc.ecobridge

import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import android.content.Context
import android.provider.Settings
import android.content.Intent
import android.view.accessibility.AccessibilityManager
import android.accessibilityservice.AccessibilityService

class MainActivity: FlutterActivity() {
    private val CHANNEL = "com.acwoc.ecobridge/input"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "isAccessibilityServiceEnabled" -> {
                    result.success(isAccessibilityServiceEnabled())
                }
                "openAccessibilitySettings" -> {
                    val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
                    startActivity(intent)
                    result.success(true)
                }
                "injectInput" -> {
                    val type = call.argument<String>("type")
                    val params = call.argument<Map<String, Any>>("params")
                    
                    val service = EcoBridgeAccessibilityService.instance
                    if (service == null) {
                        result.error("SERVICE_UNAVAILABLE", "Accessibility service not running", null)
                        return@setMethodCallHandler
                    }

                    when (type) {
                        "tap" -> {
                            val x = (params?.get("x") as? Number)?.toFloat() ?: 0f
                            val y = (params?.get("y") as? Number)?.toFloat() ?: 0f
                            service.injectTap(x, y)
                            result.success(true)
                        }
                        "swipe" -> {
                            val x1 = (params?.get("x1") as? Number)?.toFloat() ?: 0f
                            val y1 = (params?.get("y1") as? Number)?.toFloat() ?: 0f
                            val x2 = (params?.get("x2") as? Number)?.toFloat() ?: 0f
                            val y2 = (params?.get("y2") as? Number)?.toFloat() ?: 0f
                            val duration = (params?.get("duration") as? Number)?.toLong() ?: 300L
                            service.injectSwipe(x1, y1, x2, y2, duration)
                            result.success(true)
                        }
                        "back" -> {
                            service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK)
                            result.success(true)
                        }
                        "home" -> {
                            service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME)
                            result.success(true)
                        }
                        else -> result.notImplemented()
                    }
                }
                else -> result.notImplemented()
            }
        }
    }

    private fun isAccessibilityServiceEnabled(): Boolean {
        val am = getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
        val enabledServices = Settings.Secure.getString(contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
        return enabledServices?.contains(packageName) ?: false
    }
}
