#!/usr/bin/env python3
"""
generate_flashcards.py

Generates 100 flashcards (25 per case) for simplifying like terms.
Writes output to public/flashcards.json (creates public/ if missing).

Each flashcard:
  - question: a readable unsimplified expression (e.g. "2x^3 + 3x^3" or "-2x^3 - (-3x^3)")
  - answer: simplified expression (e.g. "5x^3" or "x^3")
  - case: 1..4 (as you defined)

Case rules:
  - a and b are nonzero integers
  - m is integer 2..8 (1 < m < 9)
  - v is one of ['x','y','z','a','b','c']
"""
import random
import json
import os
import sympy as sp

# configuration
NUM_PER_CASE = 25
variables = ['x', 'y', 'z', 'a', 'b', 'c']

def coef_display(coef: int) -> str:
    """Human-friendly coefficient for printing a single term.
       1 => '', -1 => '-' (so '-x^2'), otherwise '2', '-3', etc."""
    if coef == 1:
        return ""
    if coef == -1:
        return "-"
    return str(coef)

def term_str(coef: int, var: str, power: int) -> str:
    """Return a term like '2x^3', 'x^4', '-x^2'"""
    base = coef_display(coef)
    return f"{base}{var}^{power}" if base != "" else f"{var}^{power}"

def build_question(case: int, a: int, b: int, var: str, m: int) -> str:
    """Build the displayed (unsimplified) question string according to the rules.
       We follow the examples you provided (use + with parenthesis for negative second terms)."""
    # Case 1: Adding positive only -> "av^m + bv^m" both a,b > 0
    if case == 1:
        return f"{term_str(a, var, m)} + {term_str(b, var, m)}"

    # Case 2: Adding with negatives allowed -> examples: "-2x^3 + 3x^3", "-2b^4 + (-3b^4)"
    if case == 2:
        t1 = term_str(a, var, m)
        t2 = term_str(b, var, m)
        # If second coef is negative, wrap in parentheses to match your example
        if b < 0:
            return f"{t1} + ({t2})"
        else:
            return f"{t1} + {t2}"

    # Case 3: Subtracting positive only -> "av^m - bv^m" both positive
    if case == 3:
        return f"{term_str(a, var, m)} - {term_str(b, var, m)}"

    # Case 4: Subtracting with negatives -> examples: "-2z^2 - (-3z^2)"
    if case == 4:
        t1 = term_str(a, var, m)
        t2 = term_str(b, var, m)
        # If second coef is negative, wrap it in parentheses (so "- (-3x^3)")
        if b < 0:
            return f"{t1} - ({t2})"
        else:
            return f"{t1} - {t2}"

    raise ValueError("Unknown case")

def simplified_answer_str(sym_expr, var: str) -> str:
    """Return a human-friendly simplified answer string like '5x^3' or '0'."""
    sym_expr = sp.simplify(sym_expr)
    # numeric 0
    if sym_expr == 0:
        return "0"

    var_sym = sp.Symbol(var)
    # Try to interpret as polynomial in var_sym
    try:
        poly = sp.Poly(sym_expr, var_sym)
        degree = poly.degree()
        coeffs = poly.all_coeffs()
        # Leading coefficient (first entry)
        leading = coeffs[0]
        # Convert to int if possible, else str()
        try:
            leading_int = int(leading)
        except Exception:
            # fallback to string
            return str(sym_expr)
        return term_str(leading_int, var, degree)
    except Exception:
        # fallback: return sympy's string (safe)
        return str(sym_expr)

def pick_nonzero(allow_negative=True):
    if allow_negative:
        val = 0
        while val == 0:
            val = random.randint(-9, 9)
        return val
    else:
        val = 0
        while val == 0:
            val = random.randint(1, 9)
        return val

def generate_expression(case: int):
    var = random.choice(variables)
    m = random.randint(2, 8)  # 1 < m < 9
    # Coefficients (nonzero)
    if case in (1, 3):  # positive-only cases: ensure positive coefficients
        a = pick_nonzero(allow_negative=False)
        b = pick_nonzero(allow_negative=False)
    else:  # cases that allow negatives
        a = pick_nonzero(allow_negative=True)
        b = pick_nonzero(allow_negative=True)

    # Build sympy expression for computing the answer
    v_sym = sp.Symbol(var)
    if case in (1, 2):
        expr_sym = a * v_sym**m + b * v_sym**m
    else:  # cases 3 or 4 (subtraction)
        expr_sym = a * v_sym**m - b * v_sym**m

    question = build_question(case, a, b, var, m)
    answer = simplified_answer_str(expr_sym, var)

    return {
        "question": question,
        "answer": answer,
        "case": case
    }

def main():
    flashcards = []
    for case in range(1, 5):
        for _ in range(NUM_PER_CASE):
            flashcards.append(generate_expression(case))

    # Ensure public/ exists
    os.makedirs("public", exist_ok=True)

    with open("public/flashcards.json", "w") as f:
        json.dump(flashcards, f, indent=2, ensure_ascii=False)

    print("✅ public/flashcards.json generated with", len(flashcards), "cards")

if __name__ == "__main__":
    main()