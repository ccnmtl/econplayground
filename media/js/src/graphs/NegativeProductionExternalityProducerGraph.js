import {Graph, positiveRange} from './Graph.js';

export const defaults = [
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 500,
        gA3: 2,
        gA4: 50,
        gA5: 2
    }
];

// Marginal Benefit
const mb = function(a) {
    return a;
};

const mc = function(c, d, q) {
    return c + d * q;
};

// External Marginal Cost
const emc = function(f, g, q) {
    return f + g * q;
};

/*const pemc = function(f, g, p) {
    return (p - f) / g;
};*/


// Social Marginal Cost
const smc = function(c, d, f, g, q) {
    return mc(c, d, q) + emc(f, g, q);
};

/*const psmc = function(c, d, f, g, p) {
    return (p - c - f) / (d + g);
};*/

export class NegativeProductionExternalityProducerGraph extends Graph {
    static getGraphPane(gFunctionChoice) {
        return [
            {
                label: 'Unregulated Output q*',
                color: 'red',
                value: 500
            },
            {
                label: 'Socially Desirable Output q<sup>soc</sup>',
                color: 'orange',
                value: 247.5
            },
            {
                label: 'Market Price P*',
                color: 'red',
                value: 1500
            },
        ];
    }
    make() {
        const me = this;

        const mbLine = function() {
            return mb(me.options.gA1);
        };

        this.l2 = this.board.create(
            'functiongraph',
            [positiveRange(mbLine), 0, this.options.gXAxisMax], {
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

        const mcLine = function(x) {
            return mc(me.options.gA2, me.options.gA3, x);
        };

        this.l1 = this.board.create(
            'functiongraph',
            [positiveRange(mcLine), 0, this.options.gXAxisMax], {
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

        const emcLine = function(x) {
            return emc(me.options.gA4, me.options.gA5, x);
        };

        this.l3 = this.board.create(
            'functiongraph',
            [positiveRange(emcLine), 0, this.options.gXAxisMax], {
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

        const smcLine = function(x) {
            return smc(
                me.options.gA2, me.options.gA3,
                me.options.gA4, me.options.gA5, x);
        };

        this.l4 = this.board.create(
            'functiongraph',
            [positiveRange(smcLine), 0, this.options.gXAxisMax], {
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

export const mkNegativeProductionExternalityProducer = function(board, options) {
    let g = new NegativeProductionExternalityProducerGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
