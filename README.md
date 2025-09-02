# 📅 InfiniCal

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A sleek, infinite-scrolling calendar with integrated journaling. Built with modern React and lightning-fast Vite for an exceptional user experience.

✨ **What's included:**
- Production-ready React app with seamless infinite scrolling
- Standalone HTML reference file for comparison

## 🚀 Quick Start

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build && npm run preview
```

## ✨ Key Features

🗓️ **Infinite Calendar Navigation**
- Smooth infinite scrolling with lazy loading
- Sticky month headers and intuitive day grids
- Smart keyboard shortcuts for power users

📝 **Integrated Journaling**
- Rich entry creation with ratings, categories, and images
- Swipeable 5-card overlay for browsing entries
- LocalStorage persistence with automatic sorting

🎨 **Modern UI/UX**
- Beautiful gradients and subtle shadows
- Responsive design with touch-friendly interactions
- Custom scrollbars and polished animations

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + ←/→` | Navigate months |
| `Ctrl + ↑/↓` | Navigate years |
| `Ctrl + T` | Jump to today |
| `Esc` | Close overlays |

## 💾 Data & Architecture

**Storage:** All journal entries persist in `localStorage` with automatic demo data seeding for new users.

**Tech Stack:** 
- **React 18** with modern hooks and components
- **Vite** for blazing-fast development and optimized builds  
- **date-fns** for reliable date operations
- **Framer Motion** for smooth animations

## 🚀 Deployment

Ready for deployment on any static hosting platform:
- **Netlify:** `npm run build` → deploy `dist/` folder
- **Vercel:** Connect your repo for automatic deployments
- **GitHub Pages:** Use the built-in Actions workflow

## 🛠️ Development Scripts

```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build locally
```

## 🎯 What's Next?

- 🔗 **Backend Integration** - Replace localStorage with REST/GraphQL APIs
- 🎨 **Theming System** - Add dark mode and customizable color schemes  
- 📱 **Mobile App** - React Native version for iOS/Android
- 🔄 **Real-time Sync** - Multi-device synchronization

---

**License:** MIT | **Made with** ❤️ **and** ⚡ **Vite**
