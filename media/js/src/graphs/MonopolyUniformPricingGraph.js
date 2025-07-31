import { Graph, positiveRange } from './Graph.js';
import { drawPolygon } from '../jsxgraphUtils.js';

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

const sq3 = function(a, b, c, d, f, g) {
    return (a - c + f) / (b + d + g);
};

const sp3 = function(a, b, c, d, f, g) {
    return smb3(a, b, f, g, sq3(a, b, c, d, f, g));
};

const spoint3 = function(a, b, c, d, f, g) {
    return [sq3(a, b, c, d, f, g), sp3(a, b, c, d, f, g)];
};

const shint3 = function(a, b, c, d, f, g) {
    return [0, sp3(a, b, c, d, f, g)];
};

const svint3 = function(a, b, c, d, f, g) {
    return [sq3(a, b, c, d, f, g), 0];
};

const ep3 = function(a, b, c, d) {
    return (b * c + a * d) / (b + d);
};

const eq3 = function(a, b, c, d) {
    return (a - c) / (b + d);
};

const embmarket3 = function(a, b, c, d, f, g) {
    return f - g * eq3(a, b, c, d);
};

const epoint3 = function(a, b, c, d) {
    return [eq3(a, b, c, d), ep3(a, b, c, d)];
};

const ehint3 = function(a, b, c, d) {
    return [0, ep3(a, b, c, d)];
};

const evint3 = function(a, b, c, d) {
    return [eq3(a, b, c, d), 0];
};

const embsocial3 = function(a, b, c, d, f, g) {
    return f - g * sq3(a, b, c, d, f, g);
};

const extgain3 = function(a, b, c, d, f, g) {
    return (sq3(a, b, c, d, f, g) - eq3(a, b, c, d)) *
        embsocial3(a, b, c, d, f, g) +
        (sq3(a, b, c, d, f, g) - eq3(a, b, c, d)) *
        (embmarket3(a, b, c, d, f, g) - embsocial3(a, b, c, d, f, g)) / 2;
};

const extgainarea3 = function(a, b, c, d, f, g) {
    return [
        [eq3(a, b, c, d), embmarket3(a, b, c, d, f, g)],
        [eq3(a, b, c, d), 0],
        [sq3(a, b, c, d, f, g), 0],
        [sq3(a, b, c, d, f, g), embsocial3(a, b, c, d, f, g)]
    ];
};

const extben3 = function(a, b, c, d, f, g) {
    return embmarket3(a, b, c, d, f, g) * eq3(a, b, c, d) +
        (f - embmarket3(a, b, c, d, f, g)) * eq3(a, b, c, d) / 2;
};

const mcsocial3 = function(a, b, c, d, f, g) {
    return c + d * sq3(a, b, c, d, f, g);
};

const mbsocial3 = function(a, b, c, d, f, g) {
    return a - b * sq3(a, b, c, d, f, g);
};

const marketloss3 = function(a, b, c, d, f, g) {
    return (sq3(a, b, c, d, f, g) - eq3(a, b, c, d)) *
        (mcsocial3(a, b, c, d, f, g) - mbsocial3(a, b, c, d, f, g)) / 2;
};

const marketlossarea3 = function(a, b, c, d, f, g) {
    return [
        [eq3(a, b, c, d), ep3(a, b, c, d)],
        [sq3(a, b, c, d, f, g), mcsocial3(a, b, c, d, f, g)],
        [sq3(a, b, c, d, f, g), mbsocial3(a, b, c, d, f, g)]
    ];
};

