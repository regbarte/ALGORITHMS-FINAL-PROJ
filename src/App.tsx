"use client"

import type React from "react"
import { useState } from "react"
import TextInputUploader from "./components/TextInputUploader"
import PlayerSetup from "./components/PlayerSetup"
import QuizInterface from "./components/QuizInterface"
import Scoreboard from "./components/Scoreboard"
import { QuizGenerator } from "./utils/quiz-generator"
import type { Player, GameState } from "./types"

/**
 * Main App Component - Multiplayer Quiz Game with QuickSelect Ranking
 */
const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentQuestion: null,
    questionIndex: 0,
    totalQuestions: 0,
    quizWords: [],
    gamePhase: "setup",
    currentPlayerId: null,
    answerSubmitted: false,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Process manually inputted question text
  const handleTextSubmitted = (content: string) => {
    setIsLoading(true)

    try {
      const words = QuizGenerator.parseWordFile(content)

      if (words.length < 4) {
        alert("Please enter at least 4 valid 'word: definition' pairs.")
        setIsLoading(false)
        return
      }

      setGameState((prev) => ({
        ...prev,
        quizWords: words,
      }))
    } catch (error) {
      console.error("Error processing input:", error)
      alert("Error processing input. Please follow the correct format.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayersConfirmed = (players: Player[]) => {
    try {
      const questions = QuizGenerator.generateQuestions(gameState.quizWords)

      setGameState((prev) => ({
        ...prev,
        players,
        currentQuestion: questions[0],
        questionIndex: 0,
        totalQuestions: questions.length,
        gamePhase: "playing",
        currentPlayerId: null,
        answerSubmitted: false,
      }))
    } catch (error) {
      console.error("Error starting game:", error)
      alert("Error starting game. Please try again.")
    }
  }

  const handleAnswerSubmitted = (playerId: number, isCorrect: boolean) => {
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((player) =>
        player.id === playerId
          ? { ...player, score: isCorrect ? player.score + 1 : player.score }
          : player
      )

      return {
        ...prev,
        players: updatedPlayers,
        answerSubmitted: true,
      }
    })

    setTimeout(() => moveToNextQuestion(), 3000)
  }

  const moveToNextQuestion = () => {
    setGameState((prev) => {
      const nextIndex = prev.questionIndex + 1

      if (nextIndex >= prev.totalQuestions) {
        return {
          ...prev,
          gamePhase: "results",
          currentPlayerId: null,
        }
      }

      const questions = QuizGenerator.generateQuestions(prev.quizWords)

      return {
        ...prev,
        currentQuestion: questions[nextIndex % questions.length],
        questionIndex: nextIndex,
        currentPlayerId: null,
        answerSubmitted: false,
      }
    })
  }

  const setCurrentPlayerId = (id: number | null) => {
    setGameState((prev) => ({
      ...prev,
      currentPlayerId: id,
    }))
  }

  const startNewGame = () => {
    setGameState({
      players: [],
      currentQuestion: null,
      questionIndex: 0,
      totalQuestions: 0,
      quizWords: [],
      gamePhase: "setup",
      currentPlayerId: null,
      answerSubmitted: false,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Multiplayer Quiz Game</h1>
          <p className="text-lg text-gray-600">Test your knowledge and compete with friends!</p>
        </div>

        {/* Game Setup Phase */}
        {gameState.gamePhase === "setup" && (
          <div className="space-y-6">
            {gameState.quizWords.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Word List</h2>
                <p className="text-gray-600 mb-4">
                  Paste word and definition pairs in the format <code>word: definition</code>, one per line.
                </p>
                <TextInputUploader onTextSubmit={handleTextSubmitted} isLoading={isLoading} />
              </div>
            ) : (
              <PlayerSetup onPlayersConfirmed={handlePlayersConfirmed} />
            )}
          </div>
        )}

        {/* Playing Phase */}
        {gameState.gamePhase === "playing" && gameState.currentQuestion && (
          <div className="space-y-6">
            <QuizInterface
              players={gameState.players}
              currentQuestion={gameState.currentQuestion}
              questionIndex={gameState.questionIndex}
              totalQuestions={gameState.totalQuestions}
              onAnswerSubmitted={handleAnswerSubmitted}
              currentPlayerId={gameState.currentPlayerId}
              setCurrentPlayerId={setCurrentPlayerId}
            />

            <Scoreboard players={gameState.players} />
          </div>
        )}

        {/* Results Phase */}
        {gameState.gamePhase === "results" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
              <p className="text-xl text-gray-600 mb-6">Final Results</p>

              <button
                onClick={startNewGame}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
              >
                Start New Game
              </button>
            </div>

            <Scoreboard players={gameState.players} showRankingVisualization={true} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
