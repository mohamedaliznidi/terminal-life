import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomSlider } from '@/components/ui/custom-slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, SkipForward, RotateCcw, Square, Save, Upload, Download, Trash2, Share2 } from 'lucide-react'
import { useGameOfLife } from '@/hooks/useGameOfLife'
import { OptimizedGameGrid } from '@/components/GameGrid'



interface Pattern {
  name: string
  description: string
  grid: boolean[][]
  width: number
  height: number
}



const GRID_WIDTH = 40
const GRID_HEIGHT = 25


const FAMOUS_PATTERNS: Pattern[] = [
  {
    name: "Glider",
    description: "A small spaceship that moves diagonally",
    grid: [
      [false, true, false],
      [false, false, true],
      [true, true, true]
    ],
    width: 3,
    height: 3
  },
  {
    name: "Blinker",
    description: "A simple oscillator that flips between states",
    grid: [
      [true, true, true]
    ],
    width: 3,
    height: 1
  },
  {
    name: "Toad",
    description: "A period-2 oscillator",
    grid: [
      [false, true, true, true],
      [true, true, true, false]
    ],
    width: 4,
    height: 2
  },
  {
    name: "Beacon",
    description: "A period-2 oscillator",
    grid: [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, true, true],
      [false, false, true, true]
    ],
    width: 4,
    height: 4
  },
  {
    name: "Pulsar",
    description: "A period-3 oscillator",
    grid: [
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, true, true, true, false, false, false, true, true, true, false, false]
    ],
    width: 13,
    height: 13
  },
  {
    name: "Block",
    description: "A simple still life that never changes",
    grid: [
      [true, true],
      [true, true]
    ],
    width: 2,
    height: 2
  },
  {
    name: "Beehive",
    description: "A still life that remains stable",
    grid: [
      [false, true, true, false],
      [true, false, false, true],
      [false, true, true, false]
    ],
    width: 4,
    height: 3
  },
  {
    name: "Loaf",
    description: "A still life pattern",
    grid: [
      [false, true, true, false],
      [true, false, false, true],
      [false, true, false, true],
      [false, false, true, false]
    ],
    width: 4,
    height: 4
  },
  {
    name: "Boat",
    description: "A small still life",
    grid: [
      [true, true, false],
      [true, false, true],
      [false, true, false]
    ],
    width: 3,
    height: 3
  },
  {
    name: "Lightweight Spaceship",
    description: "A small spaceship that moves horizontally",
    grid: [
      [true, false, false, true, false],
      [false, false, false, false, true],
      [true, false, false, false, true],
      [false, true, true, true, true]
    ],
    width: 5,
    height: 4
  },
  {
    name: "Middleweight Spaceship",
    description: "A medium-sized spaceship",
    grid: [
      [false, true, false, false, false, true],
      [true, false, false, false, false, false],
      [true, false, false, false, false, true],
      [true, true, true, true, true, false]
    ],
    width: 6,
    height: 4
  },
  {
    name: "Heavyweight Spaceship",
    description: "A large spaceship",
    grid: [
      [false, true, true, false, false, false, true],
      [true, false, false, false, false, false, false],
      [true, false, false, false, false, false, true],
      [true, true, true, true, true, true, false]
    ],
    width: 7,
    height: 4
  },
  {
    name: "R-pentomino",
    description: "A methuselah that lasts 1103 generations",
    grid: [
      [false, true, true],
      [true, true, false],
      [false, true, false]
    ],
    width: 3,
    height: 3
  },
  {
    name: "Diehard",
    description: "A methuselah that lasts 130 generations",
    grid: [
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, true, true, false, false, false, false, false],
      [true, false, false, true, false, false, false, false],
      [false, false, false, false, true, true, true, false]
    ],
    width: 8,
    height: 5
  },
  {
    name: "Acorn",
    description: "A methuselah that lasts 5206 generations",
    grid: [
      [false, true, false, false, false, false, false],
      [false, false, false, true, false, false, false],
      [true, true, false, false, true, true, true]
    ],
    width: 7,
    height: 3
  },
  {
    name: "Gosper Glider Gun",
    description: "A pattern that generates gliders indefinitely",
    grid: [
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, true, true],
      [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, true, true],
      [true, true, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false],
      [true, true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
    ],
    width: 36,
    height: 9
  }
]

