"use client"

import type React from "react"
import { useState } from "react"
import type { Player } from "../types"

interface PlayerSetupProps {
  onPlayersConfirmed: (players: Player[]) => void
}

/**
 * Component for setting up players before the quiz starts
 */
const PlayerSetup: React.FC<PlayerSetupProps> = ({ onPlayersConfirmed }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player 1", score: 0, color: "bg-red-500" },
    { id: 2, name: "Player 2", score: 0, color: "bg-blue-500" },
  ])

  const playerColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ]

  const handleAddPlayer = () => {
    if (players.length < 4) {
      const newId = Math.max(...players.map((p) => p.id), 0) + 1
      setPlayers([
        ...players,
        {
          id: newId,
          name: `Player ${newId}`,
          score: 0,
          color: playerColors[newId % playerColors.length],
        },
      ])
    }
  }

  const handleRemovePlayer = (id: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((player) => player.id !== id))
    }
  }

  const handleNameChange = (id: number, name: string) => {
    setPlayers(players.map((player) => (player.id === id ? { ...player, name } : player)))
  }

  const handleColorChange = (id: number) => {
    setPlayers(
      players.map((player) => {
        if (player.id === id) {
          const currentIndex = playerColors.indexOf(player.color)
          const nextIndex = (currentIndex + 1) % playerColors.length
          return { ...player, color: playerColors[nextIndex] }
        }
        return player
      }),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPlayersConfirmed(players)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Player Setup</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full cursor-pointer ${player.color}`}
                onClick={() => handleColorChange(player.id)}
              ></div>

              <input
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(player.id, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter player name"
                required
              />

              {players.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(player.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          {players.length < 4 && (
            <button
              type="button"
              onClick={handleAddPlayer}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Player
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlayerSetup
