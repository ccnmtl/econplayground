import {Graph} from './Graph.js';

const cost = function(l, k, w, r) {
    return w * l + r * k;
};

const isocost = function(w, r, c, x) {
    const k = 1;
    // TODO: This function is incorrect.
    //
    // Here is the mathematica code:
    // isoc[w, r, c] := k /. Solve[cost[l, k, w, r] == c, k]
    //
    // Need to adjust this to include c (the gA2 range variable in the
    // frontend) as a solved variable.
    //
    return k / cost(x, k, w, r);
};

export class OptimalChoiceCostMinimizingGraph extends Graph {
    make() {
        const me = this;

        const f1 = function(x) {
            return isocost(me.options.gA1, me.options.gA2, me.options.gA3, x);
        };

        this.l1 = this.board.create(
            'functiongraph',
            [f1, 0, 100], {
                strokeWidth: 2,
                strokeColor: this.l1Color,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            }
        );
    }
}

export const mkOptimalChoiceCostMinimizing = function(board, options) {
    let g = new OptimalChoiceCostMinimizingGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
