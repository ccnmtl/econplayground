import {Graph} from './Graph.js';


const cost = function(q, a, b, c) {
    return a + (b * q) + (c * (q ** 2));
};

const fcost = function(a) {
    return a;
};

const vcost = function(q, a, b, c) {
    return cost(q, a, b, c) - fcost(a);
};

export class CostFunctionsTotalGraph extends Graph {
    make() {
        const me = this;

        const f1 = function(q) {
            return cost(q, me.options.gA1, me.options.gA2, me.options.gA3);
        };

        const f2 = function(q) {
            return fcost(me.options.gA1);
        };

        const f3 = function(q) {
            return vcost(q, me.options.gA1, me.options.gA2, me.options.gA3);
        };

        this.l1 = this.board.create('functiongraph', [f1, 0, 500], {
            name: 'TC',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l1Color,
            fixed: true,
            highlight: false,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        this.l2 = this.board.create('functiongraph', [f2, 0, 500], {
            name: 'FC',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            fixed: true,
            highlight: false,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        this.l3 = this.board.create('functiongraph', [f3, 0, 500], {
            name: 'VC',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l3Color,
            fixed: true,
            highlight: false,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });
    }
}

export const mkCostFunctionsTotal = function(board, options) {
    let g = new CostFunctionsTotalGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
