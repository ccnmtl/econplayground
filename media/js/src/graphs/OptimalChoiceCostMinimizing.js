import {Graph} from './Graph.js';

/*const cost = function(l, k, w, r) {
    return w * l + r * k;
};*/

const isocost = function(w, r, c, k) {
    // c = w * l + r * k
    // Solve for l
    return (-(k * r) + c) / w;
};

const isoquant = function(q, alpha, beta, l) {
    // q = k ** alpha * l ** beta;
    // Solve for k
    return (q / (l ** beta)) ** (1 / alpha);
};

/*const lStar = function(q, alpha, beta, r, w) {
    return q ** (
        1 / (alpha + beta)
    ) * (
        (beta * r) / (alpha * w)
    ) ** (
        alpha / (alpha + beta)
    );
};

const kStar = function(q, alpha, beta, r, w) {
    return q ** (
        1 / (alpha + beta)
    ) * (
        (alpha * r) / (beta * w)
    ) ** (
        -(beta / (alpha + beta))
    );
};

const cStar = function(w, r) {
    w * lStar + r * kStar;
};*/

export class OptimalChoiceCostMinimizingGraph extends Graph {
    make() {
        const me = this;

        if (!me.options.gToggle) {
            const isocostLine = function(x) {
                return isocost(me.options.gA1, me.options.gA2, me.options.gA3, x);
            };

            this.l1 = this.board.create(
                'functiongraph',
                [isocostLine, 0, 1000], {
                    strokeWidth: 2,
                    strokeColor: this.l1Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                }
            );
        } else {
            const isocostLine = function(x) {
                return isocost(me.options.gA1, me.options.gA2, me.options.gA3, x);
            };

            this.l1 = this.board.create(
                'functiongraph',
                [isocostLine, 0, 1000], {
                    strokeWidth: 2,
                    strokeColor: this.l1Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                }
            );

            // General Cobb-Douglas Production Functions
            const isoquantLine = function(x) {
                return isoquant(me.options.gA3, me.options.gA4, me.options.gA5, x);
            };

            this.l2 = this.board.create(
                'functiongraph',
                [isoquantLine, 0, 10000], {
                    strokeWidth: 2,
                    strokeColor: this.l2Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                }
            );
        }
    }
}

export const mkOptimalChoiceCostMinimizing = function(board, options) {
    let g = new OptimalChoiceCostMinimizingGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
