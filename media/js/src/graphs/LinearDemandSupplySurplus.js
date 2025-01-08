import {Graph, positiveRange} from './Graph.js';

// defaults based on function type
export const defaults = [
    // Linear Demand and Supply
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 0,
    },
    // with Welfare Analysis
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 0,
    },
    // Imports and Exports
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
    },
    // with Tariffs
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 0,
    },
    // No Tariffs, with Surplus Distribution
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 0,
    },
    // with Tariffs, with Surplus Distribution
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 500,
        gA6: 0,
    },
    // Minimum Price
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 800,
    },
    // Maximum Price
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 800,
    },
    // Minimum Price, Welfare Analysis
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 800,
    },
    // Maximum Price, Welfare Analysis
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 800,
    },
    // Production Quota
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 350,
    },
    // Production Quota, Welfare Analysis
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
        gA5: 350,
    },
];

const dp = function(c, b, q) {
    return c - b * q;
};

const sp = function(a, d, q) {
    return a + d * q;
};

export const ep = function(c, b, a, d) {
    return (a * b + c * d) / (b + d);
};

export const eq = function(c, b, a, d) {
    return (-a + c) / (b + d);
};

export const cs = function(c, b, a, d) {
    return (c - ep(c, b, a, d)) * eq(c, b, a, d) / 2;
};

export const ps = function(c, b, a, d) {
    return (ep(c, b, a, d) - a) * eq(c, b, a, d) / 2;
};

export const ts = function(c, b, a, d) {
    return cs(c, b, a, d) + ps(c, b, a, d);
};

/* Equilibrium quantity and world market price */
export const eqd = function(c, b, a, d, wp) {
    return (c - wp) / b;
};

export const eqs = function(c, b, a, d, wp) {
    return (-a + wp) / d;
};

const eqdmin = function(c, b, a, d, pmin) {
    return (c - pmin) / b;
};

const eqsmin = function(c, b, a, d, pmin) {
    return (-a + pmin) / d;
};

const eqdmax = function(c, b, a, d, pmax) {
    return (c - pmax) / b;
};

const eqsmax = function(c, b, a, d, pmax) {
    return (-a + pmax) / d;
};

const epsqbar = function(c, b, a, d, qbar) {
    return a + d * qbar;
};

const tariffline = function(wp, t) {
    return wp + t;
};

export class LinearDemandSupplySurplus extends Graph {
    static getRuleOptions() {
        return [
            {
                name: 'Choke Price value',
                value: 'a1'
            },
            {
                name: 'Demand Slope value',
                value: 'a2'
            },
            {
                name: 'Reservation Price value',
                value: 'a3'
            },
            {
                name: 'Supply Slope value',
                value: 'a4'
            }
        ];
    }

