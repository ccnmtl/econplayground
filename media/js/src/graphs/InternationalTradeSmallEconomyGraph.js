import { Graph, positiveRange } from './Graph.js';
import { drawPolygon, makeInvisiblePoint } from '../jsxgraphUtils.js';

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
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 0
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 0
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 1
    },
];

/*const dq = function(c, b, p) {
    return c / b  - p / b;
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

const eqd = function(c, b, a, d, wp) {
    return (c - wp) / b;
};

const eqs = function(c, b, a, d, wp) {
    return (-a + wp) / d;
};

export const paut = function(c, b, a, d) {
    return (a * b + c * d) / (b + d);
};

const csw = function(c, b, a, d, wp) {
    return (c - wp) * eqd(c, b, a, d, wp) / 2;
};

const psw = function(c, b, a, d, wp) {
    return (wp - a) * eqs(c, b, a, d, wp) / 2;
};

const tsw = function(c, b, a, d, wp) {
    return csw(c, b, a, d, wp) + psw(c, b, a, d, wp);
};

const eqdt = function(c, b, a, d, wp, t) {
    return (c - t - wp) / b;
};

const eqst = function(c, b, a, d, wp, t) {
    return (-a + t + wp) / d;
};

const cswt = function(c, b, a, d, wp, t) {
    return (c - wp - t) * eqdt(c, b, a, d, wp, t) / 2;
};

const pswt = function(c, b, a, d, wp, t) {
    return (wp + t - a) * eqst(c, b, a, d, wp, t) / 2;
};

const tariffrev = function(c, b, a, d, wp, t) {
    return (eqdt(c, b, a, d, wp, t) - eqst(c, b, a, d, wp, t)) * t;
};

const tswt = function(c, b, a, d, wp, t) {
    return cswt(c, b, a, d, wp, t) +
        pswt(c, b, a, d, wp, t) +
        tariffrev(c, b, a, d, wp, t);
};

const dwl = function(c, b, a, d, wp, t) {
    return tsw(c, b, a, d, wp) - tswt(c, b, a, d, wp, t);
};

export class InternationalTradeSmallEconomyGraph extends Graph {
    static qdhLabel = '<math><msubsup><mo>Q</mo><mn>D</mn><mn>H</mn></msubsup></math>';
    static qshLabel = '<math><msubsup><mo>Q</mo><mn>S</mn><mn>H</mn></msubsup></math>';

    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4, gA5, gA6) {
        let lineItems = [];

        if (gFunctionChoice === 0) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, ' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (
                        eqd(gA1, gA2, gA3, gA4, gA5) -
                            eqs(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
            ];
        } else if (gFunctionChoice === 1) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, ' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (
                        eqd(gA1, gA2, gA3, gA4, gA5) -
                            eqs(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: csw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: psw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Total Surplus TS',
                    color: 'red',
                    value: tsw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 2) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, ' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (
                        eqd(gA1, gA2, gA3, gA4, gA5) -
                            eqs(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Domestic Price, <math><msubsup><mo>P</mo><mn>H</mn><mn>t</mn></msubsup></math>',
                    color: 'red',
                    value: (gA5 + gA6).toFixed(2)
                },
                {
                    label: 'Domestic Tariff Revenue',
                    color: 'red',
                    value: (
                        -gA6 * (eqst(gA1, gA2, gA3, gA4, gA5, gA6) -
                                eqdt(gA1, gA2, gA3, gA4, gA5, gA6))
                    ).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 3) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, ' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (
                        eqd(gA1, gA2, gA3, gA4, gA5) -
                            eqs(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Domestic Price, <math><msubsup><mo>P</mo><mn>H</mn><mn>t</mn></msubsup></math>',
                    color: 'red',
                    value: (gA5 + gA6).toFixed(2)
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: csw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: psw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Tariff Revenue',
                    color: 'red',
                    value: (
                        -gA6 * (eqst(gA1, gA2, gA3, gA4, gA5, gA6) -
                                eqdt(gA1, gA2, gA3, gA4, gA5, gA6))
                    ).toFixed(2)
                },
                {
                    label: 'Total Surplus TS',
                    color: 'red',
                    value: tsw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Deadweight Loss DWL',
                    color: 'red',
                    value: dwl(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                }
            ];
        }

        return lineItems;
    }
    make() {
        const me = this;

        const dpLine = function(x) {
            return dp(me.options.gA1, me.options.gA2, x);
        };

        this.l2 = this.board.create(
            'functiongraph',
            [positiveRange(dpLine), 0, this.options.gXAxisMax], {
                name: 'Demand',
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

        const spLine = function(x) {
            return sp(me.options.gA3, me.options.gA4, x);
        };

        this.l1 = this.board.create(
            'functiongraph',
            [positiveRange(spLine), 0, this.options.gXAxisMax], {
                name: 'Supply',
                withLabel: true,
                label: {
                    strokeColor: this.l1Color
                },
                strokeWidth: 2,
                strokeColor: this.l1Color,
                fixed: true,
                highlight: false
            }
        );

        const wpLine = function() {
            return me.options.gA5;
        };

        this.l3 = this.board.create(
            'functiongraph',
            [positiveRange(wpLine), 0, this.options.gXAxisMax], {
                name: 'Global Price',
                withLabel: true,
                label: {
                    strokeColor: this.l3Color
                },
                strokeWidth: 2,
                strokeColor: this.l3Color,
                fixed: true,
                highlight: false
            }
        );

        const options = {
            showHorizLine: false
        };

        const i1 = this.showIntersection(
            this.l1, this.l3, false,
            InternationalTradeSmallEconomyGraph.qshLabel,
            null, null, false, false, 'red',
            options);
        const i2 = this.showIntersection(
            this.l2, this.l3, false,
            InternationalTradeSmallEconomyGraph.qdhLabel,
            null, null, false, false, 'red',
            options);

        this.board.create('line', [i1, i2], {
            dash: 2,
            highlight: false,
            strokeColor: 'red',
            strokeWidth: 2,
            straightFirst: false,
            straightLast: false
        });

        if (
            this.options.gFunctionChoice === 1 ||
            this.options.gFunctionChoice === 3
           ) {
            // shapes
            const gpPoint = makeInvisiblePoint(this.board, [0, this.options.gA5]);
            drawPolygon(this.board, [
                i2,
                makeInvisiblePoint(
                    this.board,
                    [0, dp(this.options.gA1, this.options.gA2, 0)]),
                gpPoint
            ], 'CS', 'lightblue');
            drawPolygon(this.board, [
                i1,
                gpPoint,
                makeInvisiblePoint(
                    this.board,
                    [0, sp(this.options.gA3, this.options.gA4, 0)]),
            ], 'PS', 'peachpuff');
        }
    }
}

export const mkInternationalTradeSmallEconomy = function(board, options) {
    let g = new InternationalTradeSmallEconomyGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
