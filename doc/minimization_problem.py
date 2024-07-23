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
from sympy.abc import w, l, r, k, q, alpha, beta

# This example equation specifies the isocost line for a complex set
# of inputs, described in the ContourPlot section of this answer:
# https://mathematica.stackexchange.com/a/303907/34965
equation = Eq(
    w * l + r * k,

    q ** (1 / (alpha + beta)) *
    w * (
        (r * beta)/
        (w * alpha)
    ) ** (
        alpha / (alpha + beta)
    ) +
    q ** (1 / (alpha + beta)) *
    r * (
        (r * beta) / (w * alpha)
    ) **
        -(beta / (alpha + beta)
    )
)

f2s_equation = Eq(
    w * l + r * k,
    w * (q * ((1 - alpha) * r / (alpha * w)) ** alpha) +
    r * (q * (alpha * w / ((1 - alpha) * r)) ** (1 - alpha))
)


solutions = solve(equation, k, dict=True)
solutions_2 = solve(f2s_equation, k, dict=True)


if __name__ == '__main__':
    print(solutions)
    print(solutions_2)
