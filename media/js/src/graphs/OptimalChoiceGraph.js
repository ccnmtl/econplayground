import {ConsumptionSavingGraph} from './ConsumptionSavingGraph.js';
import {
    getIntersectionPointOptions, invisiblePointOptions
} from './Graph.js';

export class OptimalChoiceGraph extends ConsumptionSavingGraph {
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
                name: 'β (beta)',
                value: 'a5'
            },
            {
                name: 'Orange line label',
                value: 'line_1_label'
            },
            {
                name: 'Blue line label',
                value: 'line_2_label'
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
            },
            {
                name: 'Optimal point label',
                value: 'intersection_2_label'
            },
            {
                name: 'Optimal point\'s horizontal line label',
                value: 'intersection_2_horiz_line_label'
            },
            {
                name: 'Optimal point\'s vertical line label',
                value: 'intersection_2_vert_line_label'
            },
            {
                name: 'Orange point\'s horizontal line label',
                value: 'intersection_3_horiz_line_label'
            },
            {
                name: 'Orange point\'s vertical line label',
                value: 'intersection_3_vert_line_label'
            },
        ];
    }

    U(c1, c2, beta) {
        return Math.log(c1) + beta * Math.log(c2);
    }
    getC1(y1, y2, W, r, beta) {
        return -(
            (-W - r * W - y1 - r * y1 - y2) /
                ((1 + r) * (1 + beta))
        );
    }
    getC2(y1, y2, W, r, beta) {
        return ((W + r * W + y1 + r * y1 + y2) * beta) /
              (1 + beta);
    }
    drawUCurve(isShadow=false) {
        let y1, y2, W, r, beta;

        if (isShadow) {
            y1 = this.options.gA1Initial;
            y2 = this.options.gA2Initial;
            W = this.options.gA3Initial;
            r = this.options.gA4Initial;
            beta = this.options.gA5Initial;
        } else {
            y1 = this.options.gA1;
            y2 = this.options.gA2;
            W = this.options.gA3;
            r = this.options.gA4;
            beta = this.options.gA5;
        }

        const c1 = this.getC1(y1, y2, W, r, beta);
        const c2 = this.getC2(y1, y2, W, r, beta);

        const Ustar = this.U(c1, c2, beta);

        const f = function(x) {
            const result = (Ustar - Math.log(x)) / beta;
            return Math.E ** result;
        };

        this.board.create('functiongraph', [f, 0, 10], {
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

        return [c1, c2];
    }
    drawOptimalPoint(isShadow=false, c1, c2) {
        const p1 = this.board.create(
            'point', [c1, 0],
            invisiblePointOptions);

        const p2 = this.board.create(
            'point', [0, c2],
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
            this.options.gIntersection2Label,
            this.options.gIntersection2HorizLineLabel,
            this.options.gIntersection2VertLineLabel,
            false, false, 'blue'
        );
    }
    /**
     * Draw intercept labels for the orange line, when it intercepts
     * with the X and Y axes.
     */
    drawLineIntercepts() {
        if (this.options.gIntersection3VertLineLabel) {
            this.board.create('intersection', [
                this.l1, this.board.defaultAxes.y
            ], getIntersectionPointOptions(
                this.options.gIntersection3VertLineLabel,
                false, 'black', 1
            ));
        }

        if (this.options.gIntersection3HorizLineLabel) {
            this.board.create('intersection', [
                this.board.defaultAxes.x, this.l1
            ], getIntersectionPointOptions(
                this.options.gIntersection3HorizLineLabel,
                false, 'black', 1
            ));
        }
    }
    make() {
        super.make();

        // Shadow curve and point
        const [shadowC1, shadowC2] = this.drawUCurve(true);
        this.drawOptimalPoint(true, shadowC1, shadowC2);

        const [c1, c2] = this.drawUCurve();
        this.drawOptimalPoint(false, c1, c2);

        this.drawLineIntercepts();
    }
}

export const mkOptimalChoice = function(board, options) {
    let g = new OptimalChoiceGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
