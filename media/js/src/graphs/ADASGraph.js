import {forceFloat} from '../utils.js';
import {Graph} from './Graph.js';

/**
 * Aggregate Demand - Aggregate Supply graph.
 */
class ADASGraph extends Graph {
    make() {
        const me = this;

        if (this.options.shadow && this.options.gDisplayShadow) {
            // Display the initial curves set by the instructor.
            const f1Shadow = function(x) {
                const slope = me.options.gLine1SlopeInitial;
                return (x - 2.5) * slope + 2.5;
            };

            const l1fShadow = this.board.create(
                'functiongraph', [f1Shadow, -20, 20], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    dash: this.options.gLine1Dashed ? 2 : 0,
                    highlight: false,
                    fixed: true,
                    layer: 4,
                    recursionDepthLow: 2,
                    recursionDepthHigh: 10
                });

            const f2Shadow = function(x) {
                const slope = me.options.gLine2SlopeInitial;
                return (x - 2.5) * slope + 2.5;
            };

            const l2fShadow = this.board.create(
                'functiongraph', [f2Shadow, -20, 20], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    dash: this.options.gLine2Dashed ? 2 : 0,
                    highlight: false,
                    fixed: true,
                    layer: 4,
                    recursionDepthLow: 2,
                    recursionDepthHigh: 10
                });

            const f3Shadow = function(x) {
                const slope = me.options.gLine3SlopeInitial;
                return (x - 2.5) * slope + 2.5;
            };

            const l3fShadow = this.board.create(
                'functiongraph', [f3Shadow, -20, 20], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    dash: this.options.gLine3Dashed ? 2 : 0,
                    highlight: false,
                    fixed: true,
                    layer: 4,
                    recursionDepthLow: 2,
                    recursionDepthHigh: 10
                });

            l1fShadow.setPosition(window.JXG.COORDS_BY_USER, [
                forceFloat(this.options.gLine1OffsetXInitial),
                forceFloat(this.options.gLine1OffsetYInitial)
            ]);
            l2fShadow.setPosition(window.JXG.COORDS_BY_USER, [
                forceFloat(this.options.gLine2OffsetXInitial),
                forceFloat(this.options.gLine2OffsetYInitial)
            ]);
            l3fShadow.setPosition(window.JXG.COORDS_BY_USER, [
                forceFloat(this.options.gLine3OffsetXInitial),
                forceFloat(this.options.gLine3OffsetYInitial)
            ]);

            // This is necessary, because otherwise the setPosition call
            // won't have an effect until the graph is interacted with.
            l1fShadow.fullUpdate(true);
            l2fShadow.fullUpdate(true);
            l3fShadow.fullUpdate(true);

            if (this.options.gDisplayIntersection1Initial) {
                this.showIntersection(l1fShadow, l2fShadow, true);
            }

            if (this.options.gDisplayIntersection2Initial) {
                this.showIntersection(l2fShadow, l3fShadow, true);
            }

            if (this.options.gDisplayIntersection3Initial) {
                this.showIntersection(l3fShadow, l1fShadow, true);
            }
        }

        const f1 = function(x) {
            const slope = me.options.gLine1Slope;
            return (x - 2.5) * slope + 2.5;
        };

        this.l1 = this.board.create('functiongraph', [f1, -20, 20], {
            name: this.options.gLine1Label,
            withLabel: true,
            dash: this.options.gLine1Dashed ? 2 : 0,
            strokeWidth: 2,
            strokeColor: this.l1Color,
            fixed: this.areLinesFixed,
            recursionDepthLow: 2,
            recursionDepthHigh: 10
        });

        const f2 = function(x) {
            const slope = me.options.gLine2Slope;
            return (x - 2.5) * slope + 2.5;
        };

        this.l2 = this.board.create('functiongraph', [f2, -20, 20], {
            name: this.options.gLine2Label,
            withLabel: true,
            dash: this.options.gLine2Dashed ? 2 : 0,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            fixed: this.areLinesFixed,
            recursionDepthLow: 2,
            recursionDepthHigh: 10
        });

        const f3 = function(x) {
            const slope = me.options.gLine3Slope;
            return (x - 2.5) * slope + 2.5;
        };

        this.l3 = this.board.create('functiongraph', [f3, -20, 20], {
            name: this.options.gLine3Label,
            withLabel: true,
            dash: this.options.gLine3Dashed ? 2 : 0,
            strokeWidth: 2,
            strokeColor: this.l3Color,
            fixed: this.areLinesFixed,
            recursionDepthLow: 2,
            recursionDepthHigh: 10
        });

        this.l1.setPosition(window.JXG.COORDS_BY_USER, [
            forceFloat(this.options.gLine1OffsetX),
            forceFloat(this.options.gLine1OffsetY)
        ]);
        this.l2.setPosition(window.JXG.COORDS_BY_USER, [
            forceFloat(this.options.gLine2OffsetX),
            forceFloat(this.options.gLine2OffsetY)
        ]);
        this.l3.setPosition(window.JXG.COORDS_BY_USER, [
            forceFloat(this.options.gLine3OffsetX),
            forceFloat(this.options.gLine3OffsetY)
        ]);

        // This is necessary, because otherwise the setPosition call
        // won't have an effect until the graph is interacted with.
        this.l1.fullUpdate(true);
        this.l2.fullUpdate(true);
        this.l3.fullUpdate(true);

        this.l1.on('up', function() {
            const xOffset = me.l1.transformations[0].matrix[1][0];
            const yOffset = me.l1.transformations[0].matrix[2][0];
            const offsetEvt = new CustomEvent('l1offset', {
                detail: {
                    x: xOffset,
                    y: yOffset
                }
            });
            document.dispatchEvent(offsetEvt);
        });

        this.l2.on('up', function() {
            const xOffset = me.l2.transformations[0].matrix[1][0];
            const yOffset = me.l2.transformations[0].matrix[2][0];
            const offsetEvt = new CustomEvent('l2offset', {
                detail: {
                    x: xOffset,
                    y: yOffset
                }
            });
            document.dispatchEvent(offsetEvt);
        });

        this.l3.on('up', function() {
            const xOffset = me.l3.transformations[0].matrix[1][0];
            const yOffset = me.l3.transformations[0].matrix[2][0];
            const offsetEvt = new CustomEvent('l3offset', {
                detail: {
                    x: xOffset,
                    y: yOffset
                }
            });
            document.dispatchEvent(offsetEvt);
        });

        if (this.options.gDisplayIntersection1) {
            this.showIntersection(
                this.l1, this.l2, false, this.options.gIntersectionLabel,
                this.options.gIntersectionHorizLineLabel,
                this.options.gIntersectionVertLineLabel
            );
        }
        if (this.options.gDisplayIntersection2) {
            this.showIntersection(
                this.l2, this.l3, false, this.options.gIntersection2Label,
                this.options.gIntersection2HorizLineLabel,
                this.options.gIntersection2VertLineLabel
            );
        }
        if (this.options.gDisplayIntersection3) {
            this.showIntersection(
                this.l3, this.l1, false, this.options.gIntersection3Label,
                this.options.gIntersection3HorizLineLabel,
                this.options.gIntersection3VertLineLabel
            );
        }
    }
}

export const mkADAS = function(board, options) {
    let g = new ADASGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
