"use client"

import type React from "react"
import { useState } from "react"

interface TextInputUploaderProps {
  onTextSubmit: (content: string) => void
  isLoading: boolean
}

/**
 * Component for typing or pasting questions as plain text input
 */
const TextInputUploader: React.FC<TextInputUploaderProps> = ({ onTextSubmit, isLoading }) => {
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit()
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter or paste your questions below:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={6}
          className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
          placeholder="Type or paste your questions here..."
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        disabled={!text.trim() || isLoading}
      >
        Submit Questions
      </button>

      {isLoading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      )}
    </div>
  )
}

export default TextInputUploader