    /**
     * Return textual graph pane info, as an array of objects.
     */
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4, gA5) {
        let lineItems = [];

        if (gFunctionChoice === 0 || gFunctionChoice === 1) {
            lineItems = [
                {
                    label: 'Equilibrium Quantity Q*',
                    color: 'red',
                    value: eq(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Equilibrium Price P*',
                    color: 'red',
                    value: ep(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];

            if (gFunctionChoice === 1) {
                lineItems = lineItems.concat([
                    {
                        label: 'Consumer Surplus CS',
                        color: 'blue',
                        value: cs(gA1, gA2, gA3, gA4).toFixed(2)
                    },
                    {
                        label: 'Producer Surplus PS',
                        color: 'orange',
                        value: ps(gA1, gA2, gA3, gA4).toFixed(2)
                    },
                    {
                        label: 'Total Surplus TS',
                        color: 'red',
                        value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                    }
                ]);
            }
        } else if (gFunctionChoice === 2 || gFunctionChoice === 3) {
            const eqdVal = eqd(gA1, gA2, gA3, gA4, gA5);
            const eqsVal = eqs(gA1, gA2, gA3, gA4, gA5);

            lineItems = [
                {
                    label: 'Domestic Quantity Bought, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>S</mn></msubsup></math>',
                    color: 'red',
                    value: eqdVal.toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>S</mn></msubsup></math>',
                    color: 'red',
                    value: eqsVal.toFixed(2)
                },
                {
                    label: 'International Trade, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>s</mn></msubsup> <mo>-</mo> <msubsup><mo>Q</mo><mn>Dom</mn><mn>d</mn></msubsup></math>',
                    color: 'red',
                    value: (eqsVal - eqdVal).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 4) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>D</mn></msubsup></math>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>S</mn></msubsup></math>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'International Trade, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>s</mn></msubsup> <mo>-</mo> <msubsup><mo>Q</mo><mn>Dom</mn><mn>d</mn></msubsup></math>',
                    color: 'red',
                    value: (
                        eqs(gA1, gA2, gA3, gA4, gA5) -
                            eqd(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: cs(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: ps(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Total Surplus TS',
                    color: 'red',
                    value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 5) {
            lineItems = [
                {
                    label: 'Domestic Quantity Bought, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>D</mn></msubsup></math>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>S</mn></msubsup></math>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'International Trade, <math><msubsup><mo>Q</mo><mn>Dom</mn><mn>s</mn></msubsup> <mo>-</mo> <msubsup><mo>Q</mo><mn>Dom</mn><mn>d</mn></msubsup></math>',
                    color: 'red',
                    value: (
                        eqs(gA1, gA2, gA3, gA4, gA5) -
                            eqd(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: cs(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: ps(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Tariff Revenue',
                    color: 'red',
                    value: 299
                },
                {
                    label: 'Total Surplus TS',
                    color: 'red',
                    value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 6) {
            const eqdminVal = eqdmin(gA1, gA2, gA3, gA4, gA5);
            const eqsminVal = eqsmin(gA1, gA2, gA3, gA4, gA5);

            lineItems = [
                {
                    label: 'Traded Quantity, <math><msubsup><mo>Q</mo><mn>D</mn><mn>min</mn></msubsup></math>',
                    color: 'red',
                    value: eqdminVal.toFixed(2)
                },
                {
                    label: 'Desired Quantity Supplied, Q<sub>S</sub>',
                    color: 'red',
                    value: eqsminVal.toFixed(2)
                },
                {
                    label: 'Surplus, Q<sub>S</sub>-Q<sub>D</sub>',
                    color: 'red',
                    value: (eqsminVal - eqdminVal).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 7) {
            const eqdmaxVal = eqdmax(gA1, gA2, gA3, gA4, gA5);
            const eqsmaxVal = eqsmax(gA1, gA2, gA3, gA4, gA5);

            lineItems = [
                {
                    label: 'Traded Quantity, <math><msubsup><mo>Q</mo><mn>S</mn><mn>min</mn></msubsup></math>',
                    color: 'red',
                    value: eqdmaxVal.toFixed(2)
                },
                {
                    label: 'Desired Quantity Demanded, Q<sub>D</sub>',
                    color: 'red',
                    value: eqsmaxVal.toFixed(2)
                },
                {
                    label: 'Shortage, Q<sub>D</sub>-Q<sub>S</sub>',
                    color: 'red',
                    value: (eqsmaxVal - eqdmaxVal).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 8) {
            lineItems = [
                {
                    label: 'Traded Quantity, <math><msubsup><mo>Q</mo><mn>D</mn><mn>min</mn></msubsup></math>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Desired Quantity Supplied, Q<sub>s</sub>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Surplus, Q<sub>S</sub>-Q<sub>D</sub>',
                    color: 'red',
                    value: (
                        eqs(gA1, gA2, gA3, gA4, gA5) -
                            eqd(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: cs(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: ps(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Total Surplus TS',
                    color: 'red',
                    value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Deadweight Loss DWL',
                    color: 'red',
                    value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 9) {
            lineItems = [
                {
                    label: 'Traded Quantity, <math><msubsup><mo>Q</mo><mn>D</mn><mn>min</mn></msubsup></math>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Desired Quantity Supplied, Q<sub>s</sub>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Shortage, Q<sub>D</sub>-Q<sub>S</sub>',
                    color: 'red',
                    value: (
                        eqs(gA1, gA2, gA3, gA4, gA5) -
                            eqd(gA1, gA2, gA3, gA4, gA5)
                    ).toFixed(2)
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: cs(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: ps(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Total Surplus TS',
                    color: 'red',
                    value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Deadweight Loss DWL',
                    color: 'red',
                    value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 10) {
            lineItems = [
                {
                    label: 'Traded Quantity, <math><msubsup><mo>Q</mo><mn>D</mn><mn>quota</mn></msubsup></math>',
                    color: 'red',
                    value: null
                },
                {
                    label: 'Market Price, P<sup>quota</sup>',
                    color: 'red',
                    value: null
                }
            ];
        } else if (gFunctionChoice === 11) {
            lineItems = [
                {
                    label: 'Traded Quantity, <math><msubsup><mo>Q</mo><mn>D</mn><mn>quota</mn></msubsup></math>',
                    color: 'red',
                    value: eqd(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Market Price, P<sup>quota</sup>',
                    color: 'red',
                    value: eqs(gA1, gA2, gA3, gA4, gA5).toFixed(2)
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: cs(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: ps(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Total Surplus TS',
                    color: 'red',
                    value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Deadweight Loss DWL',
                    color: 'red',
                    value: ts(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        }

        return lineItems;
    }

    make() {
        const me = this;

        let demandLine = function(x) {
            return dp(me.options.gA1, me.options.gA2, x);
        };

        let supplyLine = function(x) {
            return sp(me.options.gA3, me.options.gA4, x);
        };

        this.l2 = this.board.create(
            'functiongraph',
            [positiveRange(demandLine), 0, this.options.gXAxisMax], {
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

        this.l1 = this.board.create(
            'functiongraph',
            [positiveRange(supplyLine), 0, this.options.gXAxisMax], {
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

        if (
            this.options.gFunctionChoice === 0 ||
                this.options.gFunctionChoice === 1
        ) {
            if (this.options.gShowIntersection) {
                this.showIntersection(
                    this.l1, this.l2, false, 'Equilibrium', 'P*', 'Q*');
            }
        } else if (
            this.options.gFunctionChoice === 2 ||
                this.options.gFunctionChoice === 3 ||
                this.options.gFunctionChoice === 4 ||
                this.options.gFunctionChoice === 5
        ) {
            this.l3 = this.board.create(
                'functiongraph',
                [positiveRange(() => {
                    return me.options.gA5;
                }), 0, this.options.gXAxisMax], {
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

            if (this.options.gShowIntersection) {
                this.showIntersection(
                    this.l1, this.l3, false,
                    '<math><msubsup><mo>Q</mo><mn>Dom</mn><mn>S</mn></msubsup></math>'
                );
                this.showIntersection(
                    this.l2, this.l3, false,
                    '<math><msubsup><mo>Q</mo><mn>Dom</mn><mn>D</mn></msubsup></math>'
                );
            }

            if (this.options.gFunctionChoice === 3) {
                this.l4 = this.board.create(
                    'functiongraph',
                    [positiveRange(() => {
                        return tariffline(me.options.gA5, me.options.gA6);
                    }), 0, this.options.gXAxisMax], {
                        name: 'Tariff',
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
        } else if (
            this.options.gFunctionChoice === 6 ||
                this.options.gFunctionChoice === 8
        ) {
            this.l3 = this.board.create(
                'functiongraph',
                [positiveRange(() => {
                    return me.options.gA5;
                }), 0, this.options.gXAxisMax], {
                    name: 'Minimum Price',
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
                this.showIntersection(
                    this.l1, this.l3, false,
                    'Q<sub>D</sub>');
                this.showIntersection(
                    this.l2, this.l3, false,
                    'Q<sub>S</sub>');
            }
        } else if (
            this.options.gFunctionChoice === 7 ||
                this.options.gFunctionChoice === 9
        ) {
            this.l3 = this.board.create(
                'functiongraph',
                [positiveRange(() => {
                    return me.options.gA5;
                }), 0, this.options.gXAxisMax], {
                    name: 'Maximum Price',
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
                this.showIntersection(
                    this.l1, this.l3, false,
                    'Q<sub>D</sub>');
                this.showIntersection(
                    this.l2, this.l3, false,
                    'Q<sub>S</sub>');
            }
        } else if (
            this.options.gFunctionChoice === 10 ||
                this.options.gFunctionChoice === 11
        ) {
            this.board.create('line', [
                [0, me.options.gA3],
                [
                    me.options.gA5,
                    epsqbar(
                        me.options.gA1, me.options.gA2, me.options.gA3,
                        me.options.gA4, me.options.gA5)]
            ], {
                straightFirst: false,
                straightLast: false,
                strokeWidth: 2,
                strokeColor: 'red',
                fixed: true,
                highlight: false
            });

            this.board.create('line', [
                [me.options.gA5, epsqbar(
                    me.options.gA1, me.options.gA2, me.options.gA3,
                    me.options.gA4, me.options.gA5)],
                [me.options.gA5, 2500]
            ], {
                name: 'Supply - Quota',
                withLabel: true,
                label: {
                    strokeColor: 'red'
                },
                straightFirst: false,
                straightLast: false,
                strokeWidth: 2,
                strokeColor: 'red',
                fixed: true,
                highlight: false
            });


            if (this.options.gShowIntersection) {
                this.showIntersection(
                    this.l1, this.l2, false, null,
                    'P<sup>quota</sup>',
                    '<math><msubsup><mo>Q</mo><mn>D</mn><mn>quota</mn></msubsup></math>'
                );
            }
        }
    }
}

export const mkLinearDemandSupplySurplus = function(board, options) {
    let g = new LinearDemandSupplySurplus(board, options);
    g.make();
    g.postMake();
    return g;
};
