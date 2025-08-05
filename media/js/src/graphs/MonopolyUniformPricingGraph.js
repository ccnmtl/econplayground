import { Graph, positiveRange } from './Graph.js';

export const defaults = [
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2
    },
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2
    },
];

/*const dq = function(c, b, p) {
    return c / b - p / b;
};*/

const dp = function(c, b, q) {
    return c - b * q;
};

const mr = function(c, b, q) {
    return c - 2 * b * q;
};

const mc = function(a, d, q) {
    return a + d * q;
};

/*const sp = function(a, d, q) {
    return a + d * q;
};

const sq = function(a, d, p) {
    return -(a / d) + p / d;
};*/

const eqm = function(c, b, a, d) {
    return (-a + c) / (2 * b + d);
};

const epm = function(c, b, a, d) {
    return dp(c, b, eqm(c, b, a, d));
};

export class MonopolyUniformPricingGraph extends Graph {
    static getGraphPane(gFunctionChoice) {
        if (gFunctionChoice === 0) {
            return [
                {
                    label: 'Monopoly Quantity Q*',
                    color: 'red',
                    value: 0
                },
                {
                    label: 'Monopoly Price Q*',
                    color: 'red',
                    value: 0
                }
            ];
        }
    }

    make() {
        const me = this;

        const mrLine = function(x) {
            return mr(me.options.gA1, me.options.gA2, x)
        };

        this.l1 = this.board.create(
            'functiongraph',
            [positiveRange(mrLine), 0, this.options.gXAxisMax], {
                name: 'Marginal Revenue',
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

        const dpLine = function(x) {
            return dp(me.options.gA1, me.options.gA2, x)
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

        const mcLine = function(x) {
            return mc(me.options.gA3, me.options.gA4, x)
        };

        this.l3 = this.board.create(
            'functiongraph',
            [positiveRange(mcLine), 0, this.options.gXAxisMax], {
                name: 'Marginal Cost',
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

        if (this.options.gShowIntersection) {
            const epoint = [
                eqm(this.options.gA1, this.options.gA2, this.options.gA3, this.options.gA4),
                epm(this.options.gA1, this.options.gA2, this.options.gA3, this.options.gA4)
            ];

            if (this.options.gFunctionChoice !== 1) {
                this.showIntersection(
                    this.board.create('line', [
                        [0, epoint[1]],
                        epoint
                    ], {
                        visible: false
                    }),
                    this.board.create('line', [
                        [epoint[0], 0],
                        epoint
                    ], {
                        visible: false
                    }),
                    false, 'E', null, 'Q<sup>soc</sup>',
                    false, false);
            }
        }
    }
}

export const mkMonopolyUniformPricing = function(board, options) {
    let g = new MonopolyUniformPricingGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
