"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Player, QuizQuestion } from "../types"

interface QuizInterfaceProps {
  players: Player[]
  currentQuestion: QuizQuestion
  questionIndex: number
  totalQuestions: number
  onAnswerSubmitted: (playerId: number, isCorrect: boolean) => void
  currentPlayerId: number | null
  setCurrentPlayerId: React.Dispatch<React.SetStateAction<number | null>>
}

/**
 * Component for displaying quiz questions and handling answers
 */
const QuizInterface: React.FC<QuizInterfaceProps> = ({
  players,
  currentQuestion,
  questionIndex,
  totalQuestions,
  onAnswerSubmitted,
  currentPlayerId,
  setCurrentPlayerId,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answered, setAnswered] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(15) // 15 seconds to answer

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null)
    setAnswered(false)
    setShowResult(false)
    setTimeLeft(15)
  }, [currentQuestion])

  // Timer countdown
  useEffect(() => {
    if (!answered && timeLeft > 0 && currentPlayerId !== null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !answered && currentPlayerId !== null) {
      handleTimeUp()
    }
  }, [timeLeft, answered, currentPlayerId])

  const handleTimeUp = () => {
    setAnswered(true)
    setShowResult(true)
    if (currentPlayerId !== null) {
      onAnswerSubmitted(currentPlayerId, false)
    }
  }

  const handleOptionSelect = (option: string) => {
    if (!answered) {
      setSelectedOption(option)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedOption && currentPlayerId !== null) {
      setAnswered(true)
      setShowResult(true)
      const isCorrect = selectedOption === currentQuestion.correctDefinition
      onAnswerSubmitted(currentPlayerId, isCorrect)
    }
  }

  const handlePlayerSelect = (playerId: number) => {
    if (!answered) {
      setCurrentPlayerId(playerId)
    }
  }

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return selectedOption === option ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-300"
    }

    if (option === currentQuestion.correctDefinition) {
      return "border-green-500 bg-green-50"
    }

    if (selectedOption === option && option !== currentQuestion.correctDefinition) {
      return "border-red-500 bg-red-50"
    }

    return "border-gray-300 opacity-60"
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Progress indicator */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-500">
          Question {questionIndex + 1} of {totalQuestions}
        </div>

        {currentPlayerId !== null && (
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-500">Time left:</div>
            <div className={`font-bold ${timeLeft < 5 ? "text-red-500" : "text-gray-700"}`}>{timeLeft}s</div>
          </div>
        )}
      </div>

      {/* Player selection */}
      {currentPlayerId === null ? (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Who wants to answer?</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => handlePlayerSelect(player.id)}
                className={`
                  px-4 py-2 rounded-md font-medium transition-colors
                  ${player.color} text-white
                `}
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Current player indicator */}
          <div className="mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Current player</div>
              <div
                className={`
                  px-4 py-1 rounded-full font-medium inline-block
                  ${players.find((p) => p.id === currentPlayerId)?.color} text-white
                `}
              >
                {players.find((p) => p.id === currentPlayerId)?.name}
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center mb-2">{currentQuestion.word}</h2>
            <p className="text-gray-600 text-center">Select the correct definition</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${getOptionClass(option)}
                `}
              >
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}</span>
                  </div>
                  <p>{option}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Submit button */}
          {!showResult && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className={`
                  px-6 py-2 rounded-md font-medium transition-colors
                  ${
                    selectedOption
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Submit Answer
              </button>
            </div>
          )}

          {/* Result message */}
          {showResult && (
            <div
              className={`
              p-4 rounded-lg text-center font-medium
              ${
                selectedOption === currentQuestion.correctDefinition
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            `}
            >
              {selectedOption === currentQuestion.correctDefinition
                ? "✓ Correct! You earned a point."
                : `✗ Incorrect. The correct definition was: "${currentQuestion.correctDefinition}"`}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default QuizInterface
