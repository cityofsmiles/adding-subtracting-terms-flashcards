import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function App() {
  const [flashcards, setFlashcards] = useState([])
  const [sessionCards, setSessionCards] = useState([])
  const [answers, setAnswers] = useState([])
  const [step, setStep] = useState("start") // "start" | "practice" | "results"
  const [index, setIndex] = useState(0)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}flashcards.json`)
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
      .catch((err) => console.error("Failed to load flashcards:", err))
  }, [])

  const startSession = () => {
    // pick 10 random flashcards
    const shuffled = [...flashcards].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 10)
    setSessionCards(selected)
    setAnswers(Array(10).fill(""))
    setIndex(0)
    setStep("practice")
  }

  const handleChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setStep("results")
  }

  const handleRetry = () => {
    startSession()
  }

  const backToCards = () => {
    setStep("start")
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading flashcards...
      </div>
    )
  }

  // Landing page
  if (step === "start") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-white text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700">
          Adding and Subtracting Terms Flashcards
        </h1>
        <p className="text-sm sm:text-base mt-2 text-gray-600">
          by Jonathan R. Bacolod, LPT
        </p>
        <button
          onClick={startSession}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white text-lg rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          Start Practice
        </button>
      </div>
    )
  }

  // Practice session
  if (step === "practice") {
    const current = sessionCards[index]

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800">
        <div className="text-center py-4 font-semibold text-indigo-700">
          Flashcard {index + 1} of {sessionCards.length}
        </div>

        {/* Flashcard box */}
        <div className="flex-grow flex items-center justify-center px-4">
          <motion.div
            className="w-full max-w-md h-48 bg-white border-2 border-gray-300 rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold px-6 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {current.question}
          </motion.div>
        </div>

        {/* Input + Controls */}
        <div className="flex flex-col items-center justify-center gap-4 pb-8 px-4">
          <input
            type="text"
            placeholder="Type your answer..."
            value={answers[index]}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full max-w-md px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
          />
          <div className="flex gap-2 w-full max-w-md justify-center">
            <button
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
              className="flex-1 bg-gray-400 text-white py-2 rounded-xl shadow-md disabled:opacity-50"
            >
              Previous
            </button>
            {index < sessionCards.length - 1 ? (
              <button
                onClick={() => setIndex((i) => i + 1)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl shadow-md hover:bg-indigo-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-2 rounded-xl shadow-md hover:bg-green-700 transition"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Results page
  if (step === "results") {
    const score = sessionCards.reduce((acc, card, i) => {
      return acc + (answers[i].replace(/\s+/g, "") === card.answer.replace(/\s+/g, "") ? 1 : 0)
    }, 0)

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 p-6">
        <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">
          Session Results
        </h2>
        <p className="text-center mb-6 text-lg">
          Score: {score} / {sessionCards.length}
        </p>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {sessionCards.map((card, i) => {
            const correct = answers[i].replace(/\s+/g, "") === card.answer.replace(/\s+/g, "")
            return (
              <div
                key={i}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
              >
                <p className="font-semibold mb-1">Item {i + 1}: {card.question}</p>
                <p>
                  Your answer:{" "}
                  <span className={correct ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {answers[i] || "(blank)"} {correct ? "✔️" : "❌"}
                  </span>
                </p>
                {!correct && (
                  <p>
                    Correct answer:{" "}
                    <span className="text-indigo-700 font-semibold">{card.answer}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-3 mt-6">
          <button
            onClick={handleRetry}
            className="w-full max-w-md bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 transition"
          >
            Try another set
          </button>
          <button
            onClick={backToCards}
            className="w-full max-w-md bg-indigo-600 text-white py-3 rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            Back to cards
          </button>
        </div>
      </div>
    )
  }
}