export class MonopolyUniformPricingGraph extends Graph {
    static getGraphPane(gFunctionChoice, gA1, gA2, gA3, gA4, gA5, gA6) {
        if (gFunctionChoice === 0) {
            return [
                {
                    label: 'Unregulated Output Q*',
                    color: 'red',
                    value: eq3(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Unregulated Price P*',
                    color: 'red',
                    value: ep3(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Socially Desirable Output q<sup>soc</sup>',
                    color: 'orange',
                    value: sq3(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                },
                {
                    label: 'Socially Desirable Price P<sup>soc</sup>',
                    color: 'orange',
                    value: sp3(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                },
            ];
        } else if (gFunctionChoice === 1) {
            return [
                {
                    label: 'Unregulated Output Q*',
                    color: 'red',
                    value: eq3(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'P*',
                    color: 'red',
                    value: eq3(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'External Total Benefit',
                    color: 'green',
                    value: ep3(gA1, gA2, gA3, gA4).toFixed(2)
                }
            ];
        } else if (gFunctionChoice === 2) {
            return [
                {
                    label: 'Unregulated Output Q*',
                    color: 'red',
                    value: eq3(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Unregulated Price P*',
                    color: 'red',
                    value: ep3(gA1, gA2, gA3, gA4).toFixed(2)
                },
                {
                    label: 'Socially Desirable Output Q<sup>soc</sup>',
                    color: 'orange',
                    value: sq3(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                },
                {
                    label: 'Socially Desirable Price P<sup>soc</sup>',
                    color: 'orange',
                    value: sp3(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                },
                {
                    label: 'External Total Benefit',
                    color: 'green',
                    value: extben3(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                },
                {
                    label: 'External Gain',
                    color: 'green',
                    value: extgain3(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                },
                {
                    label: 'Market Loss',
                    color: 'red',
                    value: marketloss3(gA1, gA2, gA3, gA4, gA5, gA6).toFixed(2)
                }
            ];
        }
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

        if (this.options.gFunctionChoice !== 1) {
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

        if (this.options.gShowIntersection) {
            const spointEvaluated = spoint3(
                this.options.gA1, this.options.gA2, this.options.gA3,
                this.options.gA4, this.options.gA5, this.options.gA6);

            if (this.options.gFunctionChoice !== 1) {
                this.showIntersection(
                    this.board.create('line', [
                        shint3(
                            this.options.gA1, this.options.gA2, this.options.gA3,
                            this.options.gA4, this.options.gA5, this.options.gA6),
                        spointEvaluated
                    ], {
                        visible: false
                    }),
                    this.board.create('line', [
                        svint3(
                            this.options.gA1, this.options.gA2, this.options.gA3,
                            this.options.gA4, this.options.gA5, this.options.gA6),
                        spointEvaluated
                    ], {
                        visible: false
                    }),
                    false, 'Social', null, 'Q<sup>soc</sup>',
                    false, false, this.l1Color);
            }

            const epointEvaluated = epoint3(
                this.options.gA1, this.options.gA2, this.options.gA3,
                this.options.gA4);

            this.showIntersection(
                this.board.create('line', [
                    ehint3(
                        this.options.gA1, this.options.gA2, this.options.gA3,
                        this.options.gA4),
                    epointEvaluated
                ], {
                    visible: false
                }),
                this.board.create('line', [
                    evint3(
                        this.options.gA1, this.options.gA2, this.options.gA3,
                        this.options.gA4),
                    epointEvaluated
                ], {
                    visible: false
                }),
                false, 'Market', null, 'Q',
                false, false, this.l4Color);
        }

        if (this.options.gFunctionChoice >= 1) {
            const eq3Evaluated = eq3(
                this.options.gA1, this.options.gA2,
                this.options.gA3, this.options.gA4);
            drawPolygon(
                this.board, [
                    [eq3Evaluated, embmarket3(
                        this.options.gA1, this.options.gA2,
                        this.options.gA3, this.options.gA4,
                        this.options.gA5, this.options.gA6
                    )],
                    [eq3Evaluated, 0],
                    [0, 0],
                    [0, this.options.gA5]
                ], null, 'lightgreen'
            );
        }

        if (this.options.gFunctionChoice === 2) {
            drawPolygon(
                this.board, extgainarea3(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5, this.options.gA6
                ), null, 'green'
            );

            drawPolygon(
                this.board, marketlossarea3(
                    this.options.gA1, this.options.gA2,
                    this.options.gA3, this.options.gA4,
                    this.options.gA5, this.options.gA6
                ), null, 'red'
            );
        }
    }
}

export const mkMonopolyUniformPricing = function(board, options) {
    let g = new MonopolyUniformPricingGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
