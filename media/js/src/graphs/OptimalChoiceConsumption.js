import {Graph, invisiblePointOptions} from './Graph.js';

export const defaults = {
    gA1: 5,
    gA2: 10,
    gA3: 10,
    gA4: 1,
    gA5: 1
};

export class OptimalChoiceConsumptionGraph extends Graph {
    /**
     * This graph displays the function:
     *
     * Line 1: y_1 = (R-px*x_1)/py
     *
     * Line 2: y_2 = (U_star/x^alpha)^(1/beta)
     * Where:
     *   U_star = U(x, y) = x_star^alpha * y_star^beta
     *   x_star = (alpha/(alpha+beta)) * R/px
     *   y_star = (beta/(alpha+beta)) * R/py
     *
     * px -> gA1
     * py -> gA2
     * R -> gA3
     * alpha -> gA4
     * beta -> gA5
     */
    make() {
        const me = this;

        /**
         * Derives the y-value for the 'Budget Line' at a given x-value.
         * @param {number} x - The 'Budget Line' x-value.
         * @returns The corresponding y-value for the 'Budget Line'.
         */
        const f1 = function(x) {
            // y_1 = (R-px*x_1)/py
            const result = (me.options.gA3 - (me.options.gA1 * x)) / me.options.gA2;

            if (result < 0) {
                return NaN;
            }

            return result;
        };
        const nStar = function(nu, pn) {
            // n_star = (nu/(alpha+beta)) * R/pn
            return nu / (me.options.gA4+me.options.gA5) * me.options.gA3/pn;
        };

        const f2 = function(x) {
            // y_2 = (U_star/x^alpha)^(1/beta)
            const xStar = nStar(me.options.gA4, me.options.gA1);
            const yStar = nStar(me.options.gA5, me.options.gA2);
            const UStar = (xStar ** me.options.gA4) * (yStar ** me.options.gA5);
            return (UStar / (x ** me.options.gA4)) ** (1 / me.options.gA5);
        };

        this.l2 = this.board.create('functiongraph', [f1, 0, 30], {
            name: 'IBL',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            label: {
                strokeColor: this.l2Color
            },
            // This graph is only moved by its RangeEditors, not by
            // dragging.
            fixed: true,
            highlight: false
        });

        this.l1 = this.board.create('functiongraph', [f2, 0, 30], {
            name: this.options.gLine1Label,
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l1Color,
            label: {
                strokeColor: this.l2Color
            },
            // This graph is only moved by its RangeEditors, not by
            // dragging.
            fixed: true,
            highlight: false
        });

        if (this.options.gShowIntersection) {
            const p1 = this.board.create(
                'point', [nStar(this.options.gA4, this.options.gA1), 0],
                invisiblePointOptions);

            const p2 = this.board.create(
                'point', [0, nStar(this.options.gA5, this.options.gA2)],
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

export const mkOptimalChoiceConsumption = function(board, options) {
    let g = new OptimalChoiceConsumptionGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
