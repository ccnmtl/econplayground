import {Graph, getIntersectionPointOptions} from './Graph.js';

class CobbDouglasGraph extends Graph {
    make() {
        const me = this;
        const f = function(x) {
            return me.options.gA1 *
                (me.options.gA3 ** me.options.gA4) *
                (x ** (1 - me.options.gA4));
        };

        const lineLabel = 'F(' + this.options.gA1Name + ',' +
              this.options.gA3Name + ',' +
              this.options.gA2Name + ')';

        this.board.create('functiongraph', [f], {
            name: lineLabel,
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.options.gType === 12 ?
                this.l2Color : this.l1Color,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        if (this.options.shadow && this.options.gDisplayShadow) {
            // Display the initial curve set by the instructor.
            const fShadow = function(x) {
                return me.options.gA1Initial *
                    (me.options.gA3Initial **
                     me.options.gA4Initial) *
                    (x ** (1 - me.options.gA4Initial));
            };

            this.board.create('functiongraph', [fShadow, -30, 30], {
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

        const p = this.board.create('point', [
            this.options.gA2,
            f(this.options.gA2)
        ], getIntersectionPointOptions(
            this.options.gIntersectionLabel, false));

        this.board.create('line', [p, [p.X(), 0]], {
            dash: 1,
            strokeColor: 'black',
            strokeWidth: 1,
            straightFirst: false,
            straightLast: false
        });

        this.board.create('point', [p.X(), 0], {
            size: 0,
            name: this.options.gIntersectionVertLineLabel || '',
            withLabel: true,
            fixed: true,
            highlight: false,
            showInfobox: false
        });

        this.board.create('line', [[0, p.Y()], p], {
            dash: 1,
            name: this.options.gIntersectionHorizLineLabel || '',
            withLabel: true,
            strokeColor: 'black',
            strokeWidth: 1,
            straightFirst: false,
            straightLast: false
        });
    }
}

export const mkCobbDouglas = function(board, options) {
    let g = new CobbDouglasGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
