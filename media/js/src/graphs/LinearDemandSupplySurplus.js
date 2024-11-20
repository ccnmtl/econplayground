import {Graph, positiveRange} from './Graph.js';

// defaults based on function type
export const defaults = [
    {
        gXAxisMax: 1000,
        gYAxisMax: 2500,
        gA1: 1500,
        gA2: 2,
        gA3: 100,
        gA4: 2,
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
