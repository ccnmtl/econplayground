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
from sympy.abc import w, l, r, k, q, alpha, beta, rho, t, a, b, f

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

isoq3 = Eq(
    k ** alpha * l ** (1 - alpha),
    q
)

#
# sympy does not provide symbols for arbitrary variables like tw, and
# tr, so in this equality:
# a == tw
# b == tr
#
f3s = Eq(
    # cost3 function with lStar and kStar
    (1 + t + a) * w *
    # lStar, i.e. replacing l with the lStarValue3 function.
    (
        q * (
            (1 - alpha) * (1 + t + b) * r / (alpha * (1 + t + a) * w)
        ) ** alpha
    )
    + (1 + t + b) * r *
    # kStar, similar to lStar above
    (
        q * (
            alpha * (1 + t + a) * w / ((1 - alpha) * (1 + t + b) * r)
        ) ** (1 - alpha)
    )
    - f,

    # cost3 function
    (1 + t + a) * w * l + (1 + t + b) * r * k - f
)

f4 = Eq(
    (k ** rho + l ** rho) ** (1 / rho),
    q
)

f4s = Eq(
    w *
    # lStar
    w ** (1 / (rho - 1)) * q /
    # x()
    ((w ** (rho / (rho - 1)) + r ** (rho / (rho - 1))) ** (1 / rho))
    + r *
    # kStar
    r ** (1 / (rho - 1)) * q /
    # x()
    ((w ** (rho / (rho - 1)) + r ** (rho / (rho - 1))) ** (1 / rho)),
    w * l + r * k
)


solutions = solve(equation, k, dict=True)
solutions_1 = solve(f2s_equation, k, dict=True)
solutions_isoq3 = solve(isoq3, k, dict=True)
solutions_f3s = solve(f3s, k, dict=True)
solutions_f4 = solve(f4, k, dict=True)
solutions_f4s = solve(f4s, k, dict=True)


if __name__ == '__main__':
    print(solutions)
    print(solutions_1)
    print(solutions_isoq3)
    print(solutions_f3s)
    print(solutions_f4)
    print(solutions_f4s)
