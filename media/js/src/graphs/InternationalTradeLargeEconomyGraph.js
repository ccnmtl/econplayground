import { Graph, positiveRange } from './Graph.js';
import {
    InternationalTradeSmallEconomyGraph,
    csw, psw, tsw, eqdt, eqst
} from './InternationalTradeSmallEconomyGraph.js';

export const defaults = [
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 2,
        gA7: 0
    },
];

const qd = function(c, b, p) {
    return c / b - p / b;
};

const qs = function(a, d, p) {
    return -a / d + p / d;
};

const eqd = function(c, b, a, d, p) {
    return qd(c, b, p);
};

const eqs = function(c, b, a, d, p) {
    return qs(a, d, p);
};

const pAutHome = function(c, b, a, d) {
    return (a * b + c * d) / (b + d);
};

export const pAutForeign = function(m0, m1) {
    return m0 / m1;
};

/*const dq = function(c, b, p) {
    return c / b  - p / b;
};*/

/*const dp = function(c, b, q) {
    return c - b * q;
};*/

/*const sq = function(a, d, p) {
    return -(a / d) + p / d;
};*/

/*const sp = function(a, d, q) {
    return a + d * q;
};*/

/*const eqd = function(c, b, a, d, wp) {
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
};*/

/*const tsw = function(c, b, a, d, wp) {
    return csw(c, b, a, d, wp) + psw(c, b, a, d, wp);
};*/

/*const eqdt = function(c, b, a, d, wp, t) {
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
};*/

/*const tswt = function(c, b, a, d, wp, t) {
    return cswt(c, b, a, d, wp, t) +
        pswt(c, b, a, d, wp, t) +
        tariffrev(c, b, a, d, wp, t);
};*/

/*const dwl = function(c, b, a, d, wp, t) {
    return tsw(c, b, a, d, wp) - tswt(c, b, a, d, wp, t);
};*/

/*const pd = function(c, b, q) {
    return c - b * q;
};*/

const edHome = function(c, b, a, d, p) {
    return qd(c, b, p) - qs(a, d, p);
};

const pWorld = function(c, b, a, d, m0, m1) {
    return (c / b + a / d + m0) / (1 / b + 1 / d + m1);
};

const tradeQty = function(c, b, a, d, m0, m1) {
    return edHome(c, b, a, d, pWorld(c, b, a, d, m0, m1));
};

const A = function(c, b, a, d) {
    return (c * d + a * b) / (b + d);
};

const pHt = function(c, b, a, d, m0, m1, t) {
    return (A(c, b, a, d) + m0 + m1 * t) / (m1 + 1);
};

const pFt = function(c, b, a, d, m0, m1, t) {
    return (A(c, b, a, d) + m0 - t) / (m1 + 1);
};

const cswlt = function(c, b, a, d, m0, m1, t) {
    return (c - pHt(c, b, a, d, m0, m1, t)) *
        eqd(c, b, a, d, pHt(c, b, a, d, m0, m1, t)) / 2;
}

const pswlt = function(c, b, a, d, m0, m1, t) {
    return (pHt(c, b, a, d, m0, m1, t) - a) *
        eqs(c, b, a, d, pHt(c, b, a, d, m0, m1, t)) / 2;
}

const tariffrev1 = function(c, b, a, d, m0, m1, t) {
    return t * tradeQty(c, b, a, d, m0, m1, t);
};

const cswl = function(c, b, a, d, m0, m1) {
    return (c - pWorld(c, b, a, d, m0, m1)) *
        eqd(c, b, a, d, pWorld(c, b, a, d, m0, m1)) / 2;
}

const pswl = function(c, b, a, d, m0, m1) {
    return (pWorld(c, b, a, d, m0, m1) - a) *
        eqs(c, b, a, d, pWorld(c, b, a, d, m0, m1)) / 2;
}

const tswl = function(c, b, a, d, m0, m1) {
    return cswl(c, b, a, d, m0, m1) + pswl(c, b, a, d, m0, m1);
};

