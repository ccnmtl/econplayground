import { Graph, positiveRange } from './Graph.js';

export const defaults = [
    {
        gXAxisMax: 1000,
        gYAxisMax: 350,
        gA1: 150,
        gA2: 0.125,
        gA3: 0,
        gA4: 0.5,
        gA5: 50,
        gA6: 0.125
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 350,
        gA1: 150,
        gA2: 0.125,
        gA3: 0,
        gA4: 0.5,
        gA5: 50,
        gA6: 0.125
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 350,
        gA1: 150,
        gA2: 0.125,
        gA3: 0,
        gA4: 0.5,
        gA5: 50,
        gA6: 0.125
    },
];

const mb3 = function(a, b, q) {
    return a - b * q;
};

/*const pmb3 = function(a, b, p) {
    return (a - p) / b;
};*/

const mc3 = function(c, d, q) {
    return c + d * q;
};

/*const pmc3 = function(c, d, p) {
    return (p - c) / d;
};*/

const emb3 = function(f, g, q) {
    return f - g * q;
};

/*const pemb3 = function(f, g, p) {
    return (f - p) / g;
};*/

const smb3 = function(a, b, f, g, q) {
    return mb3(a, b, q) + emb3(f, g, q);
};

/*const psmb3 = function(a, b, f, g, p) {
    return (p - a - f) / (b + g);
};

const ep3 = function(a, b, c, d) {
    return (b * c + a * d) / (b + d);
};

const eq3 = function(a, b, c, d) {
    return (a - c) / (b + d);
};*/

export class PositiveExternalityIndustryGraph extends Graph {
    static getGraphPane(gFunctionChoice) {
        return [
            {
                label: 'Unregulated Output Q*',
                color: 'red',
                value: 240
            },
            {
                label: 'Unregulated Price P*',
                color: 'red',
                value: 120
            },
            {
                label: 'Socially Desirable Output q<sup>soc</sup>',
                color: 'orange',
                value: 266.667
            },
            {
                label: 'Socially Desirable Price P<sup>soc</sup>',
                color: 'orange',
                value: 133.333
            },
        ];
    }

    make() {
        const me = this;

        const mb3Line = function(x) {
            return mb3(me.options.gA1, me.options.gA2, x);
        };

        this.l2 = this.board.create(
            'functiongraph',
            [positiveRange(mb3Line), 0, this.options.gXAxisMax], {
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

        const mc3Line = function(x) {
            return mc3(me.options.gA3, me.options.gA4, x);
        };

        this.l1 = this.board.create(
            'functiongraph',
            [positiveRange(mc3Line), 0, this.options.gXAxisMax], {
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

        const emb3Line = function(x) {
            return emb3(me.options.gA5, me.options.gA6, x);
        };

        this.l3 = this.board.create(
            'functiongraph',
            [positiveRange(emb3Line), 0, this.options.gXAxisMax], {
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

        const smb3Line = function(x) {
            return smb3(
                me.options.gA1, me.options.gA2,
                me.options.gA5, me.options.gA6, x);
        };

        this.l4 = this.board.create(
            'functiongraph',
            [positiveRange(smb3Line), 0, this.options.gXAxisMax], {
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

export const mkPositiveExternalityIndustry = function(board, options) {
    let g = new PositiveExternalityIndustryGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
