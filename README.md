# 📅 InfiniCal - Infinite Calendar & Journal

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

A modern, feature-rich infinite calendar with integrated journaling capabilities. Experience seamless infinite scrolling, beautiful animations, and intuitive touch interactions - all built with React and powered by Vite for blazing-fast performance.

## 🎯 What Makes InfiniCal Special

✨ **Infinite Scrolling Calendar** - Navigate through months effortlessly with lazy loading  
🎠 **5-Card Carousel View** - Browse journal entries with cinematic swipe transitions  
📱 **Touch-First Design** - Optimized for both desktop and mobile interactions  
🎨 **Beautiful Animations** - Smooth Framer Motion transitions throughout  
💾 **Smart Persistence** - LocalStorage with automatic demo data seeding  
⌨️ **Power User Shortcuts** - Full keyboard navigation support  

## 📦 Installation & Setup Options

### Option 1: React Development Environment

**Prerequisites:** Node.js 18+ and npm

```bash
# Clone the repository
git clone https://github.com/bansalbhunesh/InfiniCal.git
cd InfiniCal

# Install dependencies
npm install

# Start development server (opens automatically)
npm run dev

# Or use the Windows batch file
start-dev.bat
```

### Option 2: Standalone HTML File

For quick testing or offline use, open the standalone file directly:

```bash
# Simply open in any modern browser
open infinite-calendar-final.html
# or double-click the file in Windows Explorer
```

**No installation required!** The standalone file contains everything needed to run InfiniCal.

## ✨ Comprehensive Feature Overview

### 🗓️ **Advanced Calendar Navigation**
- **Infinite Scrolling**: Seamlessly browse through unlimited months with intelligent lazy loading
- **Sticky Headers**: Month and year headers remain visible while scrolling for context
- **Smart Day States**: Visual indicators for today, selected dates, and outside-month days
- **Entry Badges**: Quick visual count of journal entries per day
- **Quick Jump**: Click month/year headers to instantly navigate to any date

### 🎠 **Revolutionary Carousel System**
- **5-Card Window**: See previous, current, and next entries simultaneously in a cinematic layout
- **Touch Swipe Support**: Natural left/right swipe gestures on mobile and trackpad
- **Keyboard Navigation**: Arrow keys for precise control and accessibility
- **Smart Positioning**: Cards animate with smooth transitions (far-prev → prev → current → next → far-next)
- **Click Navigation**: Tap side cards to navigate instantly

### 📝 **Rich Journaling Experience**
- **Multi-Modal Entries**: Add descriptions, star ratings (1-5), categories, and optional images
- **Smart Categories**: Pill-based category system with visual color coding
- **Image Integration**: Support for web URLs with automatic optimization
- **Rating System**: Interactive star ratings with hover effects and visual feedback
- **Auto-Sort**: Entries automatically sorted by rating (highest first) for quality prioritization

### 🎯 **Toggle & View Controls**
- **Month/Year Toggle**: Switch between month and year picker modes with active state indicators
- **View Mode Persistence**: Your preferred view mode is remembered across sessions
- **Dual Panel Layout**: Calendar on left, journal entries on right for efficient workflow
- **Overlay Toggle**: Switch between inline journal panel and full-screen carousel overlay

### 📱 **Touch & Interaction Design**
- **Responsive Touch Targets**: All buttons and interactive elements optimized for finger taps
- **Swipe Gestures**: Natural swipe navigation throughout the application
- **Double-Click Actions**: Double-click any day to instantly open journal entries for that date
- **Hover States**: Subtle visual feedback for all interactive elements
- **Loading States**: Smooth transitions and loading indicators for all async operations

## ⌨️ Power User Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl + ←/→` | Navigate months | Calendar view |
| `Ctrl + ↑/↓` | Navigate years | Calendar view |
| `Ctrl + T` | Jump to today | Any view |
| `Esc` | Close overlays/modals | Any overlay |
| `←/→` | Navigate carousel | Journal overlay |
| `Double-click` | Open journal for date | Calendar day |

## 🛠️ Development & Build Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
start-dev.bat           # Windows batch file (sets Node path)

# Production
npm run build           # Create optimized build in dist/
npm run preview         # Preview production build locally

