import { useEffect, useRef, memo } from 'react'

interface GameGridProps {
  grid: boolean[][]
  colorScheme: {
    alive: string
    dead: string
    bg: string
  }
  characterSet: {
    alive: string
    dead: string
  }
  onCellClick: (x: number, y: number) => void
  cellSize?: number
  gridWidth?: number
  gridHeight?: number
}

const CELL_SIZE = 20
const GRID_WIDTH = 40
const GRID_HEIGHT = 25

// Memoized GameGrid component to prevent unnecessary re-renders
export const GameGrid = memo(function GameGrid({
  grid,
  colorScheme,
  characterSet,
  onCellClick,
  cellSize = CELL_SIZE,
  gridWidth = GRID_WIDTH,
  gridHeight = GRID_HEIGHT
}: GameGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Optimized canvas rendering with requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Use requestAnimationFrame for smoother rendering
    const render = () => {
      // Clear canvas
      ctx.fillStyle = colorScheme.bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Set font once for better performance
      ctx.font = `${cellSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Batch similar operations to reduce context switches
      let currentColor = ''
      
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const isAlive = grid[y][x]
          const char = isAlive ? characterSet.alive : characterSet.dead
          const color = isAlive ? colorScheme.alive : colorScheme.dead
          
          // Only change fillStyle when color actually changes
          if (currentColor !== color) {
            ctx.fillStyle = color
            currentColor = color
          }
          
          ctx.fillText(
            char, 
            x * cellSize + cellSize / 2, 
            y * cellSize + cellSize / 2
          )
        }
      }
    }
    
    requestAnimationFrame(render)
  }, [grid, colorScheme, characterSet, cellSize, gridWidth, gridHeight])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = Math.floor((e.clientX - rect.left) / cellSize)
      const y = Math.floor((e.clientY - rect.top) / cellSize)
      if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
        onCellClick(x, y)
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={gridWidth * cellSize}
      height={gridHeight * cellSize}
      className="cursor-pointer mx-auto block"
      onClick={handleCanvasClick}
    />
  )
})

// Additional performance optimization: Create a higher-order component for grid comparison
export const OptimizedGameGrid = memo(GameGrid, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  if (
    prevProps.colorScheme !== nextProps.colorScheme ||
    prevProps.characterSet !== nextProps.characterSet ||
    prevProps.cellSize !== nextProps.cellSize ||
    prevProps.gridWidth !== nextProps.gridWidth ||
    prevProps.gridHeight !== nextProps.gridHeight
  ) {
    return false
  }

  // Deep comparison for grid (only if dimensions match)
  if (
    prevProps.grid.length !== nextProps.grid.length ||
    prevProps.grid[0]?.length !== nextProps.grid[0]?.length
  ) {
    return false
  }

  // Compare grid contents
  for (let y = 0; y < prevProps.grid.length; y++) {
    for (let x = 0; x < prevProps.grid[y].length; x++) {
      if (prevProps.grid[y][x] !== nextProps.grid[y][x]) {
        return false
      }
    }
  }

  return true
})
