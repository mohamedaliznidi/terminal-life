import { useState, useCallback, useMemo } from 'react'

interface GameState {
  grid: boolean[][]
  generation: number
  isPlaying: boolean
  speed: number
  patternName: string
}

interface Pattern {
  name: string
  description: string
  grid: boolean[][]
  width: number
  height: number
}

const GRID_WIDTH = 40
const GRID_HEIGHT = 25

export function useGameOfLife() {
  const [gameState, setGameState] = useState<GameState>({
    grid: Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(false)),
    generation: 0,
    isPlaying: false,
    speed: 5,
    patternName: "Custom"
  })

  // Memoized empty grid creator
  const createEmptyGrid = useMemo(() => {
    return () => Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(false))
  }, [])

  // Optimized neighbor counting with memoization
  const countNeighbors = useCallback((grid: boolean[][], x: number, y: number) => {
    let count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        
        const nx = (x + dx + GRID_WIDTH) % GRID_WIDTH
        const ny = (y + dy + GRID_HEIGHT) % GRID_HEIGHT
        
        if (grid[ny][nx]) count++
      }
    }
    return count
  }, [])

  // Optimized next generation calculation
  const calculateNextGeneration = useCallback((grid: boolean[][]) => {
    const newGrid = createEmptyGrid()
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const neighbors = countNeighbors(grid, x, y)
        const isAlive = grid[y][x]
        
        // Conway's Game of Life rules
        if (isAlive && (neighbors === 2 || neighbors === 3)) {
          newGrid[y][x] = true // Survival
        } else if (!isAlive && neighbors === 3) {
          newGrid[y][x] = true // Birth
        }
        // Death by underpopulation or overpopulation (cell becomes false)
      }
    }
    
    return newGrid
  }, [createEmptyGrid, countNeighbors])

  // Load pattern into grid
  const loadPattern = useCallback((pattern: Pattern) => {
    const newGrid = createEmptyGrid()
    const startX = Math.floor((GRID_WIDTH - pattern.width) / 2)
    const startY = Math.floor((GRID_HEIGHT - pattern.height) / 2)
    
    for (let y = 0; y < pattern.height; y++) {
      for (let x = 0; x < pattern.width; x++) {
        if (startY + y < GRID_HEIGHT && startX + x < GRID_WIDTH) {
          newGrid[startY + y][startX + x] = pattern.grid[y][x]
        }
      }
    }
    
    setGameState((prev: GameState) => ({
      ...prev,
      grid: newGrid,
      generation: 0,
      patternName: pattern.name
    }))
  }, [createEmptyGrid])

  // Toggle individual cell
  const toggleCell = useCallback((x: number, y: number) => {
    setGameState((prev: GameState) => ({
      ...prev,
      grid: prev.grid.map((row, rowY) => 
        rowY === y ? row.map((cell, colX) => 
          colX === x ? !cell : cell
        ) : row
      ),
      patternName: "Custom"
    }))
  }, [])

  // Control handlers
  const handlePlayPause = useCallback(() => {
    setGameState((prev: GameState) => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [])

  const handleStep = useCallback(() => {
    setGameState((prev: GameState) => ({
      ...prev,
      grid: calculateNextGeneration(prev.grid),
      generation: prev.generation + 1
    }))
  }, [calculateNextGeneration])

  const handleReset = useCallback(() => {
    setGameState((prev: GameState) => ({
      ...prev,
      grid: createEmptyGrid(),
      generation: 0,
      isPlaying: false,
      patternName: "Custom"
    }))
  }, [createEmptyGrid])

  const handleClear = useCallback(() => {
    setGameState((prev: GameState) => ({
      ...prev,
      grid: createEmptyGrid(),
      generation: 0,
      isPlaying: false,
      patternName: "Custom"
    }))
  }, [createEmptyGrid])

  const setSpeed = useCallback((speed: number) => {
    setGameState((prev: GameState) => ({ ...prev, speed }))
  }, [])

  const setPatternName = useCallback((patternName: string) => {
    setGameState((prev: GameState) => ({ ...prev, patternName }))
  }, [])

  const nextGeneration = useCallback(() => {
    setGameState((prev: GameState) => ({
      ...prev,
      grid: calculateNextGeneration(prev.grid),
      generation: prev.generation + 1
    }))
  }, [calculateNextGeneration])

  return {
    gameState,
    setGameState,
    loadPattern,
    toggleCell,
    handlePlayPause,
    handleStep,
    handleReset,
    handleClear,
    setSpeed,
    setPatternName,
    nextGeneration,
    createEmptyGrid
  }
}
