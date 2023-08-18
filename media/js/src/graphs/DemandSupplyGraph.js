import {Graph} from './Graph.js';

export class DemandSupplyGraph extends Graph {
    make() {
        if (this.options.shadow && this.options.gDisplayShadow) {
            // Display the initial curves set by the instructor.
            this.l1fShadow = this.board.create(
                'line',
                [
                    [2.5, 2.5 + this.options.gLine1OffsetYInitial],
                    [3.5, 2.5 + this.options.gLine1OffsetYInitial +
                     this.options.gLine1SlopeInitial]
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
                    [2.5, 2.5 + this.options.gLine2OffsetYInitial],
                    [3.5, 2.5 + this.options.gLine2OffsetYInitial +
                     this.options.gLine2SlopeInitial]
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
                [2.5, 2.5 + this.options.gLine1OffsetY +
                 this.options.l1SubmissionOffset],
                [3.5, 2.5 + this.options.gLine1OffsetY +
                 this.options.gLine1Slope + this.options.l1SubmissionOffset]
            ], {
                name: this.options.gLine1Label,
                withLabel: true,
                label: {
                    autoPosition: true,
                    offset: [0, 35]
                },
                strokeColor: this.l1Color,
                strokeWidth: 2,
                fixed: this.areLinesFixed
            });

        this.l2 = this.board.create(
            'line',
            [
                [2.5, 2.5 + this.options.gLine2OffsetY +
                 this.options.l2SubmissionOffset],
                [3.5, 2.5 + this.options.gLine2OffsetY +
                 this.options.gLine2Slope + this.options.l2SubmissionOffset]
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
                fixed: this.areLinesFixed
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
