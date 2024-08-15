import {Graph, positiveRange} from './Graph.js';

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
export class ConsumptionLeisureGraph extends Graph {
    static getRuleOptions() {
        return [
            {
                name: 'Horizontal intercept value: T',
                value: 'a1'
            },
            {
                name: 'Real Wage: w',
                value: 'a2'
            },
            {
                name: 'Tax Rate: t',
                value: 'a4'
            },
            {
                name: 'Budget line label',
                value: 'line_1_label'
            },
            {
                name: 'X-axis label',
                value: 'x_axis_label'
            },
            {
                name: 'Y-axis label',
                value: 'y_axis_label'
            },
            {
                name: 'Intersection\'s horizontal line label',
                value: 'intersection_horiz_line_label'
            },
            {
                name: 'Intersection\'s vertical line label',
                value: 'intersection_vert_line_label'
            }
        ];
    }

    make() {
        const me = this;

        if (this.options.shadow && this.options.gDisplayShadow) {
            const f1Shadow = function(x) {
                return (me.options.gA1Initial - x) * me.options.gA2Initial;
            };

            this.board.create('functiongraph', [f1Shadow, 0, 30], {
                name: this.options.gLine1Label,
                withLabel: false,
                strokeWidth: 2,
                strokeColor: this.shadowColor,
                highlight: false,
                // Under the main line layer
                layer: 4
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

        this.l1 = this.board.create('functiongraph', [
            positiveRange(f1), 0, 30
        ], {
            name: this.options.gLine1Label,
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l1Color,
            // This graph is only moved by its RangeEditors, not by
            // dragging.
            fixed: true,
            highlight: false
        });

        if (this.options.gShowIntersection) {
            this.board.create(
                'point',
                [(-t + T), 0], {
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
