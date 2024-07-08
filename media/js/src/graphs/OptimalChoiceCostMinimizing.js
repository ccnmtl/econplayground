import {Graph} from './Graph.js';

const isocost = function(w, r, c, k) {
    // c = w * l + r * k
    // Solve for l
    return (-(k * r) + c) / w;
};

export class OptimalChoiceCostMinimizingGraph extends Graph {
    make() {
        const me = this;

        const f1 = function(x) {
            return isocost(me.options.gA1, me.options.gA2, me.options.gA3, x);
        };

        this.l1 = this.board.create(
            'functiongraph',
            [f1, 0, 1000], {
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
