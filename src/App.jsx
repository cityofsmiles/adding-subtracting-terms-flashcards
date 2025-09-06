import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./flashcards.css";

export default function App() {
  const [allFlashcards, setAllFlashcards] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  // ✅ Load JSON from public/ using base URL
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}flashcards.json`)
      .then((res) => res.json())
      .then((data) => setAllFlashcards(data))
      .catch((err) => console.error("Failed to load flashcards.json", err));
  }, []);

  // Pick 10 random flashcards
  const startPractice = () => {
    if (allFlashcards.length > 0) {
      const shuffled = [...allFlashcards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled.slice(0, 10));
      setCurrentIndex(0);
      setAnswers({});
      setShowResults(false);
      setStarted(true);
    }
  };

  const handleAnswer = (value) =>
    setAnswers({ ...answers, [currentIndex]: value });

  const checkAnswer = (userInput, correct) =>
    userInput.replace(/\s+/g, "") === correct.replace(/\s+/g, "");

  const nextCard = () =>
    setCurrentIndex((prev) => (prev === flashcards.length - 1 ? prev : prev + 1));

  const prevCard = () =>
    setCurrentIndex((prev) => (prev === 0 ? 0 : prev - 1));

  // --- Loading state ---
  if (allFlashcards.length === 0) {
    return (
      <div className="flashcards-container">
        <h1>Adding and Subtracting Terms Flashcards</h1>
        <h3 style={{ fontWeight: "normal", marginBottom: "1rem" }}>
          by Jonathan R. Bacolod, LPT
        </h3>
        <p>Loading flashcards...</p>
      </div>
    );
  }

  // --- Start Screen ---
  if (!started) {
    return (
      <div className="flashcards-container">
        <h1>Adding and Subtracting Terms Flashcards</h1>
        <h3 style={{ fontWeight: "normal", marginBottom: "1rem" }}>
          by Jonathan R. Bacolod, LPT
        </h3>
        <button className="btn-primary" onClick={startPractice}>
          Start Practice
        </button>
      </div>
    );
  }

  // --- Results Screen ---
  if (showResults) {
    const score = flashcards.filter((card, i) =>
      checkAnswer(answers[i] || "", card.answer)
    ).length;

    return (
      <div className="answer-key-screen">
        <p className="score">
          Score: {score}/{flashcards.length}
        </p>
        <h2>Answer Key</h2>
        <div className="answer-key">
          {flashcards.map((card, i) => {
            const correct = checkAnswer(answers[i] || "", card.answer);
            return (
              <div key={i}>
                <p>
                  <strong>Q{i + 1}:</strong> {card.question}
                  <br />
                  Your Answer: {answers[i] || "(none)"}{" "}
                  {correct ? (
                    <span className="correct">✅</span>
                  ) : (
                    <span className="wrong">❌</span>
                  )}
                  <br />
                  Correct Answer: {card.answer}
                </p>
              </div>
            );
          })}
        </div>
        <div className="button-group">
          <button className="btn-primary" onClick={startPractice}>
            Try Another Set
          </button>
          <button className="btn-submit" onClick={() => setShowResults(false)}>
            Back to Cards
          </button>
        </div>
      </div>
    );
  }

  // --- Flashcard Screen ---
  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcards-container">
      <h1>Adding and Subtracting Terms Flashcards</h1>
      <h3 style={{ fontWeight: "normal", marginBottom: "1rem" }}>
        by Jonathan R. Bacolod, LPT
      </h3>
      <h2>Flashcard {currentIndex + 1} of {flashcards.length}</h2>
      <div className="flashcard-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="flashcard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentCard.question}
          </motion.div>
        </AnimatePresence>
      </div>
      <input
        type="text"
        className="input-answer"
        placeholder="Your answer"
        value={answers[currentIndex] || ""}
        onChange={(e) => handleAnswer(e.target.value)}
      />
      <div className="button-group">
        <button className="btn-primary" onClick={prevCard}>
          Previous
        </button>
        <button className="btn-primary" onClick={nextCard}>
          Next
        </button>
        <button className="btn-submit" onClick={() => setShowResults(true)}>
          Submit
        </button>
      </div>
    </div>
  );
}