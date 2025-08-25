import { Graph, positiveRange } from './Graph.js';
import { drawPolygon } from '../jsxgraphUtils.js';

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

const ep = function(c, b, a, d) {
    return (a * b + c * d) / (b + d);
};

const eq = function(c, b, a, d) {
    return (-a + c) / (b + d);
};

const csm = function(c, b, a, d) {
    return (c - epm(c, b, a, d)) * eqm(c, b, a, d) / 2;
};

const psm = function(c, b, a, d) {
    return (mc(a, d, eqm(c, b, a, d)) - a) * eqm(c, b, a, d) / 2 +
        (epm(c, b, a, d) - mc(a, d, eqm(c, b, a, d))) *
        eqm(c, b, a, d);
};

const tsm = function(c, b, a, d) {
    return csm(c, b, a, d) + psm(c, b, a, d);
};

const dwlm = function(c, b, a, d) {
    return (epm(c, b, a, d) - mc(a, d, eqm(c, b, a, d))) * (
        eq(c, b, a, d) - eqm(c, b, a, d)
    ) / 2;
};

export class MonopolyUniformPricingGraph extends Graph {
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4) {
        if (gFunctionChoice === 0) {
            return [
                {
                    label: 'Monopoly Quantity Q*<sub>M</sub>',
                    color: 'red',
                    value: eqm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Monopoly Price P*<sub>M</sub>',
                    color: 'red',
                    value: epm(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 1) {
            return [
                {
                    label: 'Competitive Quantity Q*',
                    color: 'gray',
                    value: eq(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Competitive Price P*',
                    color: 'gray',
                    value: ep(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Monopoly Quantity Q*<sub>M</sub>',
                    color: 'red',
                    value: eqm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Monopoly Price Q*<sub>M</sub>',
                    color: 'red',
                    value: epm(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 2) {
            return [
                {
                    label: 'Equilibrium Quantity Q*<sub>M</sub>',
                    color: 'red',
                    value: eqm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Equilibrium Price Q*<sub>M</sub>',
                    color: 'red',
                    value: epm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: csm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: psm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Total Surplus PS',
                    color: 'black',
                    value: tsm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Deadweight Loss DWL',
                    color: 'red',
                    value: dwlm(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        }

        return [];
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

        const epoint = [
            eqm(this.options.gA1, this.options.gA2,
                this.options.gA3, this.options.gA4),
            epm(this.options.gA1, this.options.gA2,
                this.options.gA3, this.options.gA4)
        ];

        if (this.options.gFunctionChoice === 2) {
            // Show lightly shaded areas
            const mr0 = mr(me.options.gA1, me.options.gA2, 0);
            drawPolygon(this.board, [
                [0, epoint[1]], epoint, [0, mr0]
            ], null, 'lightblue');

            const mc0 = mc(me.options.gA3, me.options.gA4, 0);
            const inter13 = this.board.create(
                'intersection', [this.l1, this.l3, 0], {
                    visible: false
                });
            drawPolygon(this.board, [
                [0, epoint[1]], epoint, inter13, [0, mc0]
            ], null, 'orange');

            const inter23 = this.board.create(
                'intersection', [this.l2, this.l3, 0], {
                    visible: false
                });
            drawPolygon(this.board, [
                epoint, inter13, inter23
            ], null, 'red');
        }

        if (this.options.gShowIntersection) {
            let pointLabel = 'E';
            let horizPointLabel = 'P<sup>*</sup><sub>M</sub>';
            let vertPointLabel = 'Q<sup>*</sup><sub>f</sub>';

            if (this.options.gFunctionChoice !== 0) {
                pointLabel = 'E<sub>M</sub>';
                vertPointLabel = 'Q<sup>*</sup><sub>M</sub>';
            }

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
                false, pointLabel, horizPointLabel, vertPointLabel,
                false, false);

            if (this.options.gFunctionChoice === 1) {
                this.showIntersection(
                    this.l2, this.l3,
                    false, 'E', 'P<sup>*</sup>', 'Q<sup>*</sup>',
                    false, false, 'grey');
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
