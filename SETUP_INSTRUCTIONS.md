# 🚀 Quick Setup Instructions

## Step 1: Install Node.js

**Option A - Using Windows Package Manager (Recommended):**
```powershell
winget install OpenJS.NodeJS
```

**Option B - Manual Download:**
1. Visit [nodejs.org](https://nodejs.org)
2. Download the LTS version
3. Run the installer

## Step 2: Restart Your Terminal
Close and reopen PowerShell/Command Prompt to refresh environment variables.

## Step 3: Verify Installation
```bash
node --version
npm --version
```

## Step 4: Install Dependencies & Run
```bash
cd C:\Users\Home\infinite-calendar
npm install
npm run dev
```

## Step 5: Open in Browser
Navigate to: **http://localhost:3000**

---

## 🌐 Deploy Online (After Setup)

### Vercel (Easiest):
1. Create account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Auto-deploy with zero configuration

### Netlify:
1. Create account at [netlify.com](https://netlify.com)  
2. Drag & drop the `dist` folder after running `npm run build`

---

## ✨ What You'll Get:

- **🗓️ Infinite scrolling calendar** with smooth performance
- **📱 Mobile-optimized** touch gestures and swipe navigation
- **📔 Journal entries** with mood indicators and beautiful cards
- **⚡ Vanilla JS performance** optimizations for lag-free scrolling
- **🎨 Beautiful UI** with glassmorphism design and animations

---

## 🛠️ Technical Features:

### React + Vanilla JavaScript Hybrid:
- **React**: Component structure and state management
- **Vanilla JS**: Performance-critical scroll handling, touch events, and optimizations
- **Framer Motion**: Smooth animations and gesture recognition
- **Vite**: Lightning-fast development and build

### Performance Optimizations:
- **Virtualized scrolling**: Only renders visible months + buffer
- **Throttled events**: 60fps scroll performance with 16ms throttling
- **Hardware acceleration**: GPU-optimized transforms
- **Touch events**: Native touch handling for mobile
- **Memory efficient**: Automatic cleanup and minimal re-renders

### Mobile Features:
- **Infinite scrolling**: Smooth momentum scrolling on all devices
- **Swipe gestures**: Navigate journal entries with touch
- **Responsive design**: Optimized for phones, tablets, and desktop
- **Touch-friendly**: Large tap targets and visual feedback

Enjoy your infinite calendar! 🎉
