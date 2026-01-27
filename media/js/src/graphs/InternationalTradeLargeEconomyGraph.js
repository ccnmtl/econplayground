import { Graph, positiveRange } from './Graph.js';
import {
    InternationalTradeSmallEconomyGraph
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

const qd = (c, b, p) => (c - p) / b ;
// const pd = (c, b, q) => c - b * q;

const qs = (a, d, p) => (-a + p) / d;
// const ps = (a, d, q) => a + d * q;

// Domestic excess demand at price p+
const edHome = (c, b, a, d, p) => qd(c, b, p) - qs(a, d, p);

// Foreign import demand (quantity form)
const mdRoW = (m0, m1, p) => m0 - m1 * p;

// Inverse curves for world panel (price as a function of trade qty q)
const edHomeInv = (c, b, a, d, q) =>
    (c * d + a * b - q * (b + d)) / (b + d);
const esHomeInv = (c, b, a, d, q) =>
    (c * d + a * b + q * (b + d)) / (b + d);
const mdRoWInv = (m0, m1, q) => (m0 - q) / m1;
const xsRoWInv = (m0, m1, q) => (m0 + q) / m1;

// World market equilibrium
const pWorld = (c, b, a, d, m0, m1) =>
    (c / b + a / d + m0) / (1 / b + 1 / d + m1);
const tradeQty = (c, b, a, d, m0, m1) =>
    edHome(c, b, a, d, pWorld(c, b, a, d, m0, m1));

// Domestic quantities at price
// const eqd = (c, b, p) => qd(c, b, p);
// const eqs = (a, d, p) => qs(a, d, p);

// Autarky Prices
const pAutHome = (c, b, a, d) => (a * b + c * d) / (b + d);
const pAutForeign = (m0, m1) => m0 / m1;


export class InternationalTradeLargeEconomyGraph extends InternationalTradeSmallEconomyGraph {
    static pwLabel = '<math><msubsup><mo>P</mo><mn>W</mn></msubsup></math>';
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4, gA5, gA6) {
        const opt = this.options;
        let lineItems = [];

        const pw = pWorld(opt.gA1, opt.gA2, opt.gA3, opt.gA4, opt.gA5, opt.gA6);
        const qdAtPW = qd(opt.gA1, opt.gA2, pw);
        const qsAtPW = qs(opt.gA3, opt.gA4, pw);
        const qTrade = tradeQty(opt.gA1, opt.gA2, opt.gA3, opt.gA4, opt.gA5, opt.gA6);
        const pH = pAutHome(opt.gA1, opt.gA2, opt.gA3, opt.gA4);
        const pF = pAutForeign(opt.gA5, opt.gA6);

        const epointd2 = [qd(opt.gA1, opt.gA2, pw), pw];
        const epoints2 = [qs(opt.gA3, opt.gA4, pw), pw];
        const epointdline2 = [[qd(opt.gA1, opt.gA2, pw), 0], [qd(opt.gA1, opt.gA2, pw), pw]];
        const epointsline2 = [[qs(opt.gA3, opt.gA4, pw), 0], [qs(opt.gA3, opt.gA4, pw), pw]];
        const tradeline = [[qd(opt.gA1, opt.gA2, pw), pw], [qs(opt.gA3, opt.gA4, pw), pw]];
        


        if (gFunctionChoice === 0) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, ' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: qdAtPW.toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel,
                    color: 'red',
                    value: qsAtPW.toFixed(2)
                },
                {
                    label: 'Domestic Trade Balance, ' +
                        InternationalTradeSmallEconomyGraph.qshLabel + '-' +
                        InternationalTradeSmallEconomyGraph.qdhLabel,
                    color: 'red',
                    value: (qsAtPW - qdAtPW).toFixed(2)
                },
                {
                    label: 'Global Price, ' +
                        InternationalTradeLargeEconomyGraph.pwLabel,
                    color: 'red',
                    value: pw.toFixed(2)
                },
            ];
        // } else if (gFunctionChoice === 1) {
        //     lineItems = [
        //         {
        //             label: 'Domestic Quantity Bought, ' +
        //                 InternationalTradeSmallEconomyGraph.qdhLabel,
        //             color: 'red',
        //             value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Quantity Produced, ' +
        //                 InternationalTradeSmallEconomyGraph.qshLabel,
        //             color: 'red',
        //             value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Trade Balance, ' +
        //                 InternationalTradeSmallEconomyGraph.qshLabel + '-' +
        //                 InternationalTradeSmallEconomyGraph.qdhLabel,
        //             color: 'red',
        //             value: (
        //                 eqd(gA1, gA2, gA3, gA4, gA5) -
        //                     eqs(gA1, gA2, gA3, gA4, gA5)
        //             ).toFixed(2)
        //         },
        //         {
        //             label: 'Consumer Surplus CS',
        //             color: 'blue',
        //             value: csw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Producer Surplus PS',
        //             color: 'orange',
        //             value: psw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Total Surplus TS',
        //             color: 'red',
        //             value: tsw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         }
        //     ];
        // } else if (gFunctionChoice === 2) {
        //     lineItems = [
        //         {
        //             label: 'Domestic Quantity Bought, ' +
        //                 InternationalTradeSmallEconomyGraph.qdhLabel,
        //             color: 'red',
        //             value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Quantity Produced, ' +
        //                 InternationalTradeSmallEconomyGraph.qshLabel,
        //             color: 'red',
        //             value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Trade Balance, ' +
        //                 InternationalTradeSmallEconomyGraph.qshLabel + '-' +
        //                 InternationalTradeSmallEconomyGraph.qdhLabel,
        //             color: 'red',
        //             value: (
        //                 eqd(gA1, gA2, gA3, gA4, gA5) -
        //                     eqs(gA1, gA2, gA3, gA4, gA5)
        //             ).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Price, <math><msubsup><mo>P</mo><mn>H</mn><mn>t</mn></msubsup></math>',
        //             color: 'red',
        //             value: (gA5 + gA6).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Tariff Revenue',
        //             color: 'red',
        //             value: (
        //                 -gA6 * (eqst(gA1, gA2, gA3, gA4, gA5, gA6) -
        //                         eqdt(gA1, gA2, gA3, gA4, gA5, gA6))
        //             ).toFixed(2)
        //         }
        //     ];
        // } else if (gFunctionChoice === 3) {
        //     lineItems = [
        //         {
        //             label: 'Domestic Quantity Bought, ' +
        //                 InternationalTradeSmallEconomyGraph.qdhLabel,
        //             color: 'red',
        //             value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Quantity Produced, ' +
        //                 InternationalTradeSmallEconomyGraph.qshLabel,
        //             color: 'red',
        //             value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Trade Balance, ' +
        //                 InternationalTradeSmallEconomyGraph.qshLabel + '-' +
        //                 InternationalTradeSmallEconomyGraph.qdhLabel,
        //             color: 'red',
        //             value: (
        //                 eqd(gA1, gA2, gA3, gA4, gA5) -
        //                     eqs(gA1, gA2, gA3, gA4, gA5)
        //             ).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Price, <math><msubsup><mo>P</mo><mn>H</mn><mn>t</mn></msubsup></math>',
        //             color: 'red',
        //             value: (gA5 + gA6).toFixed(2)
        //         },
        //         {
        //             label: 'Consumer Surplus CS',
        //             color: 'blue',
        //             value: csw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Producer Surplus PS',
        //             color: 'orange',
        //             value: psw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Domestic Tariff Revenue',
        //             color: 'red',
        //             value: (
        //                 -gA6 * (eqst(gA1, gA2, gA3, gA4, gA5, gA6) -
        //                         eqdt(gA1, gA2, gA3, gA4, gA5, gA6))
        //             ).toFixed(2)
        //         },
        //         {
        //             label: 'Total Surplus TS',
        //             color: 'red',
        //             value: tsw(gA1, gA2, gA3, gA4, gA5).toFixed(2)
        //         },
        //         {
        //             label: 'Deadweight Loss DWL',
        //             color: 'red',
        //             value: dwl(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
        //         }
        //     ];
        }

        return lineItems;
    }
}

const A = (c, b, a, d) => (c * d + a * b) / (b + d);

const tradeQtyT = (c, b, a, d, m0, m1, t) => (m1 / (m1 + 1)) * (A(c, b, a, d) - m0 / m1 - t);

const pHt = (c, b, a, d, m0, m1, t) => (A(c, b, a, d) + m0 + m1 * t) / (m1 + 1);

const pFt = (c, b, a, d, m0, m1, t) => (A(c, b, a, d) + m0 - t) / (m1 + 1);


export class InternationalTradeLargeEconomyGlobalGraph extends Graph {
    make() {
        const me = this;        

        const pwt = pHt(me.options.gA1, me.options.gA2, me.options.gA3,
            me.options.gA4, me.options.gA5, me.options.gA6, me.options.gA7);

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

        const epointd2t = [qd(me.options.gA1, me.options.gA2, pwt), pwt];
        const epoints2t = [qs(me.options.gA3, me.options.gA4, pwt), pwt];

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
