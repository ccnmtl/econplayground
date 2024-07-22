import {forceFloat, getXIntercept} from '../utils.js';
import {DemandSupplyGraph} from './DemandSupplyGraph.js';
import {
    drawPolygon, getXInterceptWithPoint
} from '../jsxgraphUtils.js';
import {
    invisiblePointOptions,
    drawAreaBC,
    AREA_A_COLOR, AREA_B_COLOR, AREA_C_COLOR
} from './Graph.js';

export class DemandSupplyGraphAUC extends DemandSupplyGraph {
    drawAreaA(shadow=false, areaConf, intersection, l2) {
        if (!l2) {
            console.error('error: l2 is missing!');
            return;
        }

        const p1 = this.board.create('point', [
            0,
            // getRise() returns the y-intercept
            l2.getRise()
        ], invisiblePointOptions);

        const p2 = this.board.create('point', [
            0,
            Math.max(intersection.Y(), 0)
        ], invisiblePointOptions);

        const p3 = this.board.create('point', [
            Math.min(
                intersection.X(),
                getXInterceptWithPoint(intersection, l2.getSlope())
            ),
            Math.max(intersection.Y(), 0)
        ], invisiblePointOptions);

        const points = [p1, p2, p3];

        return drawPolygon(
            this.board, points,
            shadow ? null : this.options.gAreaAName,
            shadow ? this.shadowAreaColor : AREA_A_COLOR,
            areaConf === 0 || areaConf === 3
        );
    }
    drawAreaAB(shadow=false, intersection, l1, l2) {
        if (!l1) {
            console.error('error: l1 is missing!');
            return;
        }
        if (!l2) {
            console.error('error: l2 is missing!');
            return;
        }

        const yIntercept = l1.getRise();
        let points = [];

        const p1 = this.board.create('point', [
            0,
            // getRise() returns the y-intercept
            l2.getRise()
        ], invisiblePointOptions);
        points.push(p1);

        const p2 = this.board.create('point', [
            Math.min(
                intersection.X(),
                getXInterceptWithPoint(intersection, l2.getSlope())
            ),
            Math.max(intersection.Y(), 0)
        ], invisiblePointOptions);
        points.push(p2);

        if (yIntercept >= 0) {
            // If the y intercept is 0 or more, the shape is a
            // triangle.
            const p3 = this.board.create('point', [
                0, yIntercept
            ], invisiblePointOptions);
            points.push(p3);
        } else {
            const p3 = this.board.create('point', [
                getXIntercept(l1.getSlope(), yIntercept),
                0
            ], invisiblePointOptions);
            points.push(p3);

            const p4 = this.board.create('point', [
                0, 0
            ], invisiblePointOptions);
            points.push(p4);
        }

        return drawPolygon(
            this.board, points,
            shadow ? null : this.options.gAreaAName,
            shadow ? this.shadowAreaColor : AREA_A_COLOR);
    }
    drawAreaB(shadow=false, areaConf, intersection, l1) {
        if (!l1) {
            console.error('error: l1 is missing!');
            return;
        }

        const yIntercept = l1.getRise();
        let points = [];

        const p1 = this.board.create('point', [
            0,
            intersection.Y()
        ], invisiblePointOptions);
        points.push(p1);

        const p2 = this.board.create('point', [
            intersection.X(),
            intersection.Y()
        ], invisiblePointOptions);
        points.push(p2);

        if (yIntercept >= 0) {
            // If the y intercept is 0 or more, the shape is a
            // triangle.
            const p3 = this.board.create('point', [
                0, yIntercept
            ], invisiblePointOptions);
            points.push(p3);
        } else {
            const p3 = this.board.create('point', [
                getXIntercept(l1.getSlope(), yIntercept),
                0
            ], invisiblePointOptions);
            points.push(p3);

            const p4 = this.board.create('point', [
                0, 0
            ], invisiblePointOptions);
            points.push(p4);
        }

        let color = AREA_B_COLOR;
        if (shadow) {
            color = this.shadowAreaColor;
        }

        return drawPolygon(
            this.board, points,
            shadow ? null : this.options.gAreaBName,
            color,
            areaConf === 1 || areaConf === 3 || areaConf === 4
        );
    }

