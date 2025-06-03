// Types for our multiplayer quiz game

export interface Player {
  id: number
  name: string
  score: number
  color: string
}

export interface QuizWord {
  word: string
  definition: string
}

export interface QuizQuestion {
  word: string
  correctDefinition: string
  options: string[]
}

export interface GameState {
  players: Player[]
  currentQuestion: QuizQuestion | null
  questionIndex: number
  totalQuestions: number
  quizWords: QuizWord[]
  gamePhase: "setup" | "playing" | "results"
  currentPlayerId: number | null
  answerSubmitted: boolean
}

// Types for QuickSelect algorithm
export interface RankedPlayer extends Player {
  rank: number
}

// (your types file content here)
export interface ArrayElement {
  value: number
  status: "pivot" | "comparing" | "smaller" | "larger" | "target" | "default"
}

export interface AlgorithmStep {
  players: RankedPlayer[]
  pivotIndex: number
  left: number
  right: number
  description: string
  targetRank: number
}
