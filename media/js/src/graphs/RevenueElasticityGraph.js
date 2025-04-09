import {Graph} from './Graph.js';

const fq = function(b, c, p) {
    return b * (c - p);};
const fp = function(b, c, q) {
    return c - q / b;};
const epsilon = function(c, p) {
    return -p / (c - p);};
const epsilonQ = function(b, c) {
    return c * b / 2;};
const epsilonP = function(c) {
    return c / 2;};

const r  = function(b, c, q) {
    return q * fp(b, c, q);};
const rBCEpQ = function(b, c) {
    return c * c * b / 4;};
const rP = function(b, c, p) {
    return p * fq(b, c, p);};

const cesQ = function(a, p) {
    return a / p;
};
const cesP = function(a, q) {
    return a / q;
};

const areaOptions = {
    vertices: {visible: false},
    withLines: false,
};

export class RevenueElasticityGraph extends Graph {
    make() {
        const me = this.options;

        if (me.gFunctionChoice === 0) {
            const epPoint = function(b, c) {
                return [epsilonQ(b, c), epsilonP(c)];};
            const pPoint = function(b, c, p) {
                return [fq(b, c, p), p];};
            const epsilonX = this.board.create('point',
                [epsilonQ(me.gA1, me.gA2), 0], {visible: false});
            const epsilonY = this.board.create('point',
                [0, epsilonP(me.gA2)], {visible: false});
            this.p1 = this.board.create('point', epPoint(me.gA1, me.gA2), {
                name: 'Unit-Elastic: |e| = 1',
                withLabel: true,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });
            this.dash1Horz = this.board.create('line', [epsilonY, this.p1], {
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
            this.dash1Vert = this.board.create('line', [epsilonX, this.p1], {
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
    
            const pX = this.board.create('point',
                [fq(me.gA1, me.gA2, me.gA3), 0], {visible: false});
            const pY = this.board.create('point',
                [0, me.gA3], {visible: false});
            this.p2 = this.board.create('point',
                pPoint(me.gA1, me.gA2, me.gA3), {
                    name: `Elasticity: |${
                        Math.abs(epsilon(me.gA2, me.gA3).toFixed(2))}|`,
                    withLabel: true,
                    strokeWidth: 2,
                    strokeColor: this.l1Color,
                    fillColor: this.l1Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                }
            );
            this.dash2Horz = this.board.create('line', [pY, this.p2], {
                strokeWidth: 2,
                strokeColor: this.l1Color,
                dash: 2,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15,
                straightFirst: false,
                straightLast: false,
            });
            this.dash2Vert = this.board.create('line', [pX, this.p2], {
                strokeWidth: 2,
                strokeColor: this.l1Color,
                dash: 2,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15,
                straightFirst: false,
                straightLast: false,
            });

            const f1 = function(q) {
                return fp(me.gA1, me.gA2, q);
            };

            this.l1 = this.board.create('functiongraph',
                [f1, me.gXAxisMin, Math.min(me.gXAxisMax, me.gA1 * me.gA2)],
                {
                    strokeWidth: 2,
                    strokeColor: this.l2Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                });

            if (me.gDisplayShadow) {
                this.board.create('polygon', [
                    [0, 0],
                    [0, epsilonP(me.gA2)],
                    epPoint(me.gA1, me.gA2),
                    [epsilonQ(me.gA1, me.gA2), 0],
                ], areaOptions);
                this.board.create('polygon', [
                    [0, 0],
                    [0, me.gA3],
                    pPoint(me.gA1, me.gA2, me.gA3),
                    [fq(me.gA1, me.gA2, me.gA3), 0],
                ], areaOptions);
            }
        } else if (me.gFunctionChoice === 1) {
            const epPoint = function(b, c) {
                return [epsilonQ(b, c), rBCEpQ(b, c)];
            };
            const epsilonX = this.board.create('point',
                [epsilonQ(me.gA1, me.gA2), 0], {visible: false});
            const epsilonY = this.board.create('point',
                [0, rBCEpQ(me.gA1, me.gA2)], {visible: false});
            this.p1 = this.board.create('point', epPoint(me.gA1, me.gA2), {
                name: 'Unit-Elastic: |e| = 1',
                withLabel: true,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });
            this.dash1Horz = this.board.create('line', [epsilonY, this.p1], {
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
            this.dash1Vert = this.board.create('line', [epsilonX, this.p1], {
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

            const pPoint = function(b, c, p) {
                return [fq(b, c, p), rP(b, c, p)];
            };
            const pX = this.board.create('point',
                [fq(me.gA1, me.gA2, me.gA3), 0], {visible: false});
            const pY = this.board.create('point',
                [0, rP(me.gA1, me.gA2, me.gA3)], {visible: false});
            this.p2 = this.board.create('point',
                pPoint(me.gA1, me.gA2, me.gA3), {
                    name: `Elasticity: |${
                        Math.abs(epsilon(me.gA2, me.gA3).toFixed(2))}|`,
                    withLabel: true,
                    strokeWidth: 2,
                    strokeColor: this.l1Color,
                    fillColor: this.l1Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                }
            );
            this.dash2Horz = this.board.create('line', [pY, this.p2], {
                strokeWidth: 2,
                strokeColor: this.l1Color,
                dash: 2,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15,
                straightFirst: false,
                straightLast: false,
            });
            this.dash2Vert = this.board.create('line', [pX, this.p2], {
                strokeWidth: 2,
                strokeColor: this.l1Color,
                dash: 2,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15,
                straightFirst: false,
                straightLast: false,
            });

            const f1 = function(q) {
                return r(me.gA1, me.gA2, q);
            };

            this.l1 = this.board.create('functiongraph',
                [f1, me.gXAxisMin, Math.min(me.gXAxisMax, me.gA1 * me.gA2)],
                {
                    strokeWidth: 2,
                    strokeColor: this.l2Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                }
            );

            if (me.gDisplayShadow) {
                this.board.create('polygon', [
                    [0, 0],
                    [0, rBCEpQ(me.gA1, me.gA2)],
                    epPoint(me.gA1, me.gA2),
                    [epsilonQ(me.gA1, me.gA2), 0],
                ], areaOptions);
                this.board.create('polygon', [
                    [0, 0],
                    [0, rP(me.gA1, me.gA2, me.gA3)],
                    pPoint(me.gA1, me.gA2, me.gA3),
                    [fq(me.gA1, me.gA2, me.gA3), 0],
                ], areaOptions);
            }
        } else if (me.gFunctionChoice === 2) {
            const pPoint = function(a, p) {
                return [cesQ(a, p), p];
            };
            const pX = this.board.create('point',
                [cesQ(me.gA1, me.gA2), 0], {visible: false});
            const pY = this.board.create('point',
                [0, me.gA2], {visible: false});
            this.p1 = this.board.create('point', pPoint(me.gA1, me.gA2), {
                name: `Elasticity: -1 and Revenue: ${me.gA1}`,
                withLabel: true,
                fixed: true,
                highlight: false,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });
            this.dash1Horz = this.board.create('line', [pY, this.p1], {
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
            this.dash1Vert = this.board.create('line', [pX, this.p1], {
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
                return cesP(me.gA1, q);
            };
    
            this.l1 = this.board.create('functiongraph',
                [f1, me.gXAxisMin, me.gXAxisMax],
                {
                    name: 'Demand',
                    withLabel: true,
                    strokeWidth: 2,
                    strokeColor: this.l2Color,
                    fixed: true,
                    highlight: false,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                }
            );

            if (me.gDisplayShadow) {
                this.board.create('polygon', [
                    [0, 0],
                    [0, me.gA2],
                    pPoint(me.gA1, me.gA2),
                    [cesQ(me.gA1, me.gA2), 0],
                ], areaOptions);
            }
        }   
    }
}

export const mkRevenueElasticity = function(board, options) {
    let g = new RevenueElasticityGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
