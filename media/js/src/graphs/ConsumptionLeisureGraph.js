import {Graph} from './Graph.js';

export class ConsumptionLeisureGraph extends Graph {
    /**
     * This graph displays the function:
     *
     *   y = (n - x)w
     *
     * To store these values, I'm using:
     *
     *   n -> gA1
     *   w -> gA2
     */
    make() {
        const me = this;

        if (this.options.shadow && this.options.gDisplayShadow) {
            const f1Shadow = function(x) {
                return (me.options.gA1Initial - x) * me.options.gA2Initial;
            };

            this.board.create('functiongraph', [f1Shadow, -30, 30], {
                name: this.options.gLine1Label,
                withLabel: false,
                strokeWidth: 2,
                strokeColor: this.shadowColor,
                highlight: false,
                // Under the main line layer
                layer: 4,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });
        }

        const T = this.options.gA1;
        const w = this.options.gA2;
        const t = this.options.gA4;

        let f1;
        if (me.options.gType === 15) {
            f1 = function(x) {
                return (T - x) * w * (1 - t);
            };
        } else {
            f1 = function(x) {
                return (T - t - x) * w;
            };
        }

        this.l1 = this.board.create('functiongraph', [f1, -30, 30], {
            name: this.options.gLine1Label,
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l1Color,
            // This graph is only moved by its RangeEditors, not by
            // dragging.
            fixed: true,
            highlight: false,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        if (this.options.gShowIntersection) {
            this.board.create(
                'intersection',
                [this.l1, this.board.defaultAxes.x, 0], {
                    name: this.options.gIntersectionHorizLineLabel || '',
                    withLabel: true,
                    fixed: true,
                    highlight: false,
                    showInfobox: false,
                    size: 1,
                    fillColor: 'red',
                    strokeColor: 'red'
                });

            this.board.create(
                'intersection',
                [this.l1, this.board.defaultAxes.y, 0], {
                    name: this.options.gIntersectionVertLineLabel || '',
                    withLabel: true,
                    fixed: true,
                    highlight: false,
                    showInfobox: false,
                    size: 1,
                    fillColor: 'red',
                    strokeColor: 'red'
                });
        }
    }
}

export const mkConsumptionLeisure = function(board, options) {
    let g = new ConsumptionLeisureGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
