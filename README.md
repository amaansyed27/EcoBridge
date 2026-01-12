<div align="center">

# 🌉 EcoBridge

### Breaking the barriers between your devices

[![AcWoC 2026](https://img.shields.io/badge/AcWoC-2026-blue?style=for-the-badge)](https://github.com)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Features](#-features) • [Getting Started](#-getting-started) • [Contributing](#-contributing) • [Design](#-design--branding)

---

</div>

## 📖 Brief Description

EcoBridge is a high-performance, open-source ecosystem bridge that breaks down the proprietary walls between your devices. Turn your Android phone into a powerful extension of your Windows desktop—use it as a webcam, share your keyboard and clipboard, or pass through peripherals seamlessly. Built with Flutter and Electron, EcoBridge delivers low-latency performance with end-to-end encryption. Experience true device continuity without being locked into expensive, manufacturer-specific ecosystems.

### 🛠️ Main Tech Stack

[![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://www.android.com)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Windows](https://img.shields.io/badge/Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white)](https://www.microsoft.com/windows)

---

## 🎯 The Vision

Most "ecosystem" features—like using a phone as a webcam or sharing a keyboard—are locked behind expensive, proprietary walls (Apple Continuity, Samsung DeX, Motorola Ready For). **EcoBridge is the universal alternative.**

Our mission is to provide a "Continuity-like" experience for **everyone**, regardless of their hardware manufacturer. Turn your Android device into a powerful extension of your laptop with:

✨ **Low-latency performance**  
🔒 **End-to-end encryption**  
🌐 **Windows + Android support**  
🎨 **Beautiful, intuitive design**

> 🏆 **Featured Project for AcWoC 2026**  
> Android Club Winter of Code

---

## ✨ Features

### 1. 📹 Virtual Webcam
Transform your phone's high-resolution camera into a professional-quality webcam for your PC.

- **Target:** 1080p/60fps with <100ms latency
- **Tech:** WebRTC + MediaFoundation (Windows)
- **Use Case:** Video calls, streaming, content creation

### 2. ⌨️ Remote Input (HID over IP)
Control your phone using your laptop's keyboard and trackpad.

- **Target:** Seamless input mapping
- **Tech:** Desktop HID events → Android Accessibility Services
- **Use Case:** Type messages, navigate apps from your computer

### 3. 📋 Universal Clipboard
Copy on one device, paste on another—instantly.

- **Target:** Real-time, encrypted syncing
- **Tech:** Socket.io + AES-256 encryption
- **Use Case:** Seamless workflow across devices

### 4. 🎮 Accessory Passthrough
Use laptop peripherals (microphones, controllers) as inputs for Android.

- **Target:** Zero-latency peripheral sharing
- **Use Case:** Gaming, audio recording, extended functionality

---

## 🏗️ System Architecture

```
┌─────────────────┐                      ┌─────────────────┐
│   Desktop PC    │                      │  Android Phone  │
│   (Electron +   │◄─────Discovery──────►│    (Flutter)    │
│    Next.js)     │      (mDNS/UDP)      │                 │
└────────┬────────┘                      └────────┬────────┘
         │                                        │
         │         WebSocket (Signaling)          │
         │◄──────────────────────────────────────►│
         │           Socket.io + AES-256          │
         │                                        │
         │         WebRTC (Media Stream)          │
         │◄──────────────────────────────────────►│
         │         Low-latency UDP/TCP            │
         │                                        │
```

**Flow:**
1. **Discovery:** Desktop broadcasts presence via mDNS; Android scans and initiates handshake
2. **Signaling:** WebSocket connection exchanges ICE candidates and security keys
3. **Execution:** Control data via TCP (WebSockets); Media streams via UDP (WebRTC)

---

## 🛠️ Tech Stack

| Component | Technology | Why? |
|-----------|-----------|------|
| **Mobile App** | Flutter | Native camera APIs, high-performance UI, single codebase |
| **Desktop Client** | Electron + Next.js | System-level hooks with modern web interface |
| **Styling** | **Tailwind CSS 3.4** | Modern utility-first CSS (v4 avoided due to stability issues) |
| **Discovery** | mDNS (Multicast DNS) | Zero-config device discovery on local network |
| **Signaling** | Socket.io | Real-time bidirectional communication |
| **Media Streaming** | WebRTC | Industry-standard low-latency media protocol |
| **Security** | AES-256 + TLS | End-to-end encryption for all data |

> ⚠️ **Note:** We're using Tailwind CSS 3.4 instead of v4 due to stability concerns and known bugs in the v4 beta.

---

## 🚀 Getting Started

> **Note**: This project uses **Tailwind CSS v3.4** for stability and **Flutter 3.x**.

### Prerequisites

- **For Mobile Development:**
  - Flutter SDK (latest stable)
  - Android Studio / VS Code
  - Android device or emulator with Developer Mode enabled

- **For Desktop Development:**
  - Node.js (v18+)
  - npm or yarn
  - Windows

### 📱 Running the Mobile App (Flutter)

1. **Navigate to the mobile directory:**
   ```bash
   cd mobile
   ```

2. **Get dependencies:**
   ```bash
   flutter pub get
   ```

3. **Run on your device:**
   - Connect your Android phone via USB.
   - Run:
     ```bash
     flutter run
     ```
   - Select your device if prompted.

### 🖥️ Running the Desktop App (Electron + Next.js)

1. **Navigate to the desktop directory:**
   ```bash
   cd desktop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   This command starts both the Next.js renderer and the Electron main process concurrently.
   ```bash
   npm run dev
   ```

### 🤝 Connecting Devices

1. Start the **Desktop App** first (it initializes the discovery server).
2. Open the **Mobile App** on your phone (ensure it's on the same Wi-Fi network).
3. The mobile app should automatically detect the desktop and show "Online".

---

## 🎨 Design & Branding

Design is a **core pillar** of EcoBridge. We aren't just building a tool; we're building an **experience**.

### 🎯 Design Focus Areas

- **Brand Identity:** Logo design, iconography, color palette
- **Mobile UI/UX:** Flutter app screens and interactions
- **Desktop Dashboard:** Electron app interface and settings
- **Marketing:** Landing page, social media assets

### 📐 Design Guidelines

| ✅ Encouraged | ❌ Discouraged |
|--------------|---------------|
| Manual designs with thought and iteration | Raw AI-generated outputs |
| Figma or Google Stitch source files | Designs without source files |
| User-tested prototypes | "Hallucinated" UI elements |
| Accessibility considerations | Unreadable color contrasts |

**Submission:** Attach Figma/Stitch links or source files to design issues. AI can inspire, but manual refinement is required.

---

## 🤝 Contributing

We welcome contributors of all skill levels! Whether you're a seasoned developer or making your first open source contribution, there's a place for you here.

### 📚 Essential Reading

Before contributing, please review these documents:

1. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines and standards
2. **[AIPromptingMasterGuide.md](AIPromptingMasterGuide.md)** - How to effectively use AI tools

### 🚀 Recommended Development Strategies

#### For Beginners
- **Start Small:** Look for `good first issue` labels
- **Focus on One Feature:** Don't try to tackle multiple features at once
- **Ask Questions:** Use issue comments or discussions
- **Read Existing Code:** Learn from implemented patterns

#### Development Workflow
1. **Fork & Clone:** Create your own copy of the repository
2. **Create a Branch:** Use descriptive names like `feature/mdns-discovery` or `fix/gradle-error`
3. **Follow the Style:** Match existing code patterns and design language
4. **Test Thoroughly:** Verify on both mobile and desktop if applicable
5. **Document Changes:** Update relevant docs and add comments
6. **Submit PR:** Include clear description and screenshots/videos for UI changes

### 💡 Feature Implementation Strategies

#### Strategy 1: **Bottom-Up Approach**
Start with foundational components and build upward:
1. Create data models and services
2. Implement business logic
3. Add UI components
4. Integrate everything
5. Polish and optimize

**Good For:** Networking features, data persistence, background services

#### Strategy 2: **Top-Down Approach**
Start with UI and work backward:
1. Design the user interface
2. Create mock data
3. Implement backend logic
4. Connect real data
5. Handle edge cases

**Good For:** New screens, UI features, visual improvements

#### Strategy 3: **Slice Approach**
Implement a minimal end-to-end feature first:
1. Create simplest possible working version
2. Test the integration points
3. Iterate and add complexity
4. Refine and optimize

**Good For:** Complex features with multiple components (e.g., webcam streaming)

### 🛠️ Technical Implementation Tips

#### For Mobile (Flutter)
- Use `flutter pub outdated` to check dependency updates
- Run `flutter analyze` before committing
- Test on physical device, not just emulator
- Handle Android permissions properly (runtime requests)
- Use `const` constructors wherever possible

#### For Desktop (Electron + Next.js)
- Keep renderer process logic separate from main process
- Use IPC for system-level operations
- Test frameless window on Windows, macOS, and Linux
- Minimize bundle size (use dynamic imports)
- Implement proper error boundaries

#### For Networking
- Always handle connection failures gracefully
- Implement retry logic with exponential backoff
- Use timeouts for all network operations
- Test on different network conditions (WiFi, hotspot, slow connection)
- Log errors comprehensively for debugging

### 🎨 Design Guidelines Summary
- we can change this to greyish and add theme switchers as well
**Do:**
- ✅ Pure black (#000000) or very dark backgrounds
- ✅ White elements with subtle opacity (0.05-0.1 borders, 0.6-0.9 text)
- ✅ Rounded corners (24px cards, 20px pills, 30px+ for large elements)
- ✅ Minimal shadows and glows
- ✅ Generous spacing between elements
- ✅ Clean, sans-serif typography

**Don't:**
- ❌ Colorful gradients (purple, blue, etc.)
- ❌ Over-rounded corners (100px border radius on small elements)
- ❌ Nested cards or excessive layering
- ❌ Bright, saturated colors
- ❌ Cluttered interfaces

### 🔧 Common Setup Issues & Solutions

**Issue:** Gradle build fails with "Unsupported class file major version"  
**Solution:** Update Gradle wrapper to 8.12.1+ and AGP to 8.6.1+

**Issue:** NDK not found or corrupted  
**Solution:** Delete `~/AppData/Local/Android/sdk/ndk/[version]` and let Gradle re-download

**Issue:** Flutter packages incompatible  
**Solution:** Run `flutter pub upgrade --major-versions` carefully

**Issue:** Desktop app won't start  
**Solution:** Clear `node_modules`, run `npm install`, check Electron version compatibility

### 📊 How to Choose What to Work On

1. **Check Milestones:** Start with Phase 1 (The Backbone)
2. **Read Issues:** Look for `help wanted`, `good first issue`, `enhancement` labels
3. **Ask Maintainers:** Comment on issues to claim them=
4. **Improve Existing:** Refactor, optimize, add tests to existing features

### 🧪 Testing Your Changes

#### Manual Testing Checklist
- [ ] Feature works as expected
- [ ] No crashes or freezes
- [ ] UI looks good on different screen sizes
- [ ] Handles errors gracefully (no blank screens)
- [ ] Works on slow network
- [ ] No console errors or warnings

#### Automated Testing
- Write unit tests for business logic
- Write widget tests for UI components (Flutter)
- Write integration tests for full user flows
- Aim for >70% code coverage on critical features

### 🌟 How to Get Your PR Merged Fast

1. **Follow Guidelines:** Read and follow [CONTRIBUTING.md](CONTRIBUTING.md)
2. **Keep It Focused:** One PR per feature/fix
3. **Write Clear Descriptions:** Explain what, why, and how
4. **Add Screenshots/Videos:** For UI changes
5. **Test Thoroughly:** Include testing steps in PR description
6. **Respond to Feedback:** Address review comments promptly
7. **Use AI Wisely:** Follow [AIPromptingMasterGuide.md](AIPromptingMasterGuide.md)

### 🙋 Getting Help

- 📝 **Issues:** Open an issue labeled `question`
- 📖 **Docs:** Check existing markdown files in the repo
- 🤖 **AI Tools:** Use responsibly (see [AIPromptingMasterGuide.md](AIPromptingMasterGuide.md))

---
### 🤖 AI Usage Policy

We embrace modern tools, but maintain high standards:

| ✅ Acceptable | ❌ Not Acceptable |
|--------------|------------------|
| Using AI for boilerplate/suggestions | Copying raw AI output without review |
| AI-assisted debugging | "Prompt-and-push" contributions |
| Code generated + manually refined | Unverified, untested AI code |

**Rule:** Every PR must include a testing description. Quality over quantity.

### 📋 Contribution Areas

- 💻 **Core Development:** Networking, WebRTC, system APIs
- 📱 **Mobile Development:** Flutter UI, camera integration
- 🖥️ **Desktop Development:** Electron, system tray, drivers
- 🎨 **Design:** UI/UX, branding, graphics
- 📚 **Documentation:** Guides, tutorials, API docs
- 🧪 **Testing:** Unit tests, integration tests, QA

### 🔄 Continuous Integration

We use GitHub Actions to ensure code quality on every update.

**Desktop Workflow:**
- **Trigger:** Pushes to `main` and Pull Requests.
- **Steps:** Installs Node.js, dependencies, and runs `npm run build`.

**Mobile Workflow:**
- **Trigger:** Pushes to `main` and Pull Requests.
- **Steps:** Sets up Java & Flutter, runs `flutter pub get`, and executes `flutter analyze`.

---

## 📊 Project Structure

```
EcoBridge/
├── mobile/              # Flutter Android app
│   ├── lib/
│   │   ├── screens/     # UI screens
│   │   ├── services/    # Background services
│   │   └── utils/       # Helpers
│   └── pubspec.yaml
│
├── desktop/             # Electron + Next.js desktop app
│   ├── src/
│   │   ├── main/        # Electron main process
│   │   ├── renderer/    # Next.js frontend
│   │   └── bridge/      # Native modules
│   └── package.json
│
├── docs/                # Documentation
├── designs/             # Design files and assets
└── README.md
```

---

## 🔒 Security

Security is paramount. All communications are encrypted:

- **Transport Layer:** TLS 1.3
- **Application Layer:** AES-256 encryption
- **Authentication:** RSA key exchange
- **Privacy:** No telemetry, all processing is local

**Found a security issue?** Please email [security@yourdomain.com] instead of opening a public issue.

---

## 🌟 Community

- 💬 **Discord:** [Join our server](#) (coming soon)
- 🐦 **Twitter:** [@EcoBridge](#) (coming soon)
- 📝 **Blog:** Updates and technical deep-dives (coming soon)

---

## 📜 License

EcoBridge is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

This means you can:
- ✅ Use it commercially
- ✅ Modify it
- ✅ Distribute it
- ✅ Use it privately

---

## 🙏 Acknowledgments

- **AcWoC 2026** for featuring this project
- **Android Club** for organizing this amazing initiative
- All our **contributors** who make this project possible

---

<div align="center">

**Created with ❤️ for AcWoC 2026**

**Star ⭐ this repo if you find it interesting!**

</div>
