import {ConsumptionLeisureGraph} from './ConsumptionLeisureGraph.js';
import {invisiblePointOptions} from './Graph.js';

class ConsumptionLeisureOptimalChoiceGraph extends ConsumptionLeisureGraph {
    /**
     * U(f,c) = f^α * c^(1 - α)
     */
    U(f, c, alpha) {
        return (f ** alpha) * c ** (1 - alpha);
    }
    drawUCurve(isShadow=false) {
        let T, w, alpha, t;

        if (isShadow) {
            T = this.options.gA1Initial;
            w = this.options.gA2Initial;
            alpha = this.options.gA3Initial;
            t = this.options.gA4Initial;
        } else {
            T = this.options.gA1;
            w = this.options.gA2;
            alpha = this.options.gA3;
            t = this.options.gA4;
        }

        const f = T * alpha;
        const c = (T - f) * (1 - t) * w;

        const Ustar = this.U(f, c, alpha);

        const cFunc = function(x) {
            return (x ** (-alpha) * Ustar) ** (1 / (1 - alpha));
        };

        this.board.create('functiongraph', [cFunc, 0, 10], {
            name: this.options.gLine2Label,
            withLabel: !isShadow,
            strokeWidth: 2,
            strokeColor: isShadow ? this.shadowColor : this.l2Color,
            // This graph is only moved by its RangeEditors, not by
            // dragging.
            fixed: true,
            highlight: false,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        return [f, c];
    }
    drawOptimalPoint(isShadow=false, f, c) {
        const p1 = this.board.create(
            'point', [f, 0],
            invisiblePointOptions);

        const p2 = this.board.create(
            'point', [0, c],
            invisiblePointOptions);

        const l1 = this.board.create('line', [p1, [p1.X(), p2.Y()]], {
            straightFirst: false,
            straightLast: false,
            dash: 1,
            highlight: false,
            visible: false,
            strokeWidth: 0
        });

        const l2 = this.board.create('line', [p2, [p1.X(), p2.Y()]], {
            straightFirst: false,
            straightLast: false,
            dash: 1,
            highlight: false,
            visible: false,
            strokeWidth: 0
        });

        this.showIntersection(
            l1, l2, isShadow,
            this.options.gIntersectionLabel,
            this.options.gIntersection2HorizLineLabel,
            this.options.gIntersection2VertLineLabel,
            false, false, 'blue'
        );
    }
    make() {
        super.make();

        // Shadow curve and point
        const [shadowF, shadowC] = this.drawUCurve(true);
        this.drawOptimalPoint(true, shadowF, shadowC);

        const [f, c] = this.drawUCurve();

        this.drawOptimalPoint(false, f, c);
    }
}

export const mkConsumptionLeisureOptimalChoice = function(board, options) {
    let g = new ConsumptionLeisureOptimalChoiceGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
