import {Graph} from './Graph.js';

export class DemandSupplyGraph extends Graph {
    constructor(board, options, defaults) {
        super(board, options, defaults);

        // Arbitrary center of graph, which depends on
        // gXAxisMax/gYAxisMax.
        this.center = 2.5;
    }

    static getRuleOptions() {
        return [
            {
                name: 'Orange line',
                value: 'line1',
            },
            {
                name: 'Blue line',
                value: 'line2',
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
                name: 'X-axis label',
                value: 'x_axis_label'
            },
            {
                name: 'Y-axis label',
                value: 'y_axis_label'
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
                name: 'Orange line slope',
                value: 'line_1_slope'
            },
            {
                name: 'Blue line slope',
                value: 'line_2_slope'
            }
        ];
    }

    make() {
        if (this.options.shadow && this.options.gDisplayShadow) {
            // Display the initial curves set by the instructor.
            this.l1fShadow = this.board.create(
                'line',
                [
                    [
                        this.center,
                        this.center + this.options.gLine1OffsetYInitial
                    ],
                    [
                        this.center + 1,
                        this.center + this.options.gLine1OffsetYInitial +
                            this.options.gLine1SlopeInitial
                    ]
                ], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    highlight: false,
                    fixed: true,
                    layer: 4
                });

            this.l2fShadow = this.board.create(
                'line',
                [
                    [
                        this.center,
                        this.center + this.options.gLine2OffsetYInitial
                    ],
                    [
                        this.center + 1,
                        this.center + this.options.gLine2OffsetYInitial +
                            this.options.gLine2SlopeInitial
                    ]
                ], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    highlight: false,
                    fixed: true,
                    layer: 4
                });

            this.showIntersection(this.l1fShadow, this.l2fShadow, true);
        }

        this.l1 = this.board.create(
            'line',
            [
                [
                    this.center,
                    this.center + this.options.gLine1OffsetY +
                        this.options.l1SubmissionOffset
                ],
                [
                    this.center + 1,
                    this.center + this.options.gLine1OffsetY +
                        this.options.gLine1Slope + this.options.l1SubmissionOffset
                ]
            ], {
                name: this.options.gLine1Label,
                withLabel: true,
                label: {
                    autoPosition: true,
                    offset: [0, 35]
                },
                strokeColor: this.l1Color,
                strokeWidth: 2,
                fixed: this.areLinesFixed,
                highlight: !this.areLinesFixed
            });

        this.l2 = this.board.create(
            'line',
            [
                [
                    this.center,
                    this.center + this.options.gLine2OffsetY +
                        this.options.l2SubmissionOffset
                ],
                [
                    this.center + 1,
                    this.center + this.options.gLine2OffsetY +
                        this.options.gLine2Slope + this.options.l2SubmissionOffset
                ]
            ], {
                name: this.options.gLine2Label,
                withLabel: true,
                label: {
                    autoPosition: true,
                    // These offsets are not ideal, but are necessary
                    // for now. See:
                    // https://github.com/jsxgraph/jsxgraph/issues/575
                    offset: [50, -50]
                },
                strokeColor: this.l2Color,
                strokeWidth: 2,
                fixed: this.areLinesFixed,
                highlight: !this.areLinesFixed
            });

        if (this.options.gShowIntersection) {
            if (this.options.gType === 13 && !this.options.isBoard2) {
                this.showIntersection(
                    this.l1, this.l2, false,
                    null, null, null, false,
                    // extend horizontal line
                    true);
            } else {
                this.showIntersection(this.l1, this.l2);
            }
        }
    }
}

export const mkDemandSupply = function(board, options) {
    let g = new DemandSupplyGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
