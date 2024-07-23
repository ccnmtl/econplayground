import {Graph} from './Graph.js';

/*const cost = function(l, k, w, r) {
    return w * l + r * k;
};*/

const isocost = function(w, r, c, l) {
    // c = w * l + r * k
    // Solve for k
    return (-(l * w) + c) / r;
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
        (beta * r) / (alpha * w)
    ) ** (
        -(beta / (alpha + beta))
    );
};

const isocost0 = function(w, r, c, l, alpha, beta) {
    // See doc/minimization_problem.py for how we got this complicated
    // solution.
    //
    // Solving for k
    return -l * w / r + c ** (1 / (alpha + beta)) /
        (beta * r / (alpha * w)) ** (beta / (alpha + beta)) +
        c ** (1 / (alpha + beta)) *
        w * (beta * r / (alpha * w)) ** (alpha / (alpha + beta)) / r;
};

/*const opt1 = function(w, r, q, alpha, beta) {
    return [
        lStar(w, r, q, alpha, beta),
        kStar(w, r, q, alpha, beta)
    ];
};*/

/*const f1s = function(w, r, q, alpha, beta) {
    return cost(opt1(w, r, q, alpha, beta));
};*/

/*const cStar = function(w, r) {
    w * lStar + r * kStar;
    };*/

// Function choice: 1
const isocost1 = function(w, r, q, l, alpha, beta) {
    return (-l*w + q*r*(-alpha*w/(r*(alpha - 1)))**(1 - alpha) +
        q*w*(r*(1 - alpha)/(alpha*w))**alpha) / r;
};

const isoq2 = function(l, q, alpha) {
    // q = k ** alpha * l ** (1 - alpha);
    // Solve for k.
    return (l ** (alpha - 1) * q) ** (1 / alpha);
};

const optimalBundleColor = 'red';

export class OptimalChoiceCostMinimizingGraph extends Graph {
    make() {
        const me = this;

        let isocostLine = function(l) {
            return isocost(me.options.gA1, me.options.gA2, me.options.gA3, l);
        };

        let isoquantLine = function() {};
        let lStarVal, kStarVal;

        if (this.options.gToggle) {
            if (this.options.gFunctionChoice === 0) {
                // General Cobb-Douglas Production Function
                lStarVal = lStar(
                    this.options.gA1, this.options.gA2, this.options.gA3,
                    this.options.gA4, this.options.gA5);
                kStarVal = kStar(
                    this.options.gA1, this.options.gA2, this.options.gA3,
                    this.options.gA4, this.options.gA5);

                // Adapt the isocost line to touch the optimal bundle
                // at the isoquant.
                isocostLine = function(l) {
                    return isocost0(
                        me.options.gA1, me.options.gA2,
                        me.options.gA3, l, me.options.gA4, me.options.gA5);
                };

                isoquantLine = function(x) {
                    return isoquant(
                        me.options.gA3, me.options.gA4,
                        me.options.gA5, x);
                };


            } else if (this.options.gFunctionChoice === 1) {
                const lStar1 = function(w, r, q, alpha) {
                    return q * ((1 - alpha) * r / (alpha * w)) ** alpha;
                };

                const kStar1 = function(w, r, q, alpha) {
                    return q * (alpha * w / ((1 - alpha) * r)) ** (1 - alpha);
                };

                lStarVal = lStar1(
                    this.options.gA1, this.options.gA2, this.options.gA3,
                    this.options.gA4);
                kStarVal = kStar1(
                    this.options.gA1, this.options.gA2, this.options.gA3,
                    this.options.gA4);

                isocostLine = function(l) {

                    return isocost1(
                        me.options.gA1, me.options.gA2,
                        me.options.gA3, l, me.options.gA4, me.options.gA5);
                };

                isoquantLine = function(x) {
                    return isoq2(x, me.options.gA3, me.options.gA4);
                };
            }

            this.l2 = this.board.create(
                'functiongraph',
                [isoquantLine, 0, this.options.gXAxisMax], {
                    name: 'Isoquant Q^* = ' + this.options.gA3,
                    withLabel: true,
                    label: {
                        strokeColor: this.l2Color
                    },
                    strokeWidth: 2,
                    strokeColor: this.l2Color,
                    fixed: true,
                    highlight: false
                }
            );

            if (lStarVal && kStarVal) {
                const optimalBundlePoint = this.board.create('point', [
                    lStarVal, kStarVal
                ], {
                    name: 'Optimal Bundle',
                    withLabel: true,
                    visible: this.options.gShowIntersection,
                    label: {
                        strokeColor: optimalBundleColor
                    },
                    fixed: true,
                    strokeColor: optimalBundleColor,
                    fillColor: optimalBundleColor
                });

                this.board.create('line', [
                    [lStarVal, 0],
                    optimalBundlePoint
                ], {
                    name: 'l^*',
                    withLabel: true,
                    visible: this.options.gShowIntersection,
                    label: {
                        strokeColor: optimalBundleColor
                    },
                    fixed: true,
                    strokeColor: optimalBundleColor,
                    dash: 2,
                    straightFirst: false,
                    straightLast: false
                });

                this.board.create('line', [
                    [0, kStarVal],
                    optimalBundlePoint
                ], {
                    name: 'k^*',
                    withLabel: true,
                    visible: this.options.gShowIntersection,
                    label: {
                        strokeColor: optimalBundleColor
                    },
                    fixed: true,
                    strokeColor: optimalBundleColor,
                    dash: 2,
                    straightFirst: false,
                    straightLast: false
                });
            }
        }

        this.l1 = this.board.create(
            'functiongraph',
            [isocostLine, 0, this.options.gXAxisMax], {
                strokeWidth: 2,
                strokeColor: this.l1Color,
                fixed: true,
                highlight: false
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
