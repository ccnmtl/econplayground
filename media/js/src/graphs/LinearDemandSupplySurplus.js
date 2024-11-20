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
    // Quantity Controls
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
        } else if (gFunctionChoice === 2) {
            const eqdVal = eqd(gA1, gA2, gA3, gA4, gA5);
            const eqsVal = eqs(gA1, gA2, gA3, gA4, gA5);

            lineItems = [
                {
                    label: 'Domestic Quantity Bought',
                    color: 'red',
                    value: eqdVal.toFixed(2)
                },
                {
                    label: 'Domestic Quantity Produced',
                    color: 'red',
                    value: eqsVal.toFixed(2)
                },
                {
                    label: 'International Trade',
                    color: 'red',
                    value: (eqsVal - eqdVal).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 3) {
            lineItems = [
                {
                    label: 'Traded Quantity',
                    color: 'red',
                    value: null
                },
                {
                    label: 'Quantity Supplied',
                    color: 'red',
                    value: null
                },
                {
                    label: 'Surplus',
                    color: 'red',
                    value: null
                }
            ];
        } else if (gFunctionChoice === 4) {
            lineItems = [
                {
                    label: 'Traded Quantity',
                    color: 'red',
                    value: null
                },
                {
                    label: 'Market Price',
                    color: 'red',
                    value: null
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
            this.options.gFunctionChoice === 2 ||
                this.options.gFunctionChoice === 3
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

            if (this.options.gFunctionChoice === 3) {
                this.l4 = this.board.create(
                    'functiongraph',
                    [positiveRange(() => {
                        return me.options.gA6;
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
        } else if (this.options.gFunctionChoice === 4) {
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
        } else if (this.options.gFunctionChoice === 5) {
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
        }

        if (this.options.gShowIntersection) {
            this.showIntersection(
                this.l1, this.l2, false, 'Equilibrium', 'P*', 'Q*');
        }
    }
}

export const mkLinearDemandSupplySurplus = function(board, options) {
    let g = new LinearDemandSupplySurplus(board, options);
    g.make();
    g.postMake();
    return g;
};
