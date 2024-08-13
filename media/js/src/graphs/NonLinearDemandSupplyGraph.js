import {Graph, positiveRange} from './Graph.js';
import {getYIntercept} from '../utils.js';

export class NonLinearDemandSupplyGraph extends Graph {
    static getRuleOptions() {
        return [
            {
                name: 'Function',
                value: 'function_choice'
            },
            {
                name: 'Orange line slope',
                value: 'line_1_slope'
            },
            {
                name: 'A label',
                value: 'cobb_douglas_a_name'
            },
            {
                name: 'K label',
                value: 'cobb_douglas_k_name'
            },
            {
                name: 'N label',
                value: 'n_name'
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
                name: 'Intersection point label',
                value: 'intersection_label'
            },
            {
                name: 'Intersection\'s horizontal line label',
                value: 'intersection_horiz_line_label'
            },
            {
                name: 'Intersection\'s vertical line label',
                value: 'intersection_vert_line_label'
            },
            {
                name: 'A',
                value: 'cobb_douglas_a'
            },
            {
                name: 'K',
                value: 'cobb_douglas_k'
            }
        ];
    }

    make() {
        const me = this;
        const alpha =
              typeof this.options.gCobbDouglasAlpha !== 'undefined' ?
                  this.options.gCobbDouglasAlpha : 0.3;

        if (this.options.shadow && this.options.gDisplayShadow) {
            // Display the initial curves set by the instructor.
            const f1Shadow = function(x) {
                const slope = me.options.gLine1SlopeInitial;
                const result = (x - me.options.gLine1OffsetXInitial) * slope;
                return result + me.options.gLine1OffsetYInitial;
            };

            const l1fShadow = this.board.create(
                'functiongraph',
                [positiveRange(f1Shadow), 0, 30], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    highlight: false,
                    fixed: true,
                    layer: 4,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                });

            let f2Shadow = function(x) {
                const result = (1 - alpha) *
                      (me.options.gCobbDouglasAInitial *
                       me.options.gCobbDouglasKInitial ** alpha) *
                      ((x - me.options.gLine2OffsetXInitial) **
                       -alpha);

                return result + me.options.gLine2OffsetYInitial;
            };

            if (this.options.gFunctionChoice === 1) {
                f2Shadow = function(x) {
                    const result = alpha *
                          (me.options.gCobbDouglasAInitial *
                           (x - me.options.gLine2OffsetXInitial)
                           ** (alpha - 1)) *
                          (me.options.gCobbDouglasKInitial ** (1 - alpha));

                    return result + me.options.gLine2OffsetYInitial;
                };
            }

            const l2fShadow = this.board.create(
                'functiongraph',
                [positiveRange(f2Shadow), 0, 30], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    highlight: false,
                    fixed: true,
                    layer: 4,
                    recursionDepthLow: 8,
                    recursionDepthHigh: 15
                });

            this.showIntersection(l1fShadow, l2fShadow, true);
        }

        let l2func = function(x) {
            // Apply the X offset to x before we do
            // anything else with it, to shift the graph
            // left and right.
            const result = (1 - alpha) *
                (me.options.gCobbDouglasA *
                 me.options.gCobbDouglasK ** alpha) *
                  ((x - me.options.gLine2OffsetX) **
                   -alpha);

            // Sum the y offset with the result
            // to shift it up/down
            return result + me.options.gLine2OffsetY;
        };

        if (this.options.gFunctionChoice === 1) {
            l2func = function(x) {
                const result = alpha *
                    (me.options.gCobbDouglasA *
                     (x - me.options.gLine2OffsetX)
                     ** (alpha - 1)) *
                    (me.options.gCobbDouglasK ** (1 - alpha));

                return result + me.options.gLine2OffsetY;
            };
        }

        this.l2func = l2func;

        if (me.options.gType === 12) {
            const x1 = me.options.gCobbDouglasL;
            const y1 = l2func(x1);
            const m = me.options.gLine1Slope;
            const yIntercept = getYIntercept(y1, m, x1);

            this.l1 = this.board.create('line', [
                [x1, Math.min(300, y1)],
                [0, Math.min(300, yIntercept)]
            ], {
                name: this.options.gLine1Label,
                withLabel: true,
                strokeWidth: 2,
                strokeColor: this.l1Color,
                fixed: true
            });
        } else {
            const l1func = function(x) {
                const slope = me.options.gLine1Slope;
                let lineXPos = x - me.options.gLine1OffsetX;

                const result = lineXPos * slope;
                return result + me.options.gLine1OffsetY;
            };

            this.l1 = this.board.create('functiongraph', [
                positiveRange(l1func), 0, 30
            ], {
                name: this.options.gLine1Label,
                withLabel: true,
                strokeWidth: 2,
                strokeColor: this.l1Color,
                fixed: this.areLinesFixed,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });
        }

        this.l2 = this.board.create('functiongraph', [
            positiveRange(l2func), 0, 30
        ], {
            name: this.options.gLine2Label,
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            fixed: this.areLinesFixed ||
                this.options.gType === 12 ||
                this.options.gType === 14,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        this.l1.on('up', function() {
            const xOffset = me.l1.transformations[0].matrix[1][0];
            const yOffset = me.l1.transformations[0].matrix[2][0];
            const offsetEvt = new CustomEvent('l1offset', {
                detail: {
                    x: me.options.gLine1OffsetX + xOffset,
                    y: me.options.gLine1OffsetY + yOffset
                }
            });
            document.dispatchEvent(offsetEvt);
        });

        this.l2.on('up', function() {
            const xOffset = me.l2.transformations[0].matrix[1][0];
            const yOffset = me.l2.transformations[0].matrix[2][0];

            const offsetEvt = new CustomEvent('l2offset', {
                detail: {
                    x: me.options.gLine2OffsetX + xOffset,
                    y: me.options.gLine2OffsetY + yOffset
                }
            });
            document.dispatchEvent(offsetEvt);
        });

        if (this.options.gShowIntersection) {
            this.showIntersection(
                this.l1, this.l2, false,
                this.options.gIntersectionLabel,
                this.options.gIntersectionHorizLineLabel,
                this.options.gIntersectionVertLineLabel,
                // Extend the vertical line on the joint graph
                this.options.gType === 12
            );
        }
    }
}

export const mkNonLinearDemandSupply = function(board, options) {
    let g = new NonLinearDemandSupplyGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
