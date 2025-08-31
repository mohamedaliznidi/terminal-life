# Conway's Game of Life

A high-performance implementation of Conway's Game of Life built with React, TypeScript, and Canvas API. This cellular automaton demonstrates how complex patterns emerge from simple rules through an interactive, visually stunning simulation.

## 🚀 Live Demo

**[Try it live at terminal-life.vercel.app](https://terminal-life.vercel.app)**

## 📖 About

Conway's Game of Life, created by mathematician John Conway in 1970, is a fascinating cellular automaton that simulates the evolution of life on a grid. Despite its name, it's not a traditional game but rather a zero-player simulation where the evolution is determined by the initial state and four simple rules:

1. **Underpopulation**: Any live cell with fewer than two live neighbors dies
2. **Survival**: Any live cell with two or three live neighbors survives
3. **Overpopulation**: Any live cell with more than three live neighbors dies
4. **Reproduction**: Any dead cell with exactly three live neighbors becomes alive

These deceptively simple rules create incredibly complex and beautiful patterns, from stable structures to oscillators and even "spaceships" that move across the grid.

## ✨ Features

### 🎮 Interactive Simulation
- **Click to toggle cells** - Build your own patterns by clicking on the grid
- **Play/Pause controls** - Start and stop the simulation at any time
- **Step-by-step mode** - Advance one generation at a time for detailed observation
- **Speed control** - Adjustable simulation speed from 1x to 10x
- **Reset functionality** - Clear the grid and start fresh

### 🎨 Visual Customization
- **5 Color Schemes**: Classic green, amber, blue, matrix, and monochrome themes
- **3 Character Sets**: Choose between blocks, circles, and squares
- **Smooth theme transitions** with CSS animations
- **Responsive design** that works on desktop and mobile

### 📚 Pattern Library
Includes 15+ famous Conway's Game of Life patterns:

**Oscillators**
- Blinker, Toad, Beacon, Pulsar

**Spaceships**
- Glider, Lightweight Spaceship, Middleweight Spaceship, Heavyweight Spaceship

**Still Lifes**
- Block, Beehive, Loaf, Boat

**Methuselahs**
- R-pentomino, Diehard, Acorn

### 💾 Pattern Management
- **Save custom patterns** - Preserve your creations
- **Load saved patterns** - Quickly access your favorite configurations
- **Import/Export** - JSON-based pattern sharing with others
- **Pattern preview** - See patterns before loading them

### ⌨️ Keyboard Shortcuts
- **Space** - Play/Pause simulation
- **S** - Step forward one generation
- **R** - Reset/Clear grid

## 🛠️ Technology Stack

- **React 19.1.1** - Modern React with hooks for state management
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast development server and optimized builds
- **Tailwind CSS 4.1.12** - Utility-first styling with custom CSS variables
- **Canvas API** - High-performance grid rendering (60fps)
- **Radix UI** - Accessible, customizable UI components

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohamedaliznidi/terminal-life.git
   cd terminal-life
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Build for Production

```bash
yarn build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎯 Performance Optimizations

This implementation prioritizes performance through several key optimizations:

### Canvas Rendering
- Uses HTML5 Canvas instead of DOM elements for 60fps performance
- Batches rendering operations for efficiency
- Leverages `requestAnimationFrame` for smooth animations

### React Optimizations
- **Memoization**: Extensive use of `useMemo` and `useCallback` to prevent unnecessary re-renders
- **Immutable state management**: Ensures predictable updates and enables React's optimization strategies
- **Component separation**: Clear separation of concerns between game logic, UI controls, and rendering

### Memory Management
- Efficient grid data structures
- Minimal object allocations during simulation
- Optimized neighbor counting algorithms

## 🏗️ Architecture

The application follows a modular, component-based architecture:

- **Game Logic**: Pure functions for calculating next generations
- **State Management**: React hooks with immutable state updates
- **Rendering**: Canvas-based high-performance grid display
- **UI Components**: Reusable, accessible interface elements
- **Pattern System**: Modular pattern definitions and management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- John Conway for creating this fascinating mathematical concept
- The React and TypeScript communities for excellent tooling
- The open source community for inspiration and patterns
