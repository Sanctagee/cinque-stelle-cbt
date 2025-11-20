# cinque-stelle-cbt
Built with passion for Nigerian students' educational success 🇳🇬

# Cinque Stelle CBT Platform 🎓⭐

A five-star test preparation platform designed to help Nigerian students excel in JAMB, WAEC, and NECO examinations through intelligent practice tests and personalized feedback.

![Cinque Stelle CBT](https://img.shields.io/badge/Status-In%20Development-yellow)
![WDD330](https://img.shields.io/badge/WDD330-Final%20Project-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF)

## 🌟 Features

- **Smart Exam Simulation** - Timed practice tests with real exam conditions
- **Personalized Dashboard** - Progress tracking with Chart.js visualizations
- **Adaptive Learning** - Intelligent question selection based on performance
- **Mobile-First Design** - Fully responsive across all devices
- **Offline Capability** - localStorage for progress persistence
- **Modern UI/UX** - Smooth animations and intuitive interface

## 🚀 Live Demo

[View Live Application](https://your-netlify-url.netlify.app) *(Update after deployment)*

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+ Modules)
- **Build Tool**: Vite
- **Styling**: Modern CSS with Nesting & Animations
- **Charts**: Chart.js
- **Icons**: Custom SVG & Emoji
- **Deployment**: Netlify

## 📁 Project Structure

cinque-stelle-cbt/
├── src/
│ ├── js/
│ │ ├── modules/ # ES6 Modules
│ │ │ ├── auth.js # Authentication & localStorage
│ │ │ ├── examEngine.js # Exam simulation logic
│ │ │ ├── dashboard.js # Chart.js integration
│ │ │ └── utils.js # Utility functions
│ │ └── data/
│ │ └── questions.json # Exam question bank
│ ├── styles/
│ │ ├── main.css # Global styles with CSS nesting
│ │ └── modules/ # Component styles
│ └── assets/ # Images & icons
├── index.html # Landing page
├── dashboard.html # Student dashboard
├── exams.html # Exam selection
├── test-interface.html # Exam simulation
└── vite.config.js # Vite configuration


## 🎯 WDD330 Course Concepts Demonstrated

### ✅ Core Requirements Met:
- **ES6 Modules** - Modular architecture with separated concerns
- **localStorage API** - User authentication & progress persistence
- **Fetch API** - Dynamic loading of JSON question data
- **Third-party APIs** - Chart.js for data visualization
- **Modern CSS** - Nesting, animations, and responsive design
- **Form Validation** - Constraint Validation API implementation
- **Events** - Multiple event handlers for interactive experience

### ✅ Advanced Features:
- **Dataset Attributes** - For exam filtering and data binding
- **CSS Animations** - Smooth transitions and micro-interactions
- **Debounced Search** - Optimized performance for real-time filtering
- **Modal Management** - Accessible modal system with focus trapping
- **Responsive Navigation** - Mobile-first hamburger menu

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Sanctagee/cinque-stelle-cbt.git

# Navigate to project directory
cd cinque-stelle-cbt

# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Preview production build
npm run preview
