import random
import json
from sympy import symbols, simplify

# Variables to use
variables = ['x', 'y', 'z', 'a', 'b', 'c']

def generate_expression(case):
    v = symbols(random.choice(variables))
    a = random.randint(-9, 9)
    b = random.randint(-9, 9)
    while a == 0 or b == 0:  # ensure nonzero
        a = random.randint(-9, 9)
        b = random.randint(-9, 9)
    m = random.randint(2, 8)  # power range 2–8

    if case == 1:  # Adding positive terms
        a, b = abs(a), abs(b)
        expr = a*v**m + b*v**m
    elif case == 2:  # Adding with negatives
        expr = a*v**m + b*v**m
    elif case == 3:  # Subtracting positive terms
        a, b = abs(a), abs(b)
        expr = a*v**m - b*v**m
    elif case == 4:  # Subtracting with negatives
        expr = a*v**m - b*v**m
    else:
        raise ValueError("Unknown case")

    simplified = simplify(expr)

    return {
        "question": str(expr),
        "answer": str(simplified),
        "case": case
    }

def main():
    flashcards = []
    for case in range(1, 5):
        for _ in range(30):  # ~120 total
            flashcards.append(generate_expression(case))

    with open("flashcards.json", "w") as f:
        json.dump(flashcards, f, indent=2)

    print("✅ flashcards.json generated with", len(flashcards), "cards")

if __name__ == "__main__":
    main()