const tswlt = function(c, b, a, d, m0, m1, t) {
    return cswlt(c, b, a, d, m0, m1, t) +
        pswlt(c, b, a, d, m0, m1, t) +
        tariffrev1(c, b, a, d, m0, m1, t);
};

const dwllt = function(c, b, a, d, m0, m1, t) {
    return tswl(c, b, a, d, m0, m1) - tswlt(c, b, a, d, m0, m1, t);
};

export class InternationalTradeLargeEconomyGraph extends InternationalTradeSmallEconomyGraph {
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4, gA5, gA6, gA7) {
        let lineItems = [];

        const pw = pWorld(gA1, gA2, gA3, gA4, gA5, gA6);
        const qdAtPw = eqd(gA1, gA2, gA3, gA4, pw);
        const qsAtPw = eqs(gA1, gA2, gA3, gA4, pw);

        if (gFunctionChoice === 0) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, ' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: qdAtPw.toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: qsAtPw.toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (
                        qsAtPw - qdAtPw
                    ).toFixed(2)
                },
                {
                    label: 'Global Price, P<sub>w</sub>',
                    color: 'red',
                    value: pw.toFixed(2)
                },
            ];
        } else if (gFunctionChoice === 1) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, ' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: qdAtPw.toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: qsAtPw.toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (
                        qsAtPw - qdAtPw
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
                    value: qdAtPw.toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: qsAtPw.toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (
                        qsAtPw - qdAtPw
                    ).toFixed(2)
                },
                {
                    label: 'Domestic Price, <math><msubsup><mo>P</mo><mn>H</mn><mn>t</mn></msubsup></math>',
                    color: 'red',
                    value: (gA5 + gA6).toFixed(2)
                },
                {
                    label: 'Foreign Price, <math><msubsup><mo>P</mo><mn>F</mn><mn>t</mn></msubsup></math>',
                    color: 'red',
                    value: pFt(gA1, gA2, gA3, gA4, gA5, gA6, gA7).toFixed(2)
                },
                {
                    label: 'Domestic Tariff Revenue',
                    color: 'red',
                    value: (
                        -gA6 * (eqst(gA1, gA2, gA3, gA4, gA5, gA6) -
                                eqdt(gA1, gA2, gA3, gA4, gA5, gA6))
                    ).toFixed(2)
                },
            ];
        } else if (gFunctionChoice === 3) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, ' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: qdAtPw.toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: qsAtPw.toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (
                        qsAtPw - qdAtPw
                    ).toFixed(2)
                },
                {
                    label: 'Global Price, P<sub>w</sub>',
                    color: 'red',
                    value: (
                        pWorld(gA1, gA2, gA3, gA4, gA5, gA6, gA7)
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
                },
                {
                    label: 'Domestic Net Gain',
                    color: 'red',
                    value: -dwllt(gA1, gA2, gA3, gA4, gA5, gA6, gA7).toFixed(2)
                },
            ];
        }

        return lineItems;
    }
}

const edHomeInv = function(c, b, a, d, q) {
    return (c * d + a * b - q * (b + d)) / (b + d);
};

/*const esHomeInv = function(c, b, a, d, q) {
    return (c * d + a * b + q * (b + d)) / (b + d);
};*/

/*const mdRoWInv = function(m0, m1, q) {
    return (m0 - q) / m1;
};*/

const xsRoWInv = function(m0, m1, q) {
    return (m0 + q) / m1;
};