    drawAreaC(shadow=false, areaConf, intersection, l1) {
        if (!l1) {
            console.error('error: l1 is missing!');
            return;
        }

        const yIntercept = l1.getRise();
        let points = [];

        const p1 = this.board.create('point', [
            intersection.X(),
            intersection.Y()
        ], invisiblePointOptions);
        points.push(p1);

        const p2 = this.board.create('point', [
            intersection.X(),
            0
        ], invisiblePointOptions);
        points.push(p2);

        if (yIntercept >= 0) {
            const p3 = this.board.create('point', [
                0, 0
            ], invisiblePointOptions);
            points.push(p3);

            const p4 = this.board.create('point', [
                0, yIntercept
            ], invisiblePointOptions);
            points.push(p4);


        } else {
            const xIntercept = getXInterceptWithPoint(
                intersection, l1.getSlope());
            const p3 = this.board.create(
                'point',
                [xIntercept, 0], invisiblePointOptions);
            points.push(p3);
        }

        let color = AREA_C_COLOR;
        if (shadow) {
            color = this.shadowAreaColor;
        }

        return drawPolygon(
            this.board, points,
            shadow ? null : this.options.gAreaCName,
            color,
            areaConf === 2 || areaConf === 4
        );
    }

    drawAreas() {
        const areaConf = this.options.gAreaConfiguration;

        // Turn on and off certain triangles based on the "area
        // configuration".
        const areaA = this.drawAreaA(
            false, areaConf, this.intersection, this.l2);
        const areaB = this.drawAreaB(
            false, areaConf, this.intersection, this.l1);
        const areaC = this.drawAreaC(
            false, areaConf, this.intersection, this.l1);

        if (areaConf === 5) {
            this.drawAreaAB(
                false, this.intersection, this.l1, this.l2);
        }
        if (areaConf === 6) {
            drawAreaBC(
                this.board, this.options, this.shadowAreaColor,
                false, this.intersection);
        }

        this.options.handleAreaUpdate(
            forceFloat(areaA.Area()),
            forceFloat(areaB.Area()),
            forceFloat(areaC.Area())
        );
    }

    drawShadowAreas() {
        const areaConf = this.options.gAreaConfigurationInitial;

        // Turn on and off certain areas based on the "area
        // configuration".
        if (areaConf === 0 || areaConf === 3) {
            this.drawAreaA(
                true, areaConf, this.shadowIntersection, this.l2fShadow);
        }
        if (areaConf === 1 || areaConf === 3 || areaConf === 4) {
            this.drawAreaB(
                true, areaConf, this.shadowIntersection, this.l1fShadow);
        }
        if (areaConf === 2 || areaConf === 4) {
            this.drawAreaC(
                true, areaConf, this.shadowIntersection, this.l1fShadow);
        }
        if (areaConf === 5) {
            this.drawAreaAB(
                true, this.shadowIntersection,
                this.l1fShadow, this.l2fShadow);
        }
        if (areaConf === 6) {
            drawAreaBC(
                this.board, this.options, this.shadowAreaColor,
                true, this.shadowIntersection);
        }
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

        if (this.options.gIsAreaDisplayed) {
            if (this.l1fShadow && this.l2fShadow) {
                this.shadowIntersection = this.board.create('intersection', [
                    this.l1fShadow, this.l2fShadow, 0
                ], {
                    name: '',
                    withLabel: false,
                    fixed: true,
                    highlight: false,
                    showInfobox: false,
                    layer: 4,
                    size: 0,
                    visible: false
                });
            }
            this.drawShadowAreas();
        }

        this.drawAreas();
    }
}

export const mkDemandSupplyAUC = function(board, options) {
    let g = new DemandSupplyGraphAUC(board, options);
    g.make();
    g.postMake();
    return g;
};