const COLOR_SCHEMES = {
  classic: {
    alive: '#00ff00',
    dead: '#000000',
    bg: '#000000',
    cardBg: '#000000',
    text: '#00ff00',
    border: '#00ff00',
    buttonBg: '#000000',
    buttonText: '#00ff00',
    buttonHover: '#003300'
  },
  amber: {
    alive: '#ffb000',
    dead: '#2b1b0c',
    bg: '#2b1b0c',
    cardBg: '#2b1b0c',
    text: '#ffb000',
    border: '#ffb000',
    buttonBg: '#2b1b0c',
    buttonText: '#ffb000',
    buttonHover: '#4d300d'
  },
  blue: {
    alive: '#00ffff',
    dead: '#001a33',
    bg: '#001a33',
    cardBg: '#001a33',
    text: '#00ffff',
    border: '#00ffff',
    buttonBg: '#001a33',
    buttonText: '#00ffff',
    buttonHover: '#003366'
  },
  matrix: {
    alive: '#00ff41',
    dead: '#0d1f0d',
    bg: '#0d1f0d',
    cardBg: '#0d1f0d',
    text: '#00ff41',
    border: '#00ff41',
    buttonBg: '#0d1f0d',
    buttonText: '#00ff41',
    buttonHover: '#1a3d1a'
  },
  monochrome: {
    alive: '#ffffff',
    dead: '#000000',
    bg: '#000000',
    cardBg: '#000000',
    text: '#ffffff',
    border: '#ffffff',
    buttonBg: '#000000',
    buttonText: '#ffffff',
    buttonHover: '#333333'
  }
}

const CHARACTER_SETS = {
  blocks: { alive: '█', dead: '░' },
  circles: { alive: '●', dead: '○' },
  squares: { alive: '■', dead: '□' }
}

