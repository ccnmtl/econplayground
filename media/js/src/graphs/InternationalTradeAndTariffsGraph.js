import { Graph, positiveRange } from './Graph.js';

export const defaults = [
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 0
    }
];

/*const dq = function(c, b, p) {
    return c / b  - p / b;
};*/

const dp = function(c, b, q) {
    return c - b * q;
};

const sq = function(a, d, p) {
    return -(a / d) + p / d;
};

const sp = function(a, d, q) {
    return a + d * q;
};

/*const eqd = function(c, b, a, d, wp) {
    return (c - wp) / b;
};

const eqs = function(c, b, a, d, wp) {
    return (-a + wp) / d;
};*/

/*const paut = function(c, b, a, d) {
    return (a * b + c * d) / (b + d);
};*/

export class InternationalTradeAndTariffsGraph extends Graph {
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3) {
        let lineItems = [];

        if (gFunctionChoice === 0) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, Q<sup>H</sup><sub>D</sub>',
                    color: 'red',
                    value: dp(gA1, gA2, gA3).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, Q<sup>H</sup><sub>S</sub>',
                    color: 'red',
                    value: sq(gA1, gA2, gA3).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, Q<sup>H</sup><sub>S</sub>-Q<sup>H</sup><sub>D</sub>',
                    color: 'red',
                    value: sp(gA1, gA2, gA3).toFixed(2)
                },
            ];
        }

        return lineItems;
    }
    make() {
        const me = this;

        const wpLine = function() {
            return me.options.gA5;
        };

        this.l2 = this.board.create(
            'functiongraph',
            [positiveRange(wpLine), 0, this.options.gXAxisMax], {
                name: 'Global Price',
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
    }
}

export const mkInternationalTradeAndTariffs = function(board, options) {
    let g = new InternationalTradeAndTariffsGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
