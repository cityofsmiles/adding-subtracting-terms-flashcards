# Adding and Subtracting Terms Flashcards

An interactive flashcard app for practicing **simplifying algebraic expressions** by combining like terms.  
Built with **Python (Sympy)** for math generation and **React (Vite + Framer Motion)** for a smooth, mobile-friendly UI.  

🔗 **Live Demo**: [Adding and Subtracting Terms Flashcards](https://cityofsmiles.github.io/adding-subtracting-terms-flashcards/)

---

## ✨ Features
- 🔢 100 pre-generated flashcards (via Python) covering:
  - Case 1: Adding terms, positive only  
  - Case 2: Adding terms, with negatives  
  - Case 3: Subtracting terms, positive only  
  - Case 4: Subtracting terms, with negatives  
- 🎲 10 random flashcards per session  
- ✅ Instant feedback with score and detailed answer key (checkmarks and X marks)  
- 📱 Mobile-friendly design with realistic “flashcard” look  
- 🎞️ Smooth animations powered by [Framer Motion](https://www.framer.com/motion/)  

---

## 📖 How It Works
1. **Python Backend (Sympy)**  
   - A Python script generates `flashcards.json` containing 100 algebra flashcards.  
   - Each card has a **question** and its **simplified answer**.  
   - Example:
     ```json
     {
       "question": "2x^3 + 3x^3",
       "answer": "5x^3",
       "case": 1
     }
     ```

2. **React Frontend (Vite)**  
   - Loads `flashcards.json` from the `public/` folder.  
   - Displays flashcards one at a time with input box and navigation.  
   - At the end of 10 questions, shows score and answer key.  

---

## 🛠️ Setup

### 1. Clone Repo
```bash
git clone https://github.com/cityofsmiles/adding-subtracting-terms-flashcards.git
cd adding-subtracting-terms-flashcards