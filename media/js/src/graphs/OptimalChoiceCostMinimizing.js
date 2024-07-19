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

const lStar = function(w, r, q, alpha, beta) {
    return q ** (
        1 / (alpha + beta)
    ) * (
        (beta * r) / (alpha * w)
    ) ** (
        alpha / (alpha + beta)
    );
};

const kStar = function(w, r, q, alpha, beta) {
    return q ** (
        1 / (alpha + beta)
    ) * (
        (alpha * r) / (beta * w)
    ) ** (
        -(beta / (alpha + beta))
    );
};

/**
 * Optimal bundle
 */
/*const opt1 = function(w, r, q, alpha, beta) {
    return [
        lStar(w, r, q, alpha, beta),
        kStar(w, r, q, alpha, beta)
    ];
};*/

/*const f1s = function(w, r, q, alpha, beta) {
    cost(opt1(w, r, q, alpha, beta)
};*/

/*const cStar = function(w, r) {
    w * lStar + r * kStar;
};*/

export class OptimalChoiceCostMinimizingGraph extends Graph {
    make() {
        const me = this;

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

        if (this.options.gToggle) {
            // General Cobb-Douglas Production Function
            const isoquantLine = function(x) {
                return isoquant(
                    me.options.gA3, me.options.gA4,
                    me.options.gA5, x);
            };

            this.l2 = this.board.create(
                'functiongraph',
                [isoquantLine, 0, 10000], {
                    name: 'Isoquant Q^* = ' + this.options.gA3,
                    withLabel: true,
                    strokeWidth: 2,
                    strokeColor: this.l2Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                }
            );

            const lStarVal = lStar(
                this.options.gA1, this.options.gA2, this.options.gA3,
                this.options.gA4, this.options.gA5);
            const kStarVal = kStar(
                this.options.gA1, this.options.gA2, this.options.gA3,
                this.options.gA4, this.options.gA5);

            this.board.create('line', [
                [lStarVal, 0],
                [lStarVal, kStarVal]
            ], {
                name: 'l^*',
                withLabel: true,
                fixed: true,
                strokeColor: 'red',
                dash: 2
            });

            this.board.create('line', [
                [0, kStarVal],
                [lStarVal, kStarVal]
            ], {
                name: 'k^*',
                withLabel: true,
                fixed: true,
                strokeColor: 'red',
                dash: 2
            });
        }
    }
}

export const mkOptimalChoiceCostMinimizing = function(board, options) {
    let g = new OptimalChoiceCostMinimizingGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
