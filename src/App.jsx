import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function App() {
  const [flashcards, setFlashcards] = useState([])
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetch("/flashcards.json")
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
  }, [])

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading flashcards...
      </div>
    )
  }

  const current = flashcards[index]

  const handleNext = (correct) => {
    if (correct) setScore(score + 1)
    setShowAnswer(false)
    setIndex((prev) => (prev + 1) % flashcards.length)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      {/* Header */}
      <header className="text-center py-6 px-4 bg-indigo-600 text-white shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Adding and Subtracting Terms Flashcards
        </h1>
        <p className="text-sm sm:text-base mt-1">
          by Jonathan R. Bacolod, LPT
        </p>
      </header>

      {/* Score bar */}
      <div className="flex justify-between items-center px-6 py-3 bg-indigo-100 text-indigo-800 font-medium">
        <span>Score: {score}</span>
        <span>
          {index + 1}/{flashcards.length}
        </span>
      </div>

      {/* Flashcard */}
      <div className="flex-grow flex items-center justify-center px-4">
        <motion.div
          className="relative w-full max-w-md h-64 bg-white border-2 border-gray-300 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer"
          onClick={() => setShowAnswer(!showAnswer)}
          initial={false}
          animate={{ rotateY: showAnswer ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Question side */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-2xl font-bold px-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            {current.question}
          </div>

          {/* Answer side */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-2xl font-bold text-indigo-600 px-6"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {current.answer}
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center gap-4 pb-8 px-4">
        <input
          type="text"
          placeholder="Type your answer..."
          className="w-full max-w-md px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
        />
        <div className="flex gap-4 w-full max-w-md">
          <button
            onClick={() => handleNext(false)}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl shadow-md active:scale-95 transition"
          >
            Wrong
          </button>
          <button
            onClick={() => handleNext(true)}
            className="flex-1 bg-green-500 text-white py-3 rounded-xl shadow-md active:scale-95 transition"
          >
            Correct
          </button>
        </div>
      </div>
    </div>
  )
}