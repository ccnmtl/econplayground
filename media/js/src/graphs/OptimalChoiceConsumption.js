import {Graph, invisiblePointOptions} from './Graph.js';

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
        const opt = this.options;

        /**
         * Derives the y-value for the 'Budget Line' at a given x-value.
         * @param {number} x - The 'Budget Line' x-value.
         * @returns The corresponding y-value for the 'Budget Line'.
         */
        const f1 = function(x) {
            // y_1 = (R-px*x_1)/py
            return (opt.gA3 - (opt.gA1 * x)) / opt.gA2;
        };
        const nStar = function(nu, pn) {
            // n_star = (nu/(alpha+beta)) * R/pn
            return nu/(opt.gA4+opt.gA5) * opt.gA3/pn;
        };

        const f2 = function(x) {
            // y_2 = (U_star/x^alpha)^(1/beta)
            const xStar = nStar(opt.gA4, opt.gA1);
            const yStar = nStar(opt.gA5, opt.gA2);
            const UStar = (xStar ** opt.gA4) * (yStar ** opt.gA5);
            return (UStar / (x ** opt.gA4)) ** (1 / opt.gA5);
        };

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

        this.l2 = this.board.create('functiongraph', [f2, -30, 30], {
            name: this.options.gLine2Label,
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            // This graph is only moved by its RangeEditors, not by
            // dragging.
            fixed: true,
            highlight: false,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });
        
        if (this.options.gShowIntersection) {
            const p1 = this.board.create(
                'point', [nStar(opt.gA4, opt.gA1), 0],
                invisiblePointOptions);

            const p2 = this.board.create(
                'point', [0, nStar(opt.gA5, opt.gA2)],
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