# Package Management
npm install             # Install all dependencies
npm update              # Update to latest compatible versions
```

## 📁 Project Structure & Architecture

```
InfiniCal/
├── 📄 infinite-calendar-final.html    # Standalone version (no dependencies)
├── 📄 start-dev.bat                   # Windows development launcher
├── 📄 index.html                      # Vite entry point
├── 📦 package.json                    # Dependencies & scripts
└── src/
    ├── 📄 main.jsx                    # App bootstrap + demo data seeding
    ├── 📄 App.jsx                     # Root component & layout
    ├── 🎨 styles.css                  # Global styles & animations
    ├── components/
    │   ├── 🗓️ InfiniteCalendar.jsx    # Main calendar with infinite scroll
    │   ├── 🎠 JournalOverlay.jsx      # 5-card carousel overlay
    │   ├── ➕ AddEntryModal.jsx        # Entry creation/editing modal
    │   ├── 📅 MonthYearPicker.jsx     # Date navigation picker
    │   ├── 📊 YearPicker.jsx          # Year selection component
    │   └── 🔔 Toast.jsx               # Success/error notifications
    ├── state/
    │   ├── 💾 journalStore.js         # LocalStorage CRUD operations
    │   └── 🌱 seed.js                 # Demo data generation (25+ images)
    └── utils/
        └── 📅 date.js                 # Date formatting & grid generation
```

## 💾 Data Persistence & Storage

**LocalStorage Schema:**
- **Key**: `journalEntries`
- **Structure**: `{ "YYYY-MM-DD": [entry1, entry2, ...] }`
- **Auto-Seeding**: 180 days of demo data (past 90 + future 90 days)
- **Demo Images**: 25+ categorized images from Pexels (fitness, food, nature, etc.)

**Entry Format:**
```javascript
{
  id: "unique-identifier",
  description: "Entry text content",
  rating: 4.2,                    // 1.0 to 5.0
  categories: ["Fitness", "Outdoor"],
  imgUrl: "https://...",          // Optional image URL
  date: "12/25/2023",            // Display format
  dateObject: Date,              // JavaScript Date object
  dateKey: "2023-12-25"         // Storage key format
}
```

## 🎨 Tech Stack & Dependencies

**Core Framework:**
- **React 18.2+** - Modern hooks, concurrent features, and Suspense
- **Vite 4.5+** - Lightning-fast HMR and optimized production builds

**Animation & Motion:**
- **Framer Motion 10.16+** - Smooth transitions and gesture handling
- **Custom CSS Animations** - Optimized for performance and accessibility

**Date Operations:**
- **date-fns 2.30+** - Lightweight, modular date utility library
- **Custom Date Utils** - Infinite calendar grid generation and formatting

**Development Tools:**
- **@vitejs/plugin-react** - Fast Refresh and JSX support
- **Modern ES Modules** - Tree-shaking and optimal bundling

## 🚀 Deployment Options

### 🌐 Netlify (Recommended)
```bash
# Build and deploy
npm run build
# Drag dist/ folder to netlify.com or connect Git repo
```

### ⚡ Vercel
```bash
# Connect GitHub repo for automatic deployments
# Build Command: npm run build
# Output Directory: dist
```

### 🔄 GitHub Pages
```bash
# Use GitHub Actions workflow
# Build: npm run build
# Deploy: dist/ folder to gh-pages branch
```

### 📁 Static Hosting
The `dist/` folder after `npm run build` contains everything needed for any static hosting service.

## 🎯 Roadmap & Future Enhancements

### 🔜 **Coming Soon**
- 🌙 **Dark Mode** - Complete theme system with user preference persistence
- 🔐 **User Authentication** - Secure account system with profile management
- ☁️ **Cloud Sync** - Real-time synchronization across devices
- 📤 **Export Features** - PDF, CSV, and JSON export capabilities

### 🚀 **Future Vision**
- 📱 **Mobile Apps** - Native iOS and Android applications
- 🤖 **AI Integration** - Smart categorization and mood analysis
- 🔗 **API Backend** - RESTful API with database persistence
- 🎨 **Advanced Theming** - Custom color schemes and layout options
- 📊 **Analytics Dashboard** - Mood tracking and journaling insights

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and feel free to:
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 🔧 Submit pull requests
- 📚 Improve documentation

## 📄 License & Credits

**License:** MIT - Feel free to use in personal and commercial projects

**Built with:** ❤️ **React** ⚡ **Vite** 🎨 **Framer Motion**

**Images:** Demo images courtesy of [Pexels](https://pexels.com) - Free stock photography
