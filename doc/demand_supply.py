#!/usr/bin/env python

#
# For development purposes, here's an example to solve an equality in
# sympy.
#
# When working with Mathematica code, we often run into scenarios
# where we solve an equality for a certain variable. Mathematica and
# Wolfram Cloud can do this, but so can Python, using sympy.
#
# https://docs.sympy.org/latest/guides/solving/solve-equation-algebraically.html
#

from sympy import Eq, solve
from sympy.abc import c, b, p, a, d, q


ep = Eq(
    c / b  - p / b,
    -(a / d) + p / d
)

eq = Eq(
    c - b * q,
    a + d * q
)


solutions = solve(ep, p, dict=True)
solutions_eq = solve(eq, q, dict=True)


if __name__ == '__main__':
    print(solutions)
    print(solutions_eq)