import {Graph, invisiblePointOptions, positiveRange} from './Graph.js';

/**
 * This graph displays the function:
 *
 *   c2 = y2 + (1 + r)(y1 + W - c1)
 *
 * With c1 plotted as X. To store these values,
 * I'm using:
 *
 *   y1 -> gA1
 *   y2 -> gA2
 *   W -> gA3
 *   r -> gA4
 */
export class ConsumptionSavingGraph extends Graph {
    static getRuleOptions() {
        return [
            {
                name: 'y1',
                value: 'a1'
            },
            {
                name: 'y2',
                value: 'a2'
            },
            {
                name: 'W',
                value: 'a3'
            },
            {
                name: 'r',
                value: 'a4'
            },
            {
                name: 'Orange line label',
                value: 'line_1_label'
            },
            {
                name: 'Endowment point label',
                value: 'intersection_label'
            },
            {
                name: 'Endowment point\'s horizontal line label',
                value: 'intersection_horiz_line_label'
            },
            {
                name: 'Endowment point\'s vertical line label',
                value: 'intersection_vert_line_label'
            }
        ];
    }

    make() {
        const me = this;

        if (this.options.shadow && this.options.gDisplayShadow) {
            const f1Shadow = function(x) {
                return me.options.gA2Initial +
                      (1 + me.options.gA4Initial) *
                      (me.options.gA1Initial + me.options.gA3Initial - x);
            };

            this.board.create('functiongraph', [
                positiveRange(f1Shadow), 0, 30
            ], {
                withLabel: false,
                strokeWidth: 2,
                strokeColor: this.shadowColor,
                highlight: false,
                // Under the main line layer
                layer: 4,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });

            if (this.options.gShowIntersection) {
                const p1Shadow = this.board.create(
                    'point', [
                        this.options.gA1Initial + this.options.gA3Initial,
                        0
                    ], invisiblePointOptions);

                const p2Shadow = this.board.create('point', [
                    0, this.options.gA2Initial
                ], invisiblePointOptions);

                // Make these lines invisible - actually rendered from
                // this.showIntersection().
                const l1Shadow = this.board.create('line',
                    [p1Shadow, [p1Shadow.X(), p2Shadow.Y()]],
                    {
                        withLabel: false,
                        straightFirst: false,
                        straightLast: false,
                        dash: 1,
                        visible: false,
                        strokeWidth: 0,
                        highlight: false
                    });
                const l2Shadow = this.board.create('line',
                    [p2Shadow, [p1Shadow.X(), p2Shadow.Y()]],
                    {
                        withLabel: false,
                        straightFirst: false,
                        straightLast: false,
                        dash: 1,
                        visible: false,
                        strokeWidth: 0,
                        highlight: false
                    });
                this.showIntersection(l1Shadow, l2Shadow, true);
            }
        }

        const f1 = function(c1) {
            // c2 = y2 + (1 + r)(y1 + W - c1)
            return me.options.gA2 + (1 + me.options.gA4) *
                  (me.options.gA1 + me.options.gA3 - c1);
        };

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
            highlight: false,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        if (this.options.gShowIntersection) {
            const p1 = this.board.create(
                'point', [this.options.gA1 + this.options.gA3, 0],
                invisiblePointOptions);

            const p2 = this.board.create(
                'point', [0, this.options.gA2],
                invisiblePointOptions);

            // Make this line invisible - it's actually rendered from
            // this.showIntersection().
            const l2 = this.board.create('line', [p2, [p1.X(), p2.Y()]], {
                withLabel: false,
                straightFirst: false,
                straightLast: false,
                dash: 1,
                highlight: false,
                visible: false,
                strokeWidth: 0
            });

            this.intersection = this.showIntersection(
                this.l1, l2, false,
                this.options.gIntersectionLabel,
                this.options.gIntersectionHorizLineLabel,
                this.options.gIntersectionVertLineLabel);
        }
    }
}

export const mkConsumptionSaving = function(board, options) {
    let g = new ConsumptionSavingGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
