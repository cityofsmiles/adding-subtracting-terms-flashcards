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
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const current = flashcards[index]

  const handleNext = (correct) => {
    if (correct) setScore(score + 1)
    setShowAnswer(false)
    setIndex((prev) => (prev + 1) % flashcards.length)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Score bar */}
      <div className="flex justify-between items-center p-4 bg-indigo-600 text-white text-lg font-semibold">
        <span>Score: {score}</span>
        <span>{index + 1}/{flashcards.length}</span>
      </div>

      {/* Flashcard */}
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          className="w-[90%] max-w-sm h-64 bg-white rounded-2xl shadow-xl flex items-center justify-center text-center p-6 cursor-pointer"
          onClick={() => setShowAnswer(!showAnswer)}
          initial={false}
          animate={{ rotateY: showAnswer ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute w-full h-full flex items-center justify-center text-2xl font-bold"
            style={{ backfaceVisibility: "hidden" }}
          >
            {current.question}
          </div>
          <div
            className="absolute w-full h-full flex items-center justify-center text-2xl font-bold text-indigo-600"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {current.answer}
          </div>
        </motion.div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center p-4">
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
  )
}