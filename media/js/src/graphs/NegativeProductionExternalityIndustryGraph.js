import { Graph, positiveRange } from './Graph.js';

export const defaults = [
    {
        gXAxisMax: 1000,
        gYAxisMax: 350,
        gA1: 150,
        gA2: 0.125,
        gA3: 0,
        gA4: 0.25,
        gA5: 0,
        gA6: 0.125
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 350,
        gA1: 150,
        gA2: 0.125,
        gA3: 0,
        gA4: 0.25,
        gA5: 0,
        gA6: 0.125
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 350,
        gA1: 150,
        gA2: 0.125,
        gA3: 0,
        gA4: 0.25,
        gA5: 0,
        gA6: 0.125
    },
];

const mb2 = function(a, b, q) {
    return a - b * q;
};

/*const pmb2 = function(a, b, p) {
    return (a - p) / b;
};*/

/*const mc2 = function(c, d, q) {
    return c + d * q;
};*/

/*const pmc2 = function(c, d, p) {
    return (p - c) / d;
};*/

/*const emc2 = function(f, g, q) {
    return f + g * q;
};*/

/*const pemc2 = function(f, g, p) {
    return (p - f) / g;
};*/

/*const smc2 = function(c, d, f, g, q) {
    return mc2(c, d, q) + emc2(f, g, q);
};

const psmc2 = function(c, d, f, g, p) {
    return (p - c - f) / (d + g);
};

const ep2 = function(a, b, c, d) {
    return (b * c + a * d) / (b + d);
};

const eq2 = function(a, b, c, d) {
    return (a - c) / (b + d);
};*/

export class NegativeProductionExternalityIndustryGraph extends Graph {
    static getGraphPane(gFunctionChoice) {
        return [
            {
                label: 'Unregulated Output Q*',
                color: 'red',
                value: 400
            },
            {
                label: 'Unregulated Price P*',
                color: 'red',
                value: 100
            },
            {
                label: 'Socially Desirable Output q<sup>soc</sup>',
                color: 'orange',
                value: 300
            },
            {
                label: 'Socially Desirable Price P<sup>soc</sup>',
                color: 'orange',
                value: 112.5
            },
        ];
    }

    make() {
        const me = this;

        const mb2Line = function(x) {
            return mb2(me.options.gA1, me.options.gA2, x);
        };

        this.l2 = this.board.create(
            'functiongraph',
            [positiveRange(mb2Line), 0, this.options.gXAxisMax], {
                name: 'MB',
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

export const mkNegativeProductionExternalityIndustry = function(board, options) {
    let g = new NegativeProductionExternalityIndustryGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