export class InternationalTradeLargeEconomyGlobalGraph extends Graph {
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4, gA5, gA6, gA7) {
        let lineItems = [];

        if (gFunctionChoice < 2) {
            lineItems = [
                {
                    label: 'World Price P<sub>w</sub>',
                    color: 'black',
                    value: pWorld(gA1, gA2, gA3, gA4, gA5, gA6, gA7).toFixed(2)
                },
                {
                    label: 'Trade Quantity',
                    color: 'black',
                    value: tradeQty(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                },
                {
                    label: 'Status',
                    color: 'black',
                    value: 'Home Imports'
                },
                {
                    label: 'P<sub>H</sub><sup>A</sup>',
                    color: 'black',
                    value: Math.round(pAutHome(gA1, gA2, gA3, gA4))
                },
                {
                    label: 'P<sub>F</sub><sup>A</sup>',
                    color: 'black',
                    value: Math.round(pAutForeign(gA5, gA6))
                },
            ];
        } else if (gFunctionChoice >= 2) {
            lineItems = [
                {
                    label: 'Home Price',
                    color: 'black',
                    value: pHt(gA1, gA2, gA3, gA4, gA5, gA6, gA7).toFixed(2)
                },
                {
                    label: 'Trade Quantity',
                    color: 'black',
                    value: tradeQty(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                },
                {
                    label: 'Status',
                    color: 'black',
                    value: 'Home Imports'
                },
                {
                    label: 'P<sub>H</sub><sup>t</sup>',
                    color: 'black',
                    value: pHt(gA1, gA2, gA3, gA4, gA5, gA6, gA7).toFixed(2)
                },
                {
                    label: 'P<sub>F</sub><sup>t</sup>',
                    color: 'black',
                    value: pFt(gA1, gA2, gA3, gA4, gA5, gA6, gA7).toFixed(2)
                },
            ];
        }

        return lineItems;
    }

    make() {
        const me = this;

        const pw = pWorld(
            this.options.gA1, this.options.gA2,
            this.options.gA3, this.options.gA4,
            this.options.gA5, this.options.gA6);

        const qTrade = tradeQty(
            this.options.gA1, this.options.gA2,
            this.options.gA3, this.options.gA4,
            this.options.gA5, this.options.gA6);

        const edHomeInvLine = function(x) {
            return edHomeInv(
                me.options.gA1, me.options.gA2,
                me.options.gA3, me.options.gA4,
                x);
        };

        const xsRoWInvLine = function(x) {
            return xsRoWInv(
                me.options.gA5, me.options.gA6,
                x);
        };

        const ePoint = [qTrade, pw];
        this.board.create(
            'functiongraph',
            [positiveRange(edHomeInvLine), 0, this.options.gXAxisMax], {
                name: 'Domestic',
                withLabel: true,
                label: {
                    strokeColor: this.l2Color
                },
                highlight: false,
                strokeColor: this.l2Color,
                strokeWidth: 2,
                fixed: true,
                straightFirst: false,
                straightLast: true
            });

        this.board.create(
            'functiongraph',
            [positiveRange(xsRoWInvLine), 0, this.options.gXAxisMax], {
                name: 'RoW',
                withLabel: true,
                label: {
                    strokeColor: this.l1Color
                },
                highlight: false,
                strokeColor: this.l1Color,
                strokeWidth: 2,
                fixed: true,
                straightFirst: false,
                straightLast: true
            });

        this.board.create('point', ePoint, {
            name: 'E',
            fillColor: this.l3Color,
            strokeColor: this.l3Color,
            label: {
                strokeColor: this.l3Color
            },
            fixed: true,
            highlight: false,
            showInfobox: false
        });
        this.board.create('line', [[0, pw], ePoint], {
            dash: 2,
            highlight: false,
            strokeColor: this.l3Color,
            strokeWidth: 2,
            straightFirst: false,
            straightLast: false
        });
        this.board.create('line', [[qTrade, 0], ePoint], {
            dash: 2,
            highlight: false,
            strokeColor: this.l3Color,
            strokeWidth: 2,
            straightFirst: false,
            straightLast: false
        });
    }
}

export const mkInternationalTradeLargeEconomy = function(board, options) {
    let g = new InternationalTradeLargeEconomyGraph(board, options);
    g.make();
    g.postMake();
    return g;
};

export const mkInternationalTradeLargeEconomyGlobal = function(board, options) {
    let g = new InternationalTradeLargeEconomyGlobalGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
