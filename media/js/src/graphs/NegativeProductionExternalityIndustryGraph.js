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

const mc2 = function(c, d, q) {
    return c + d * q;
};

/*const pmc2 = function(c, d, p) {
    return (p - c) / d;
};*/

const emc2 = function(f, g, q) {
    return f + g * q;
};

/*const pemc2 = function(f, g, p) {
    return (p - f) / g;
};*/

const smc2 = function(c, d, f, g, q) {
    return mc2(c, d, q) + emc2(f, g, q);
};

/*const psmc2 = function(c, d, f, g, p) {
    return (p - c - f) / (d + g);
};*/

const ep2 = function(a, b, c, d) {
    return (b * c + a * d) / (b + d);
};

const eq2 = function(a, b, c, d) {
    return (a - c) / (b + d);
};

const psurplus2 = function(a, b, c, d) {
    return (ep2(a, b, c, d) - c) * eq2(a, b, c, d) / 2;
};

const emcmarket2 = function(a, b, c, d, f, g) {
    return f + g * eq2(a, b, c, d);
};

const extcost2 = function(a, b, c, d, f, g) {
    return emcmarket2(a, b, c, d, f, g) * eq2(a, b, c, d) / 2;
};


export class NegativeProductionExternalityIndustryGraph extends Graph {
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4, gA5, gA6) {
        return [
            {
                label: 'Unregulated Output Q*',
                color: 'red',
                value: eq2(gA1, gA2, gA3, gA4).toFixed(2)
            },
            {
                label: 'Producer Surplus PS',
                color: 'orange',
                value: psurplus2(gA1, gA2, gA3, gA4).toFixed(2)
            },
            {
                label: 'External Total Cost',
                color: 'red',
                value: extcost2(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
            },
            {
                label: 'P*',
                color: 'red',
                value: ep2(gA1, gA2, gA3, gA4).toFixed(2)
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

        const mc2Line = function(x) {
            return mc2(me.options.gA3, me.options.gA4, x);
        };

        this.l1 = this.board.create(
            'functiongraph',
            [positiveRange(mc2Line), 0, this.options.gXAxisMax], {
                name: 'MC',
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

        const emc2Line = function(x) {
            return emc2(me.options.gA5, me.options.gA6, x);
        };

        this.l3 = this.board.create(
            'functiongraph',
            [positiveRange(emc2Line), 0, this.options.gXAxisMax], {
                name: 'EMC',
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

        const smc2Line = function(x) {
            return smc2(
                me.options.gA3, me.options.gA4,
                me.options.gA5, me.options.gA6, x);
        };

        this.l4 = this.board.create(
            'functiongraph',
            [positiveRange(smc2Line), 0, this.options.gXAxisMax], {
                name: 'SMC',
                withLabel: true,
                label: {
                    strokeColor: this.l4Color
                },
                strokeWidth: 2,
                strokeColor: this.l4Color,
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
