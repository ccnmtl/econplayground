import {forceFloat} from '../utils.js';
import {NonLinearDemandSupplyGraph} from './NonLinearDemandSupplyGraph.js';
import {
    drawLabel, drawPolygon, getXInterceptWithPoint
} from '../jsxgraphUtils.js';
import {
    invisiblePointOptions,
    drawAreaBC,
    AREA_A_COLOR, AREA_B_COLOR, AREA_C_COLOR
} from './Graph.js';

class NonLinearDemandSupplyGraphAUC extends NonLinearDemandSupplyGraph {
    drawAreaA(areaConf) {
        const isVisible = areaConf === 0 || areaConf === 3 ||
              areaConf === 5;

        const invisibleFunc = this.board.create(
            'functiongraph', [
                this.l2func, 0, this.intersection.X()
            ], {
                visible: false,
                withLabel: false,
                strokeWidth: 0,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });

        const curve = this.board.create(
            'curve', [[], []], {
                strokeWidth: 0,
                fillColor: AREA_A_COLOR,
                fillOpacity: 0.3,
                isDraggable: false,
                draggable: false,
                highlight: false,
                vertices: {
                    visible: false
                },
                borders: {
                    strokeWidth: 0,
                    highlightStrokeWidth: 0,
                    visible: false
                },
                visible: isVisible
            });

        const me = this;
        curve.updateDataArray = function() {
            // Start with (0, 0)
            this.dataX = [0];
            this.dataY = [me.intersection.Y()];

            // Copy all points from curve2
            this.dataX = this.dataX.concat(
                invisibleFunc.points.map(function(p) {
                    return p.usrCoords[1];
                })
            );

            this.dataY = this.dataY.concat(
                invisibleFunc.points.map(function(p) {
                    return p.usrCoords[2];
                })
            );

            // Close the curve by adding (0,0)
            this.dataX.push(0);
            this.dataY.push(me.intersection.Y());

            // Remove problematic NaN points
            this.dataX.splice(0, 2);
            this.dataY.splice(0, 2);

            // Start the curve off at the top left part of the graph.
            this.dataX.unshift(0);
            this.dataY.unshift(Infinity);
        };

        const p1 = this.board.create(
            'point', [
                0,
                this.intersection.Y() + 1
            ],
            invisiblePointOptions);

        const p2 = this.board.create('point', [
            0,
            this.intersection.Y()
        ], invisiblePointOptions);

        if (isVisible) {
            drawLabel(
                this.board,
                [p1, p2, this.intersection],
                this.options.gAreaAName);
        }

        this.board.update();

        const maxval = 100;
        const points = curve.dataX.reduce(function(acc, e, idx) {
            if (idx % 5 === 0 && idx < curve.dataY.length) {
                acc.push([
                    Math.min(forceFloat(e), maxval),
                    Math.min(forceFloat(curve.dataY[idx]), maxval)
                ]);
            }

            return acc;
        }, []);
        points.push([0, this.intersection.Y()]);

        return drawPolygon(this.board, points, null, null, false);
    }
    drawAreaB(areaConf) {
        const p1 = this.board.create('point', [
            0,
            this.intersection.Y()
        ], invisiblePointOptions);

        const p2 = this.board.create('point', [
            0,
            this.options.gLine1OffsetY -
                this.options.gLine1OffsetX +
                this.options.l1SubmissionOffset,
        ], invisiblePointOptions);

        const p3 = this.board.create('point', [
            this.intersection.X(),
            this.intersection.Y()
        ], invisiblePointOptions);

        const points = [p3, p2, p1];
        return drawPolygon(
            this.board,
            points,
            areaConf === 5 ? null : this.options.gAreaBName,
            areaConf === 5 ? AREA_A_COLOR : AREA_B_COLOR,
            areaConf === 1 || areaConf === 3 || areaConf === 4 ||
                areaConf === 5
        );
    }
    drawAreaC(areaConf) {
        const p1 = this.board.create('point', [
            this.intersection.X(),
            0
        ], invisiblePointOptions);

        const xIntercept = getXInterceptWithPoint(
            this.intersection, this.options.gLine1Slope);
        const p2 = this.board.create(
            'point', [xIntercept, 0], invisiblePointOptions);

        const p3 = this.board.create('point', [
            this.intersection.X(),
            this.intersection.Y()
        ], invisiblePointOptions);

        const points = [p3, p2, p1];
        return drawPolygon(
            this.board, points,
            this.options.gAreaCName,
            AREA_C_COLOR,
            areaConf === 2 || areaConf === 4
        );
    }

    make() {
        super.make();

        this.intersection = this.board.create('intersection', [this.l1, this.l2, 0], {
            name: '',
            withLabel: false,
            fixed: true,
            highlight: false,
            showInfobox: false,
            layer: 4,
            size: 0,
            visible: false
        });

        const areaConf = this.options.gAreaConfiguration;

        const areaA = this.drawAreaA(areaConf);
        const areaB = this.drawAreaB(areaConf);
        const areaC = this.drawAreaC(areaConf);

        if (areaConf === 6) {
            drawAreaBC(
                this.board, this.options, this.shadowAreaColor,
                false, this.intersection);
        }

        let areaAArea = NaN;
        if (areaA && typeof areaA.Area === 'function') {
            areaAArea = forceFloat(areaA.Area());
            if (areaAArea > 10) {
                areaAArea = Infinity;
            }
        }

        this.options.handleAreaUpdate(
            areaAArea,
            forceFloat(areaB.Area()),
            forceFloat(areaC.Area())
        );
    }
}

export const mkNonLinearDemandSupplyAUC = function(board, options) {
    let g = new NonLinearDemandSupplyGraphAUC(board, options);
    g.make();
    g.postMake();
    return g;
};
