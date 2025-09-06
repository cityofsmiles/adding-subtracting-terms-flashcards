import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./flashcards.css";

export default function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load flashcards.json
  useEffect(() => {
    fetch("flashcards.json")
      .then((res) => res.json())
      .then((data) => {
        // Randomly select 10 flashcards from the 100
        const shuffled = data.sort(() => 0.5 - Math.random());
        setFlashcards(shuffled.slice(0, 10));
        setLoading(false);
      })
      .catch((err) => console.error("Error loading flashcards:", err));
  }, []);

  const handleAnswer = (value) =>
    setAnswers({ ...answers, [currentIndex]: value });

  const checkAnswer = (userInput, correct) =>
    userInput.replace(/\s+/g, "") === correct.replace(/\s+/g, "");

  const nextCard = () =>
    setCurrentIndex((prev) =>
      prev === flashcards.length - 1 ? prev : prev + 1
    );

  const prevCard = () =>
    setCurrentIndex((prev) => (prev === 0 ? 0 : prev - 1));

  const startPractice = () => {
    setLoading(true);
    fetch("flashcards.json")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setFlashcards(shuffled.slice(0, 10));
        setCurrentIndex(0);
        setAnswers({});
        setShowResults(false);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading flashcards:", err));
  };

  if (loading) {
    return <div className="flashcards-container">Loading flashcards...</div>;
  }

  if (!flashcards.length) {
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

  if (showResults) {
    const score = flashcards.filter((card, i) =>
      checkAnswer(answers[i] || "", card.answer)
    ).length;
    return (
      <div className="answer-key-screen">
        <h1 className="score">Score: {score}/{flashcards.length}</h1>
        <h2>Answer Key</h2>
        <div className="answer-key">
          {flashcards.map((card, i) => {
            const correct = checkAnswer(answers[i] || "", card.answer);
            return (
              <div key={i} className="answer-item">
                <p>
                  <strong>Q{i + 1}:</strong> {card.question} <br />
                  Your Answer: {answers[i] || "(none)"}{" "}
                  {correct ? "✓" : "✗"}
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

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcards-container">
      <h1>Adding and Subtracting Terms Flashcards</h1>
      <h3 style={{ fontWeight: "normal", marginBottom: "1rem" }}>
        by Jonathan R. Bacolod, LPT
      </h3>
      <h2>
        Flashcard {currentIndex + 1} of {flashcards.length}
      </h2>
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