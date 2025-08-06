import { Graph, getIntersectionPointOptions, positiveRange } from './Graph.js';

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

/*const mr = function(c, b, q) {
    return c - 2 * b * q;
};*/

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

const psm = function(c, b, a, d) {
    return (c - a) * eqm(c, b, a, d) / 2;
};

export class MonopolyFirstDegreePriceDiscriminationGraph extends Graph {
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4) {
        if (gFunctionChoice === 0) {
            return [
                {
                    label: 'Quantity Q<sup>*</sup><sub>F</sub>',
                    color: 'red',
                    value: eqm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Prices',
                    color: 'red',
                    value: epm(gA1, gA2, gA3, gA4).toFixed(2) + ' to ' + gA1
                }
            ];
        } else if (gFunctionChoice === 1) {
            return [
                {
                    label: 'Perf. Competitive Quantity Q<sup>*</sup>',
                    color: 'gray',
                    value: eq(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Perf. Competitive Price P<sup>*</sup>',
                    color: 'gray',
                    value: ep(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Monopoly Quantity Q<sup>*</sup><sub>F</sub>',
                    color: 'red',
                    value: eqm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: '1<sup>st</sup>-Degree Price-Discr. Prices',
                    color: 'red',
                    value: epm(gA1, gA2, gA3, gA4).toFixed(2) + ' to ' + gA1
                }
            ];
        } else if (gFunctionChoice === 2) {
            return [
                {
                    label: 'Quantity: Q<sup>*</sup><sub>F</sub>',
                    color: 'red',
                    value: eqm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Prices',
                    color: 'red',
                    value: epm(gA1, gA2, gA3, gA4).toFixed(2) + ' to ' + gA1
                },
                {
                    label: 'Consumer Surplus CS',
                    color: 'blue',
                    value: 0
                },
                {
                    label: 'Producer Surplus PS',
                    color: 'orange',
                    value: psm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Total Surplus TS',
                    color: 'black',
                    value: psm(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Deadweight Loss DWL',
                    color: 'red',
                    value: 0
                }
            ];
        }

        return [];
    }

    /**
     * Set up intersection display for l1 and l2.
     *
     * i is the intersection, and p1 and p2 are its X and Y
     * intercepts.
     */
    showIntersection(
        l1, l2, isShadow=false, label, horizLabel, vertLabel,
        extendVertLine=false, extendHorizLine=false, color='red'
    ) {
        if (label === null || typeof label === 'undefined') {
            label = this.options.gIntersectionLabel;
        }
        if (horizLabel === null || typeof horizLabel === 'undefined') {
            horizLabel = this.options.gIntersectionHorizLineLabel;
        }
        if (vertLabel === null || typeof vertLabel === 'undefined') {
            vertLabel = this.options.gIntersectionVertLineLabel;
        }

        let i = this.board.create(
            'intersection', [l1, l2, 0],
            getIntersectionPointOptions(label, isShadow, color)
        );

        let i3 = i;
        if (extendHorizLine) {
            i3 = [10, i.Y()];
        }

        let p1 = this.board.create('point', [0, this.options.gA1], {
            size: 0,
            name: horizLabel || '',
            withLabel: !isShadow,
            label: {
                strokeColor: color
            },
            fixed: true,
            highlight: false,
            showInfobox: false
        });
        this.board.create('line', [p1, i3], {
            dash: 1,
            highlight: false,
            strokeColor: color,
            strokeWidth: isShadow ? 0.5 : 1,
            straightFirst: false,
            straightLast: false,
            layer: 4
        });

        let p2 = this.board.create('point', [i.X(), 0], {
            size: 0,
            name: vertLabel || '',
            withLabel: !isShadow,
            label: {
                strokeColor: color
            },
            fixed: true,
            highlight: false,
            showInfobox: false
        });

        let i2 = i;
        if (extendVertLine) {
            i2 = [i.X(), 10];
        }

        this.board.create('line', [p2, i2], {
            dash: 1,
            highlight: false,
            strokeColor: color,
            strokeWidth: isShadow ? 0.5 : 1,
            straightFirst: false,
            straightLast: false,
            layer: 4
        });

        if (!isShadow) {
            // Keep the dashed intersection lines perpendicular to the axes.
            const me = this;
            l1.on('up', function() {
                me.updateIntersection(i, p1, p2);
            });
            l1.on('drag', function() {
                me.updateIntersection(i, p1, p2);
            });
            l2.on('up', function() {
                me.updateIntersection(i, p1, p2);
            });
            l2.on('drag', function() {
                me.updateIntersection(i, p1, p2);
            });
        }

        return i;
    }

    make() {
        const me = this;

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

        this.l1 = this.board.create(
            'functiongraph',
            [positiveRange(mcLine), 0, this.options.gXAxisMax], {
                name: 'Marginal Cost',
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

        if (this.options.gShowIntersection) {
            const epoint = [
                eqm(this.options.gA1, this.options.gA2, this.options.gA3, this.options.gA4),
                epm(this.options.gA1, this.options.gA2, this.options.gA3, this.options.gA4)
            ];

            this.showIntersection(
                this.board.create('line', [
                    [0, this.options.gA1],
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
                false, 'E<sub>F</sub>', 'E<sub>F</sub>Prices', 'Q<sup>*</sup><sub>F</sub>',
                false, false);
        }
    }
}

export const mkMonopolyFirstDegreePriceDiscrimination = function(
    board, options
) {
    let g = new MonopolyFirstDegreePriceDiscriminationGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
