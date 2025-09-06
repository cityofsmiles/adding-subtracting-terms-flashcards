import React, { useState } from "react";
import { motion } from "framer-motion";
import flashcards from "../public/flashcards.json";

export default function App() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const card = flashcards[index];

  const checkAnswer = () => {
    if (input.replace(/\s+/g, "") === card.answer.replace(/\s+/g, "")) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const nextCard = () => {
    setInput("");
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Algebra Flashcards</h1>

      <motion.div
        key={index}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-lg mb-4">
          Simplify: <strong>{card.question}</strong>
        </p>

        {!showAnswer ? (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 w-full rounded mb-3"
              placeholder="Enter answer..."
            />
            <button
              onClick={checkAnswer}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <p>
              Correct Answer:{" "}
              <span className="font-bold">{card.answer}</span>
            </p>
            <button
              onClick={nextCard}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Next Card
            </button>
          </div>
        )}
      </motion.div>

      <p className="mt-4">
        Score: {score} / {flashcards.length}
      </p>
    </div>
  );
}