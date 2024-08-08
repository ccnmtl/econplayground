import { Graph, AREA_A_COLOR, AREA_B_COLOR } from './Graph.js';
import {drawPolygon} from '../jsxgraphUtils.js';

/*const dq = function(c, b, p) {
    return c / b - p / b;
};*/

const dp = function(c, b, q) {
    return c - b * q;
};

/*const sq = function(a, d, p) {
    return -(a / d) + p / d;
};*/

const sp = function(a, d, q) {
    return a + d * q;
};

export const ep = function(c, b, a, d) {
    return (a * b + c * d) / (b + d);
};

export const eq = function(c, b, a, d) {
    return (-a + c) / (b + d);
};

export const cos = function(c, b, a, d) {
    return (c - ep(c, b, a, d)) * eq(c, b, a, d) / 2;
};

export const pos = function(c, b, a, d) {
    return ep(c, b, a, d) * eq(c, b, a, d) / 2;
};

export const tos = function(c, b, a, d) {
    return cos(c, b, a, d) + pos(c, b, a, d);
};

const equt = function(c, b, a, d, t) {
    return (-a + c - t) / (b + d);
};

export const taxur = function(c, b, a, d, t) {
    return equt(c, b, a, d, t) * t;
};

export const dwlu = function(c, b, a, d, t) {
    return (eq(c, b, a, d) - equt(c, b, a, d, t)) * t / 2;
};

const eqat = function(c, b, a, d, t) {
    return (-a * t - a + c) / (b + d * t + d);
};

export const taxar = function(c, b, a, d, t) {
    return eqat(c, b, a, d, t) * t;
};

class TaxationLinearDemandSupplyGraph extends Graph {
    make() {
        const me = this;

        const l1func = function(x) {
            return sp(me.options.gA2, me.options.gLine1Slope, x);
        };
        this.l1 = this.board.create(
            'functiongraph',
            [function(x) {
                const result = l1func(x);

                if (result < 0) {
                    return NaN;
                }

                return result;
            }, 0, this.options.gXAxisMax], {
                strokeWidth: 2,
                strokeColor: this.l1Color,
                fixed: true,
                highlight: false
            }
        );

        const l2func = function(x) {
            return dp(me.options.gA1, me.options.gLine2Slope, x);
        };
        this.l2 = this.board.create(
            'functiongraph',
            [function(x) {
                const result = l2func(x);

                if (result < 0) {
                    return NaN;
                }

                return result;
            }, 0, this.options.gXAxisMax], {
                strokeWidth: 2,
                strokeColor: this.l2Color,
                fixed: true,
                highlight: false
            }
        );

        if (this.options.gShowIntersection) {
            const intersection = this.showIntersection(this.l1, this.l2);

            drawPolygon(this.board, [
                intersection,
                [0, this.options.gA1],
                [0, intersection.Y()]
            ], null, AREA_A_COLOR);
            drawPolygon(this.board, [
                intersection,
                [0, intersection.Y()],
                [0, this.l1.Y(0)]
            ], null, AREA_B_COLOR);
        }
    }
}

export const mkTaxationLinearDemandSupply = function(board, options) {
    options.locked = true;

    // Shade in the two left areas.
    options.gAreaConfiguration = 3;

    options.gIntersectionLabel = 'Equilibrium';
    options.gIntersectionHorizLineLabel = 'P^*';
    options.gIntersectionVertLineLabel = 'Q^*';

    if (options.gToggle) {
        options.gIntersectionLabel = '(Q^t, p^d)';
        options.gIntersectionHorizLineLabel = 'p^d';
        options.gIntersectionVertLineLabel = 'Q^t';
    }

    let g = new TaxationLinearDemandSupplyGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