export default function TerminalLife() {
  // Use the optimized game logic hook
  const {
    gameState,
    loadPattern,
    toggleCell,
    handlePlayPause,
    handleStep,
    handleReset,
    handleClear,
    setSpeed,
    setPatternName,
    nextGeneration
  } = useGameOfLife()

  const [colorScheme, setColorScheme] = useState<keyof typeof COLOR_SCHEMES>('classic')
  const [characterSet, setCharacterSet] = useState<keyof typeof CHARACTER_SETS>('blocks')
  const [savedPatterns, setSavedPatterns] = useState<Pattern[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [savePatternName, setSavePatternName] = useState('')
  const [importExportText, setImportExportText] = useState('')

  // Memoized color schemes for performance
  const gridColors = useMemo(() => ({
    alive: COLOR_SCHEMES[colorScheme].alive,
    dead: COLOR_SCHEMES[colorScheme].dead,
    bg: COLOR_SCHEMES[colorScheme].bg
  }), [colorScheme])

  const gridCharacters = useMemo(() => CHARACTER_SETS[characterSet], [characterSet])

  // Game loop using the optimized hook
  useEffect(() => {
    if (!gameState.isPlaying) return

    const interval = setInterval(() => {
      nextGeneration()
    }, 1000 / gameState.speed)

    return () => clearInterval(interval)
  }, [gameState.isPlaying, gameState.speed, nextGeneration])



  // Load saved patterns from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('terminalLifePatterns')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSavedPatterns(parsed)
      } catch (error) {
        console.error('Failed to load saved patterns:', error)
      }
    }
  }, [])

  // Save patterns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('terminalLifePatterns', JSON.stringify(savedPatterns))
  }, [savedPatterns])

  // Save current pattern
  const handleSavePattern = () => {
    if (!savePatternName.trim()) return

    const newPattern: Pattern = {
      name: savePatternName.trim(),
      description: `Custom pattern saved at generation ${gameState.generation}`,
      grid: gameState.grid,
      width: GRID_WIDTH,
      height: GRID_HEIGHT
    }

    setSavedPatterns((prev: Pattern[]) => [...prev, newPattern])
    setSavePatternName('')
    setShowSaveDialog(false)
    setPatternName(savePatternName.trim())
  }

  // Load saved pattern
  const handleLoadSavedPattern = (pattern: Pattern) => {
    loadPattern(pattern)
  }

  // Delete saved pattern
  const handleDeleteSavedPattern = (patternName: string) => {
    setSavedPatterns((prev: Pattern[]) => prev.filter((p: Pattern) => p.name !== patternName))
  }

  // Export pattern as text
  const handleExportPattern = () => {
    const patternData = {
      name: gameState.patternName,
      grid: gameState.grid,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      generation: gameState.generation
    }
    const text = btoa(JSON.stringify(patternData))
    setImportExportText(text)
    navigator.clipboard?.writeText(text).then(() => {
      alert('Pattern copied to clipboard!')
    })
  }

  // Import pattern from text
  const handleImportPattern = () => {
    try {
      const patternData = JSON.parse(atob(importExportText))
      if (patternData.grid && Array.isArray(patternData.grid)) {
        const pattern: Pattern = {
          name: patternData.name || 'Imported Pattern',
          description: `Imported pattern`,
          grid: patternData.grid,
          width: patternData.width || GRID_WIDTH,
          height: patternData.height || GRID_HEIGHT
        }
        loadPattern(pattern)
        setImportExportText('')
        alert('Pattern imported successfully!')
      }
    } catch (error) {
      alert('Invalid pattern data. Please check the format.')
    }
  }

  // Share pattern via URL
  const handleSharePattern = () => {
    const patternData = {
      name: gameState.patternName,
      grid: gameState.grid,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      generation: gameState.generation
    }
    const encoded = btoa(JSON.stringify(patternData))
    const url = `${window.location.origin}${window.location.pathname}?pattern=${encodeURIComponent(encoded)}`

    navigator.clipboard?.writeText(url).then(() => {
      alert('Pattern URL copied to clipboard!')
    }).catch(() => {
      // Fallback: show URL in prompt
      prompt('Copy this URL to share your pattern:', url)
    })
  }

  // Load pattern from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const patternParam = urlParams.get('pattern')

    if (patternParam) {
      try {
        const patternData = JSON.parse(atob(decodeURIComponent(patternParam)))
        if (patternData.grid && Array.isArray(patternData.grid)) {
          const pattern: Pattern = {
            name: patternData.name || 'Shared Pattern',
            description: `Shared pattern`,
            grid: patternData.grid,
            width: patternData.width || GRID_WIDTH,
            height: patternData.height || GRID_HEIGHT
          }
          loadPattern(pattern)
        }
      } catch (error) {
        console.error('Failed to load pattern from URL:', error)
      }
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          handlePlayPause()
          break
        case 's':
          e.preventDefault()
          handleStep()
          break
        case 'r':
          e.preventDefault()
          handleReset()
          break
        case 'c':
          e.preventDefault()
          handleClear()
          break
        case '+':
        case '=':
          e.preventDefault()
          setSpeed(Math.min(10, gameState.speed + 1))
          break
        case '-':
        case '_':
          e.preventDefault()
          setSpeed(Math.max(1, gameState.speed - 1))
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handlePlayPause, handleStep, handleReset, handleClear])

  return (
    <div
      className="min-h-screen font-mono p-4 transition-colors duration-300"
      style={{
        backgroundColor: COLOR_SCHEMES[colorScheme].bg,
        color: COLOR_SCHEMES[colorScheme].text
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-4xl md:text-5xl font-bold mb-2 tracking-wider transition-colors duration-300"
          style={{ color: COLOR_SCHEMES[colorScheme].text }}
        >
          TERMINAL LIFE
        </h1>
        <p className="text-sm md:text-base opacity-75 mb-2 transition-colors duration-300" style={{ color: COLOR_SCHEMES[colorScheme].text }}>Conway's Game of Life Simulator</p>
        <div className="text-xs opacity-50 hidden sm:block transition-colors duration-300" style={{ color: COLOR_SCHEMES[colorScheme].text }}>
          Shortcuts: [Space] Play/Pause • [S] Step • [R] Reset • [C] Clear • [+/-] Speed
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Game Area */}
        <div className="xl:col-span-3">
          <Card
            className="border-2 transition-colors duration-300"
            style={{
              backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
              borderColor: COLOR_SCHEMES[colorScheme].border
            }}
          >
            <CardHeader
              className="border-b transition-colors duration-300"
              style={{ borderColor: COLOR_SCHEMES[colorScheme].border }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle
                  className="text-lg transition-colors duration-300"
                  style={{ color: COLOR_SCHEMES[colorScheme].text }}
                >
                  Pattern: {gameState.patternName}
                </CardTitle>
                <div className="flex flex-wrap gap-2 text-sm" style={{ color: COLOR_SCHEMES[colorScheme].text }}>
                  <Badge
                    variant="outline"
                    className="transition-colors duration-300"
                    style={{
                      borderColor: COLOR_SCHEMES[colorScheme].border,
                      color: COLOR_SCHEMES[colorScheme].text
                    }}
                  >
                    Gen: {gameState.generation}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="transition-colors duration-300"
                    style={{
                      borderColor: COLOR_SCHEMES[colorScheme].border,
                      color: COLOR_SCHEMES[colorScheme].text
                    }}
                  >
                    {gameState.speed}x
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Controls */}
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handlePlayPause}
                    variant="outline"
                    size="sm"
                    className="border-2 transition-colors duration-300 hover:opacity-80"
                    style={{
                      backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                      borderColor: COLOR_SCHEMES[colorScheme].border,
                      color: COLOR_SCHEMES[colorScheme].buttonText
                    }}
                  >
                    {gameState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span className="hidden sm:inline ml-1">
                      {gameState.isPlaying ? 'Pause' : 'Play'}
                    </span>
                  </Button>
                  <Button
                    onClick={handleStep}
                    variant="outline"
                    size="sm"
                    className="border-2 transition-colors duration-300 hover:opacity-80 disabled:opacity-50"
                    disabled={gameState.isPlaying}
                    style={{
                      backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                      borderColor: COLOR_SCHEMES[colorScheme].border,
                      color: COLOR_SCHEMES[colorScheme].buttonText
                    }}
                  >
                    <SkipForward className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Step</span>
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="border-2 transition-colors duration-300 hover:opacity-80"
                    style={{
                      backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                      borderColor: COLOR_SCHEMES[colorScheme].border,
                      color: COLOR_SCHEMES[colorScheme].buttonText
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Reset</span>
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    size="sm"
                    className="border-2 transition-colors duration-300 hover:opacity-80"
                    style={{
                      backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                      borderColor: COLOR_SCHEMES[colorScheme].border,
                      color: COLOR_SCHEMES[colorScheme].buttonText
                    }}
                  >
                    <Square className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Clear</span>
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm whitespace-nowrap transition-colors duration-300" style={{ color: COLOR_SCHEMES[colorScheme].text }}>Speed:</label>
                    <CustomSlider
                      value={[gameState.speed]}
                      onValueChange={(value) => setSpeed(value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-24 sm:w-32"
                      trackBg={COLOR_SCHEMES[colorScheme].border}
                      rangeBg={COLOR_SCHEMES[colorScheme].text}
                      thumbBg={COLOR_SCHEMES[colorScheme].buttonBg}
                      thumbBorder={COLOR_SCHEMES[colorScheme].text}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setShowSaveDialog(true)}
                      variant="outline"
                      size="sm"
                      className="border-2 transition-colors duration-300 hover:opacity-80"
                      style={{
                        backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                        borderColor: COLOR_SCHEMES[colorScheme].border,
                        color: COLOR_SCHEMES[colorScheme].buttonText
                      }}
                    >
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Save</span>
                    </Button>
                    <Button
                      onClick={handleExportPattern}
                      variant="outline"
                      size="sm"
                      className="border-2 transition-colors duration-300 hover:opacity-80"
                      style={{
                        backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                        borderColor: COLOR_SCHEMES[colorScheme].border,
                        color: COLOR_SCHEMES[colorScheme].buttonText
                      }}
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Export</span>
                    </Button>
                    <Button
                      onClick={handleSharePattern}
                      variant="outline"
                      size="sm"
                      className="border-2 transition-colors duration-300 hover:opacity-80"
                      style={{
                        backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                        borderColor: COLOR_SCHEMES[colorScheme].border,
                        color: COLOR_SCHEMES[colorScheme].buttonText
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Share</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Optimized Game Grid */}
              <div
                className="border rounded p-2 overflow-auto transition-colors duration-300"
                style={{
                  backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
                  borderColor: COLOR_SCHEMES[colorScheme].border
                }}
              >
                <OptimizedGameGrid
                  grid={gameState.grid}
                  colorScheme={gridColors}
                  characterSet={gridCharacters}
                  onCellClick={toggleCell}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="xl:col-span-1">
          <Tabs defaultValue="patterns" className="w-full">
            <TabsList
              className="grid w-full grid-cols-3 border-2 transition-colors duration-300"
              style={{
                backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
                borderColor: COLOR_SCHEMES[colorScheme].border
              }}
            >
              <TabsTrigger
                value="patterns"
                className="data-[state=active]:opacity-80 text-xs transition-colors duration-300"
                style={{
                  color: COLOR_SCHEMES[colorScheme].text,
                  backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg
                }}
              >
                Famous
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:opacity-80 text-xs transition-colors duration-300"
                style={{
                  color: COLOR_SCHEMES[colorScheme].text,
                  backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg
                }}
              >
                Saved
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:opacity-80 text-xs transition-colors duration-300"
                style={{
                  color: COLOR_SCHEMES[colorScheme].text,
                  backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg
                }}
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patterns">
              <Card
                className="border-2 transition-colors duration-300"
                style={{
                  backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
                  borderColor: COLOR_SCHEMES[colorScheme].border
                }}
              >
                <CardHeader>
                  <CardTitle
                    className="transition-colors duration-300"
                    style={{ color: COLOR_SCHEMES[colorScheme].text }}
                  >
                    Famous Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto" style={{
                  // Custom scrollbar styling with theme colors
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${COLOR_SCHEMES[colorScheme].border} transparent`
                }}>
                  {FAMOUS_PATTERNS.map((pattern) => (
                    <Button
                      onClick={() => handleLoadSavedPattern(pattern)}
                      variant="outline"
                      className="flex-1 justify-start border-2 transition-colors duration-300 hover:opacity-80 text-left min-h-fit w-full"
                      style={{
                        backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                        borderColor: COLOR_SCHEMES[colorScheme].border,
                        color: COLOR_SCHEMES[colorScheme].buttonText
                      }}
                    >
                      <div className="w-full">
                        <div className="font-semibold break-words whitespace-normal leading-tight">{pattern.name}</div>
                        <div className="text-xs opacity-75 break-words whitespace-normal leading-tight mt-1" style={{ color: COLOR_SCHEMES[colorScheme].text }}>{pattern.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card
                className="border-2 transition-colors duration-300"
                style={{
                  backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
                  borderColor: COLOR_SCHEMES[colorScheme].border
                }}
              >
                <CardHeader>
                  <CardTitle
                    className="transition-colors duration-300"
                    style={{ color: COLOR_SCHEMES[colorScheme].text }}
                  >
                    Saved Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="space-y-2 max-h-96 overflow-y-auto saved-patterns-scrollbar"
                  style={{
                    // Custom scrollbar styling with theme colors
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${COLOR_SCHEMES[colorScheme].border} transparent`
                  }}
                >
                  {savedPatterns.length === 0 ? (
                    <p className="text-sm opacity-75 text-center py-4 transition-colors duration-300" style={{ color: COLOR_SCHEMES[colorScheme].text }}>No saved patterns yet</p>
                  ) : (
                    savedPatterns.map((pattern) => (
                      <div key={pattern.name} className="flex gap-2 pt-2 first:pt-0">
                        <Button
                          onClick={() => handleLoadSavedPattern(pattern)}
                          variant="outline"
                          className="flex-1 w-full justify-start border-2 transition-colors duration-300 hover:opacity-80 text-left min-h-fit"
                          style={{
                            backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                            borderColor: COLOR_SCHEMES[colorScheme].border,
                            color: COLOR_SCHEMES[colorScheme].buttonText
                          }}
                        >
                          <div className="w-full">
                            <div className="font-semibold break-words whitespace-normal leading-tight">{pattern.name}</div>
                            <div className="text-xs opacity-75 break-words whitespace-normal leading-tight mt-1" style={{ color: COLOR_SCHEMES[colorScheme].text }}>{pattern.description}</div>
                          </div>
                        </Button>
                        <Button
                          onClick={() => handleDeleteSavedPattern(pattern.name)}
                          variant="outline"
                          size="sm"
                          className="border-2 transition-colors duration-300 hover:opacity-80 flex-shrink-0"
                          style={{
                            backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                            borderColor: '#ff4444',
                            color: '#ff4444'
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card
                className="border-2 transition-colors duration-300"
                style={{
                  backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
                  borderColor: COLOR_SCHEMES[colorScheme].border
                }}
              >
                <CardHeader>
                  <CardTitle
                    className="transition-colors duration-300"
                    style={{ color: COLOR_SCHEMES[colorScheme].text }}
                  >
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm block mb-2 transition-colors duration-300" style={{ color: COLOR_SCHEMES[colorScheme].text }}>Color Scheme</label>
                    <Select value={colorScheme} onValueChange={(value: keyof typeof COLOR_SCHEMES) => setColorScheme(value)}>
                      <SelectTrigger
                        className="border-2 transition-colors duration-300"
                        style={{
                          backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                          borderColor: COLOR_SCHEMES[colorScheme].border,
                          color: COLOR_SCHEMES[colorScheme].buttonText
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className="transition-colors duration-300"
                        style={{
                          backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
                          borderColor: COLOR_SCHEMES[colorScheme].border
                        }}
                      >
                        <SelectItem
                          value="classic"
                          className="transition-colors duration-300"
                          style={{ color: COLOR_SCHEMES[colorScheme].text }}
                        >
                          Classic Green
                        </SelectItem>
                        <SelectItem
                          value="amber"
                          className="transition-colors duration-300"
                          style={{ color: COLOR_SCHEMES[colorScheme].text }}
                        >
                          Amber
                        </SelectItem>
                        <SelectItem
                          value="blue"
                          className="transition-colors duration-300"
                          style={{ color: COLOR_SCHEMES[colorScheme].text }}
                        >
                          Blue
                        </SelectItem>
                        <SelectItem
                          value="matrix"
                          className="transition-colors duration-300"
                          style={{ color: COLOR_SCHEMES[colorScheme].text }}
                        >
                          Matrix
                        </SelectItem>
                        <SelectItem
                          value="monochrome"
                          className="transition-colors duration-300"
                          style={{ color: COLOR_SCHEMES[colorScheme].text }}
                        >
                          Monochrome
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm block mb-2 transition-colors duration-300" style={{ color: COLOR_SCHEMES[colorScheme].text }}>Character Set</label>
                    <Select value={characterSet} onValueChange={(value: keyof typeof CHARACTER_SETS) => setCharacterSet(value)}>
                      <SelectTrigger
                        className="border-2 transition-colors duration-300"
                        style={{
                          backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                          borderColor: COLOR_SCHEMES[colorScheme].border,
                          color: COLOR_SCHEMES[colorScheme].buttonText
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className="transition-colors duration-300"
                        style={{
                          backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
                          borderColor: COLOR_SCHEMES[colorScheme].border
                        }}
                      >
                        <SelectItem
                          value="blocks"
                          className="transition-colors duration-300"
                          style={{ color: COLOR_SCHEMES[colorScheme].text }}
                        >
                          Blocks (█ ░)
                        </SelectItem>
                        <SelectItem
                          value="circles"
                          className="transition-colors duration-300"
                          style={{ color: COLOR_SCHEMES[colorScheme].text }}
                        >
                          Circles (● ○)
                        </SelectItem>
                        <SelectItem
                          value="squares"
                          className="transition-colors duration-300"
                          style={{ color: COLOR_SCHEMES[colorScheme].text }}
                        >
                          Squares (■ □)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4 transition-colors duration-300" style={{ borderColor: COLOR_SCHEMES[colorScheme].border }}>
                    <h4
                      className="mb-3 transition-colors duration-300"
                      style={{ color: COLOR_SCHEMES[colorScheme].text }}
                    >
                      Import/Export Pattern
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm block mb-2 transition-colors duration-300" style={{ color: COLOR_SCHEMES[colorScheme].text }}>Pattern Data</label>
                        <textarea
                          value={importExportText}
                          onChange={(e) => setImportExportText(e.target.value)}
                          placeholder="Paste pattern data here..."
                          className="w-full h-20 p-2 border-2 rounded text-xs font-mono resize-none transition-colors duration-300"
                          style={{
                            backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                            borderColor: COLOR_SCHEMES[colorScheme].border,
                            color: COLOR_SCHEMES[colorScheme].buttonText
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleImportPattern}
                          variant="outline"
                          size="sm"
                          className="border-2 transition-colors duration-300 hover:opacity-80 disabled:opacity-50"
                          disabled={!importExportText.trim()}
                          style={{
                            backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                            borderColor: COLOR_SCHEMES[colorScheme].border,
                            color: COLOR_SCHEMES[colorScheme].buttonText
                          }}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Import
                        </Button>
                        <Button
                          onClick={handleExportPattern}
                          variant="outline"
                          size="sm"
                          className="border-2 transition-colors duration-300 hover:opacity-80"
                          style={{
                            backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                            borderColor: COLOR_SCHEMES[colorScheme].border,
                            color: COLOR_SCHEMES[colorScheme].buttonText
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm opacity-75 pt-4 transition-colors duration-300" style={{ borderColor: COLOR_SCHEMES[colorScheme].border, color: COLOR_SCHEMES[colorScheme].text }}>
        <p className="mb-1" style={{ color: COLOR_SCHEMES[colorScheme].text }}>Conway's Game of Life • Birth: 3 neighbors • Survival: 2-3 neighbors</p>
        <p className="mb-1" style={{ color: COLOR_SCHEMES[colorScheme].text }}>Click cells to toggle • Patterns evolve automatically</p>
        <div className="text-xs opacity-50 mt-2">
          <p className="hidden sm:block" style={{ color: COLOR_SCHEMES[colorScheme].text }}>TerminalLife v1.0 • A retro-styled cellular automata simulator</p>
          <p className="sm:hidden" style={{ color: COLOR_SCHEMES[colorScheme].text }}>v1.0 • Retro cellular automata</p>
        </div>
      </div>

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <Card
            className="w-96 border-2 transition-colors duration-300"
            style={{
              backgroundColor: COLOR_SCHEMES[colorScheme].cardBg,
              borderColor: COLOR_SCHEMES[colorScheme].border
            }}
          >
            <CardHeader>
              <CardTitle
                className="transition-colors duration-300"
                style={{ color: COLOR_SCHEMES[colorScheme].text }}
              >
                Save Pattern
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm block mb-2 transition-colors duration-300" style={{ color: COLOR_SCHEMES[colorScheme].text }}>Pattern Name</label>
                <input
                  type="text"
                  value={savePatternName}
                  onChange={(e) => setSavePatternName(e.target.value)}
                  placeholder="Enter pattern name..."
                  className="w-full p-2 border-2 rounded text-sm transition-colors duration-300"
                  style={{
                    backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                    borderColor: COLOR_SCHEMES[colorScheme].border,
                    color: COLOR_SCHEMES[colorScheme].buttonText
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSavePattern()
                    if (e.key === 'Escape') setShowSaveDialog(false)
                  }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowSaveDialog(false)}
                  variant="outline"
                  className="border-2 transition-colors duration-300 hover:opacity-80"
                  style={{
                    backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                    borderColor: COLOR_SCHEMES[colorScheme].border,
                    color: COLOR_SCHEMES[colorScheme].buttonText
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePattern}
                  variant="outline"
                  className="border-2 transition-colors duration-300 hover:opacity-80 disabled:opacity-50"
                  disabled={!savePatternName.trim()}
                  style={{
                    backgroundColor: COLOR_SCHEMES[colorScheme].buttonBg,
                    borderColor: COLOR_SCHEMES[colorScheme].border,
                    color: COLOR_SCHEMES[colorScheme].buttonText
                  }}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}