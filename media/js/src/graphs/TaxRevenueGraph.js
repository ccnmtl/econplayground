import {Graph} from './Graph.js';

export const defaults = [
    {
        gA1: 1500,
        gA1Min: 0,
        gA1Max: 10000,
        gA2: 2,
        gA2Min: 0.01,
        gA2Max: 35,
        gA3: 100,
        gA3Min: 0,
        gA3Max: 10000,
        gA4: 2,
        gA4Min: 0.01,
        gA4Max: 35,
        gA5: 0.5,
        gA5Min: 0,
        gA5Max: 1,
        gXAxisMin: 0,
        gXAxisMax: 1500,
        gYAxisMin: 0,
        gYAxisMax: 500000
    },
    {
        gA1: 650,
        gA1Min: 0,
        gA1Max: 10000,
        gA2: 2,
        gA2Min: 0.01,
        gA2Max: 35,
        gA3: 100,
        gA3Min: 0,
        gA3Max: 10000,
        gA4: 6,
        gA4Min: 0.01,
        gA4Max: 35,
        gA5: 0.5,
        gA5Min: 0,
        gA5Max: 1,
        gXAxisMin: 0,
        gXAxisMax: 6,
        gYAxisMin: 0,
        gYAxisMax: 25000
    }
];

const tu = function(c, b, a, d, t) {
    return (c - a - t) * t / (b + d);
};

const tustar = function(c, a) {
    return (c - a) / 2;
};

const epat = function(c, b, a, d, t) {
    return (a * b + c * d) / (b + d * (1 + t));
};

const eqat = function(c, b, a, d, t) {
    return (c - a * (1 + t)) / (b + d * (1 + t));
};

const ta = function(c, b, a, d, t) {
    return t * epat(c, b, a, d, t) * eqat(c, b, a, d, t);
};

const tastar = function(c, b, a, d) {
    return ((c - a) * d + b * c - a * b) / ((c + a) * d + 2 * a * b);
};

export class TaxRevenueGraph extends Graph {
    make() {
        const me = this;

        let f1 = function() {};

        if (this.options.gFunctionChoice === 0) {
            const tuStar = tustar(this.options.gA1, this.options.gA3);
            const taxPeak = [
                tuStar, tuStar ** 2 / (this.options.gA2 + this.options.gA4)
            ];
            this.p1 = this.board.create('point', taxPeak, {
                name: taxPeak[0].toFixed(2),
                withLabel: true,
                fixed: true,
                highlight: false
            });
            this.dash1Horz = this.board.create('line', [[taxPeak[0], 0], taxPeak], {
                strokeWidth: 2,
                strokeColor: this.l3Color,
                dash: 2,
                fixed: true,
                highlight: false,
                straightFirst: false,
                straightLast: false
            });
            this.dash1Vert = this.board.create('line', [[0, taxPeak[1]], taxPeak], {
                strokeWidth: 2,
                strokeColor: this.l3Color,
                dash: 2,
                fixed: true,
                highlight: false,
                straightFirst: false,
                straightLast: false
            });

            f1 = function(x) {
                return tu(
                    me.options.gA1, me.options.gA2,
                    me.options.gA3, me.options.gA4, x);
            };
        } else if (this.options.gFunctionChoice === 1) {
            const taStar = tastar(
                this.options.gA1, this.options.gA2,
                this.options.gA3, this.options.gA4);
            const taxPeak = [
                taStar,
                ta(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4, taStar)];
            this.p1 = this.board.create('point', taxPeak, {
                name: taxPeak[0].toFixed(2),
                withLabel: true,
                fixed: true,
                highlight: false
            });
            this.dash1Horz = this.board.create('line', [[taxPeak[0], 0], taxPeak], {
                strokeWidth: 2,
                strokeColor: this.l3Color,
                dash: 2,
                fixed: true,
                highlight: false,
                straightFirst: false,
                straightLast: false,
            });
            this.dash1Vert = this.board.create('line', [[0, taxPeak[1]], taxPeak], {
                strokeWidth: 2,
                strokeColor: this.l3Color,
                dash: 2,
                fixed: true,
                highlight: false,
                straightFirst: false,
                straightLast: false,
            });

            f1 = function(x) {
                return ta(
                    me.options.gA1, me.options.gA2,
                    me.options.gA3, me.options.gA4, x);
            };
        }

        this.l1 = this.board.create('functiongraph', [
            function(x) {
                const result = f1(x);

                if (result < 0) {
                    return NaN;
                }

                return result;
            },
            this.options.gXAxisMin, this.options.gXAxisMax
        ], {
            strokeWidth: 2,
            strokeColor: this.l2Color,
            fixed: true,
            highlight: false
        });
    }
}

export const mkTaxRevenue = function(board, options) {
    let g = new TaxRevenueGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
