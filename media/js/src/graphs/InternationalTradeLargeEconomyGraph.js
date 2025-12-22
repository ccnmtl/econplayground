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
        gA6: 2
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

const qd = function(c, b, p) {
    return c / b - p / b;
};

/*const pd = function(c, b, q) {
    return c - b * q;
};*/

const qs = function(a, d, p) {
    return -a / d + p / d;
};

const edHome = function(c, b, a, d, p) {
    return qd(c, b, p) - qs(a, d, p);
};

const pWorld = function(c, b, a, d, m0, m1) {
    return (c / b + a / d + m0) / (1 / b + 1 / d + m1);
};

const tradeQty = function(c, b, a, d, m0, m1) {
    return edHome(c, b, a, d, pWorld(c, b, a, d, m0, m1));
};

export class InternationalTradeLargeEconomyGraph extends Graph {
    static qdhLabel = '<math><msubsup><mo>Q</mo><mn>D</mn><mn>H</mn></msubsup></math>';
    static qshLabel = '<math><msubsup><mo>Q</mo><mn>S</mn><mn>H</mn></msubsup></math>';

    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4, gA5, gA6) {
        let lineItems = [];

        if (gFunctionChoice === 0) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, Q<sup>H</sup><sub>D</sub>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, Q<sup>H</sup><sub>S</sub>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, Q<sup>H</sup><sub>S</sub>-Q<sup>H</sup><sub>D</sub>',
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
                    label: 'Domestic Quantity Bought, Q<sup>H</sup><sub>D</sub>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, Q<sup>H</sup><sub>S</sub>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, Q<sup>H</sup><sub>S</sub>-Q<sup>H</sup><sub>D</sub>',
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
                    label: 'Domestic Quantity Bought, Q<sup>H</sup><sub>D</sub>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, Q<sup>H</sup><sub>S</sub>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, Q<sup>H</sup><sub>S</sub>-Q<sup>H</sup><sub>D</sub>',
                    color: 'red',
                    value: (
                        eqd(gA1, gA2, gA3, gA4, gA5) -
                            eqs(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Domestic Price, P<sup>t</sup><sub>H</sub>',
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
                    label: 'Domestic Quantity Bought, Q<sup>H</sup><sub>D</sub>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, Q<sup>H</sup><sub>S</sub>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, Q<sup>H</sup><sub>S</sub>-Q<sup>H</sup><sub>D</sub>',
                    color: 'red',
                    value: (
                        eqd(gA1, gA2, gA3, gA4, gA5) -
                            eqs(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Domestic Price, P<sup>t</sup><sub>H</sub>',
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
                name: 'Demand',
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

        this.showIntersection(
            this.l1, this.l3, false,
            InternationalTradeLargeEconomyGraph.qshLabel);
        this.showIntersection(
            this.l2, this.l3, false,
            InternationalTradeLargeEconomyGraph.qdhLabel);
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
