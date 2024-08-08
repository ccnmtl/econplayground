import {Graph} from './Graph.js';

export const defaults = [
    {
        gA1: 4000,
        gA1Name: 'a',
        gA1Min: 0,
        gA1Max: 10000,
        gA2: 1,
        gA2Name: 'b',
        gA2Min: 0,
        gA2Max: 30,
        gA3: 1,
        gA3Name: 'c',
        gA3Min: 0,
        gA3Max: 30,
        gXAxisMax: 500,
        gYAxisMax: 10000
    },
    {
        gA1: 2000,
        gA1Name: 'a',
        gA1Min: 0,
        gA1Max: 10000,
        gA2: 10,
        gA2Name: 'b',
        gA2Min: 0,
        gA2Max: 30,
        gA3: 2,
        gA3Name: 'c',
        gA3Min: 0,
        gA3Max: 30,
        gXAxisMax: 500,
        gYAxisMax: 25000
    }
];

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

        this.l1 = this.board.create('functiongraph', [
            f1, 0, this.options.gXAxisMax
        ], {
            name: 'TC',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l1Color,
            fixed: true,
            highlight: false
        });

        this.l2 = this.board.create('functiongraph', [
            f2, 0, this.options.gXAxisMax
        ], {
            name: 'FC',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            fixed: true,
            highlight: false
        });

        this.l3 = this.board.create('functiongraph', [
            f3, 0, this.options.gXAxisMax
        ], {
            name: 'VC',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l3Color,
            fixed: true,
            highlight: false
        });
    }
}

export const mkCostFunctionsTotal = function(board, options) {
    let g = new CostFunctionsTotalGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
