import {Graph} from './Graph.js';
// import {evaluate, derivative} from 'mathjs';

const tu = function(a, b, c, d, t) {
    return (c - a - t) * t / (b + d);};
const tustar = function(a, c) {
    return (c - a) / 2;};
const epat = function(a, b, c, d, t) {
    return (a * b + c * d)/(b + d * (1 + t));};
const eqat = function(a, b, c, d, t) {
    return (c - a * (1 + t))/(b + d * (1 + t));};
const ta = function(a, b, c, d, t) {
    return t * epat(a, b, c, d, t) * eqat(a, b, c, d, t);};
const tastar = function(a, b, c, d) {
    return ((c - a) * d + b * c - a * b) / ((c + a) * d + 2 * a * b);};

export class TaxRevenueGraph extends Graph {
    make() {
        const me = this.options;

        if (me.gFunctionChoice === 0) {
            const tuStar = tustar(me.gA1, me.gA3);
            const taxPeak = [tuStar, tuStar ** 2 /(me.gA2 + me.gA4)];
            this.p1 = this.board.create('point', taxPeak, {
                name: taxPeak[0].toFixed(2),
                withLabel: true,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });
            this.dash1Horz = this.board.create('line', [[taxPeak[0], 0], taxPeak], {
                strokeWidth: 2,
                strokeColor: this.l3Color,
                dash: 2,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15,
                straightFirst: false,
                straightLast: false,
            });
            this.dash1Vert = this.board.create('line', [[0, taxPeak[1]], taxPeak], {
                strokeWidth: 2,
                strokeColor: this.l3Color,
                dash: 2,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15,
                straightFirst: false,
                straightLast: false,
            });
    
            const f1 = function(q) {
                return tu(me.gA1, me.gA2, me.gA3, me.gA4, q);
            };

            this.l1 = this.board.create('functiongraph',
                [f1, me.gXAxisMin, Math.min(me.gXAxisMax, me.gA3 - me.gA1)],
                {
                    strokeWidth: 2,
                    strokeColor: this.l2Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                });
        } else if (me.gFunctionChoice === 1) {
            const taStar = tastar(me.gA12, me.gA22, me.gA32, me.gA42);
            const taxPeak = [taStar, ta(me.gA12, me.gA22, me.gA32, me.gA42, taStar)];
            this.p1 = this.board.create('point', taxPeak, {
                name: taxPeak[0].toFixed(2),
                withLabel: true,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });
            this.dash1Horz = this.board.create('line', [[taxPeak[0], 0], taxPeak], {
                strokeWidth: 2,
                strokeColor: this.l3Color,
                dash: 2,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15,
                straightFirst: false,
                straightLast: false,
            });
            this.dash1Vert = this.board.create('line', [[0, taxPeak[1]], taxPeak], {
                strokeWidth: 2,
                strokeColor: this.l3Color,
                dash: 2,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15,
                straightFirst: false,
                straightLast: false,
            });
    
            const f1 = function(q) {
                return ta(me.gA12, me.gA22, me.gA32, me.gA42, q);
            };

            this.l1 = this.board.create('functiongraph',
                [f1, me.gXAxisMin, Math.min(me.gXAxisMax, (me.gA32 - me.gA12) / me.gA12)],
                {
                    strokeWidth: 2,
                    strokeColor: this.l2Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                });
        } 
    }
}

export const mkTaxRevenue = function(board, options) {
    let g = new TaxRevenueGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
