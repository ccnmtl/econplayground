#!/usr/bin/env wolframscript
(*
  This script can be run with the freely available Wolfram Engine:
  https://www.wolfram.com/engine/
*)

Bconstr[x_, y_, px_, py_, R_] = px * x + py * y - R;

f0[px_, py_, R_] := y /. Solve[Bcostr[x, y, px, py, R] == 0, y]

(*
    wolframscript allows unicode (α) as input when run with the
    -script argument. Otherwise, the Wolfram character name must be
    used: \[Alpha]
*)
U1[x_, y_, \[Alpha]_, \[Beta]_] := x ^ \[Alpha] * y ^ \[Beta];
MRS1 = D[U1[x, y, \[Alpha]_, \[Beta]_], x] /
     D[U1[x, y, \[Alpha], \[Beta], y]];

xstarvalue1[px_, py_, R_, \[Alpha]_, \[Beta]_] :=
                 (\[Alpha] / (\[Alpha] + \[Beta])) * (R / px)
ystarvalue1[px_, py_, R_, \[Alpha]_, \[Beta]_] :=
                 (\[Beta] / (\[Alpha] + \[Beta])) * (R / py)

opt1[px_, py_, R_, \[Alpha]_, \[Beta]_] := Evaluate[{
          xstarvalue1[px, py, R, \[Alpha], \[Beta]],
          ystarvalue1[px, py, R, \[Alpha], \[Beta]]
}]

f1[px_, py_, R_, \[Alpha]_, \[Beta]_] := y /. Solve[
        U1[##&@@opt1[px, py, R, \[Alpha], \[Beta]], \[Alpha], \[Beta]] ==
                         U1[x, y, \[Alpha], \[Beta]],
        y
];

Print[Solve[
        U1[##&@@opt1[px, py, R, \[Alpha], \[Beta]], \[Alpha], \[Beta]] ==
                         U1[x, y, \[Alpha], \[Beta]],
        y
]];