/**
 * Graph.js
 *
 * Each graph type is a sub-class of the common Graph class.
 */

import { defaultGraph } from './GraphMapping';
import { forceFloat, getOffset, getXIntercept, getYIntercept } from './utils';
import {
    drawLabel, drawPolygon, getXInterceptWithPoint
} from './jsxgraphUtils';


const applyDefaults = function(obj, defaults) {
    let o = {};
    for (var key in obj) {
        if (typeof obj[key] === 'undefined') {
            o[key] = defaults[key];
        } else {
            o[key] = obj[key];
        }
    }
    return o;
};

const invisiblePointOptions = {
    hasLabel: false,
    withLabel: false,
    label: {
        visible: false
    },
    size: 0,
    showInfobox: false,
    fixed: true
};

const getIntersectionPointOptions = function(
    label, isShadow=false, color='red', size=3
) {
    if (isShadow) {
        color = 'rgb(150, 150, 150)';
    }

    return {
        name: label || '',
        withLabel: !isShadow,
        fixed: true,
        highlight: false,
        showInfobox: false,
        size: size,
        fillColor: color,
        strokeColor: color
    };
};

const AREA_A_COLOR = 'purple';
const AREA_B_COLOR = 'lime';
const AREA_C_COLOR = 'red';


const drawAreaBC = function(
    board, options, shadowAreaColor, shadow=false, intersection
) {
    const p1 = board.create('point', [
        0,
        intersection.Y()
    ], invisiblePointOptions);

    const p2 = board.create('point', [
        intersection.X(),
        0
    ], invisiblePointOptions);

    const p3 = board.create('point', [
        0, 0
    ], invisiblePointOptions);

    const points = [p1, intersection, p2, p3];

    let color = AREA_B_COLOR;
    if (shadow) {
        color = shadowAreaColor;
    }

    return drawPolygon(
        board, points,
        shadow ? null : options.gAreaBName,
        color);
};

class Graph {
    constructor(board, options, defaults) {
        if (typeof defaults === 'undefined') {
            defaults = defaultGraph;
        }

        if (typeof options === 'undefined') {
            options = {};
        }

        // Line 1 and line 2
        this.l1 = null;
        this.l1Color = 'rgb(255, 127, 14)';
        this.l2 = null;
        this.l2Color = 'steelblue';
        this.l3 = null;
        this.l3Color = 'rgb(228, 87, 86)';
        this.shadowColor = 'rgb(200, 200, 200)';
        this.shadowAreaColor = 'rgb(150, 150, 150)';

        this.options = applyDefaults(options, defaults);

        this.areLinesFixed = this.options.locked ||
            this.options.isSubmitted;

        this.board = board;
    }
    resetLine1() {
        if (!this.l1) {
            return;
        }
        this.l1.point1.moveTo([
            2.5,
            2.5 + this.options.gLine1OffsetY]);
        this.l1.point2.moveTo([
            3.5,
            2.5 + this.options.gLine1OffsetY +
                this.options.gLine1Slope]);
    }
    resetLine2() {
        if (!this.l2) {
            return;
        }
        this.l2.point1.moveTo([
            2.5,
            2.5 + this.options.gLine2OffsetY]);
        this.l2.point2.moveTo([
            3.5,
            2.5 + this.options.gLine2OffsetY +
                this.options.gLine2Slope]);
    }
    /**
     * Handle common initialization that happens after the custom
     * make() step.
     */
    postMake() {
        // Make two white lines to block the curves from displaying
        // below 0. A more straightforward way to do this would be
        // better.
        this.board.create('line', [[-0.2, 0], [-0.2, 5]], {
            dash: 0,
            highlight: false,
            fixed: true,
            strokeColor: 'white',
            strokeWidth: this.board.canvasWidth / 25.5,
            straightFirst: true,
            straightLast: true
        });
        this.board.create('line', [[0, -0.2], [5, -0.2]], {
            dash: 0,
            highlight: false,
            fixed: true,
            strokeColor: 'white',
            strokeWidth: this.board.canvasWidth / 25.5,
            straightFirst: true,
            straightLast: true
        });

        const me = this;

        if (
            this.l1 && (typeof this.l1.getRise === 'function') &&
                !this.options.isSubmitted
        ) {
            this.initialL1Y = this.l1.getRise();

            if (window.EconPlayground.isInstructor) {
                this.l1.on('up', function() {
                    const offset = getOffset(
                        me.l1.getSlope(), me.l1.getRise(), 2.5);

                    let line = 1;
                    if (me.options.isBoard2) {
                        line += 2;
                    }
                    const offsetEvt = new CustomEvent('l1offset', {
                        detail: {
                            x: 0,
                            y: offset,
                            line: line
                        }
                    });
                    document.dispatchEvent(offsetEvt);
                });
            } else {
                this.l1.on('up', function() {
                    // Only do this line reset functionality if this
                    // is a submittable graph. Otherwise, students
                    // should be able to play freely.
                    if (me.options.gNeedsSubmit) {
                        me.resetLine2();
                    }

                    if (this.getRise() > me.initialL1Y) {
                        document.dispatchEvent(new Event('l1up'));
                    } else if (this.getRise() < me.initialL1Y) {
                        document.dispatchEvent(new Event('l1down'));
                    } else {
                        document.dispatchEvent(new Event('l1initial'));
                    }

                    const offset = getOffset(
                        me.l1.getSlope(), me.l1.getRise(), 2.5);

                    let line = 1;
                    if (me.options.isBoard2) {
                        line += 2;
                    }
                    const offsetEvt = new CustomEvent('l1offset', {
                        detail: {
                            x: 0,
                            y: offset,
                            line: line
                        }
                    });
                    document.dispatchEvent(offsetEvt);
                });
            }
        }

        if (
            this.l2 && (typeof this.l2.getRise === 'function') &&
                !this.options.isSubmitted
        ) {
            this.initialL2Y = this.l2.getRise();

            if (window.EconPlayground.isInstructor) {
                this.l2.on('up', function() {
                    const offset = getOffset(
                        me.l2.getSlope(), me.l2.getRise(), 2.5);

                    let line = 2;
                    if (me.options.isBoard2) {
                        line += 2;
                    }
                    const offsetEvt = new CustomEvent('l2offset', {
                        detail: {
                            x: 0,
                            y: offset,
                            line: line
                        }
                    });
                    document.dispatchEvent(offsetEvt);
                });
            } else {
                this.l2.on('up', function() {
                    // Only do this line reset functionality if this
                    // is a submittable graph. Otherwise, students
                    // should be able to play freely.
                    if (me.options.gNeedsSubmit) {
                        me.resetLine1();
                    }

                    if (this.getRise() > me.initialL2Y) {
                        document.dispatchEvent(new Event('l2up'));
                    } else if (this.getRise() < me.initialL2Y) {
                        document.dispatchEvent(new Event('l2down'));
                    } else {
                        document.dispatchEvent(new Event('l2initial'));
                    }

                    const offset = getOffset(
                        me.l2.getSlope(), me.l2.getRise(), 2.5);
                    let line = 2;
                    if (me.options.isBoard2) {
                        line += 2;
                    }
                    const offsetEvt = new CustomEvent('l2offset', {
                        detail: {
                            x: 0,
                            y: offset,
                            line: line
                        }
                    });
                    document.dispatchEvent(offsetEvt);
                });
            }
        }
    }
    /**
     * Updates the intersection point at i.
     */
    updateIntersection(i, p1, p2) {
        p1.moveTo([0, i.Y()]);
        p2.moveTo([i.X(), 0]);
    }
    /**
     * Set up intersection display for l1 and l2.
     *
     * i is the intersection, and p1 and p2 are its X and Y
     * intercepts.
     */
    showIntersection(
        l1, l2, isShadow=false, label, horizLabel, vertLabel,
        extendVertLine=false, extendHorizLine=false, color='red'
    ) {
        if (label === null || typeof label === 'undefined') {
            label = this.options.gIntersectionLabel;
        }
        if (horizLabel === null || typeof horizLabel === 'undefined') {
            horizLabel = this.options.gIntersectionHorizLineLabel;
        }
        if (vertLabel === null || typeof vertLabel === 'undefined') {
            vertLabel = this.options.gIntersectionVertLineLabel;
        }

        let i = this.board.create(
            'intersection', [l1, l2, 0],
            getIntersectionPointOptions(label, isShadow, color)
        );

        let i3 = i;
        if (extendHorizLine) {
            i3 = [10, i.Y()];
        }

        let p1 = this.board.create('point', [0, i.Y()], {
            size: 0,
            name: horizLabel || '',
            withLabel: !isShadow,
            fixed: true,
            highlight: false,
            showInfobox: false
        });
        this.board.create('line', [p1, i3], {
            dash: 1,
            highlight: false,
            strokeColor: 'black',
            strokeWidth: isShadow ? 0.5 : 1,
            straightFirst: false,
            straightLast: false,
            layer: 4
        });

        let p2 = this.board.create('point', [i.X(), 0], {
            size: 0,
            name: vertLabel || '',
            withLabel: !isShadow,
            fixed: true,
            highlight: false,
            showInfobox: false
        });

        let i2 = i;
        if (extendVertLine) {
            i2 = [i.X(), 10];
        }

        this.board.create('line', [p2, i2], {
            dash: 1,
            highlight: false,
            strokeColor: 'black',
            strokeWidth: isShadow ? 0.5 : 1,
            straightFirst: false,
            straightLast: false,
            layer: 4
        });

        if (!isShadow) {
            // Keep the dashed intersection lines perpendicular to the axes.
            const me = this;
            l1.on('up', function() {
                me.updateIntersection(i, p1, p2);
            });
            l1.on('drag', function() {
                me.updateIntersection(i, p1, p2);
            });
            l2.on('up', function() {
                me.updateIntersection(i, p1, p2);
            });
            l2.on('drag', function() {
                me.updateIntersection(i, p1, p2);
            });
        }

        return i;
    }
    make() {
        // unimplemented
    }
}

class DemandSupplyGraph extends Graph {
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
                label: { position: 'rt', offset: [-10, -20] },
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
                label: { position: 'rt', offset: [0, 35] },
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

class DemandSupplyGraphAUC extends DemandSupplyGraph {
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

const mkDemandSupplyAUC = function(board, options) {
    let g = new DemandSupplyGraphAUC(board, options);
    g.make();
    g.postMake();
    return g;
};

class NonLinearDemandSupplyGraph extends Graph {
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
                [f1Shadow, -30, 30], {
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
                [f2Shadow, -30, 30], {
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

            this.l1 = this.board.create('functiongraph', [l1func, -30, 30], {
                name: this.options.gLine1Label,
                withLabel: true,
                strokeWidth: 2,
                strokeColor: this.l1Color,
                fixed: this.areLinesFixed,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });
        }

        this.l2 = this.board.create('functiongraph', [l2func, -30, 30], {
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

class NonLinearDemandSupplyGraphAUC extends NonLinearDemandSupplyGraph {
    drawAreaA(areaConf) {
        const isVisible = areaConf === 0 || areaConf === 3 ||
              areaConf === 5;

        const invisibleFunc = this.board.create(
            'functiongraph', [this.l2func, 0, this.intersection.X()], {
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

const mkNonLinearDemandSupplyAUC = function(board, options) {
    let g = new NonLinearDemandSupplyGraphAUC(board, options);
    g.make();
    g.postMake();
    return g;
};

class CobbDouglasGraph extends Graph {
    make() {
        const me = this;
        const f = function(x) {
            return me.options.gCobbDouglasA *
                (me.options.gCobbDouglasK ** me.options.gCobbDouglasAlpha) *
                (x ** (1 - me.options.gCobbDouglasAlpha));
        };

        const lineLabel = 'F(' + this.options.gCobbDouglasAName + ',' +
              this.options.gCobbDouglasKName + ',' +
              this.options.gCobbDouglasLName + ')';

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
                return me.options.gCobbDouglasAInitial *
                    (me.options.gCobbDouglasKInitial **
                     me.options.gCobbDouglasAlphaInitial) *
                    (x ** (1 - me.options.gCobbDouglasAlphaInitial));
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
            this.options.gCobbDouglasL,
            f(this.options.gCobbDouglasL)
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

const mkCobbDouglas = function(board, options) {
    let g = new CobbDouglasGraph(board, options);
    g.make();
    g.postMake();
    return g;
};

class ConsumptionLeisureGraph extends Graph {
    /**
     * This graph displays the function:
     *
     *   y = (n - x)w
     *
     * To store these values, I'm using:
     *
     *   n -> gA1
     *   w -> gA2
     */
    make() {
        const me = this;

        if (this.options.shadow && this.options.gDisplayShadow) {
            const f1Shadow = function(x) {
                return (me.options.gA1Initial - x) * me.options.gA2Initial;
            };

            this.board.create('functiongraph', [f1Shadow, -30, 30], {
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

        const T = this.options.gA1;
        const w = this.options.gA2;
        const t = this.options.gA4;

        let f1;
        if (me.options.gType === 15) {
            f1 = function(x) {
                return (T - x) * w * (1 - t);
            };
        } else {
            f1 = function(x) {
                return (T - t - x) * w;
            };
        }

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

        if (this.options.gShowIntersection) {
            this.board.create(
                'intersection',
                [this.l1, this.board.defaultAxes.x, 0], {
                    name: this.options.gIntersectionHorizLineLabel || '',
                    withLabel: true,
                    fixed: true,
                    highlight: false,
                    showInfobox: false,
                    size: 1,
                    fillColor: 'red',
                    strokeColor: 'red'
                });

            this.board.create(
                'intersection',
                [this.l1, this.board.defaultAxes.y, 0], {
                    name: this.options.gIntersectionVertLineLabel || '',
                    withLabel: true,
                    fixed: true,
                    highlight: false,
                    showInfobox: false,
                    size: 1,
                    fillColor: 'red',
                    strokeColor: 'red'
                });
        }
    }
}

const mkConsumptionLeisure = function(board, options) {
    let g = new ConsumptionLeisureGraph(board, options);
    g.make();
    g.postMake();
    return g;
};

class ConsumptionSavingGraph extends Graph {
    /**
     * This graph displays the function:
     *
     *   c2 = y2 + (1 + r)(y1 + W - c1)
     *
     * With c1 plotted as X. To store these values,
     * I'm using:
     *
     *   y1 -> gA1
     *   y2 -> gA2
     *   W -> gA3
     *   r -> gA4
     */
    make() {
        const me = this;

        if (this.options.shadow && this.options.gDisplayShadow) {
            const f1Shadow = function(x) {
                return me.options.gA2Initial + (1 + me.options.gA4Initial) *
                    (me.options.gA1Initial + me.options.gA3Initial - x);
            };

            this.board.create('functiongraph', [f1Shadow, -30, 30], {
                withLabel: false,
                strokeWidth: 2,
                strokeColor: this.shadowColor,
                highlight: false,
                // Under the main line layer
                layer: 4,
                recursionDepthLow: 8,
                recursionDepthHigh: 15
            });

            if (this.options.gShowIntersection) {
                const p1Shadow = this.board.create(
                    'point', [
                        this.options.gA1Initial + this.options.gA3Initial,
                        0
                    ], invisiblePointOptions);

                const p2Shadow = this.board.create('point', [
                    0, this.options.gA2Initial
                ], invisiblePointOptions);

                // Make these lines invisible - actually rendered from
                // this.showIntersection().
                const l1Shadow = this.board.create('line',
                    [p1Shadow, [p1Shadow.X(), p2Shadow.Y()]],
                    {
                        withLabel: false,
                        straightFirst: false,
                        straightLast: false,
                        dash: 1,
                        visible: false,
                        strokeWidth: 0,
                        highlight: false
                    });
                const l2Shadow = this.board.create('line',
                    [p2Shadow, [p1Shadow.X(), p2Shadow.Y()]],
                    {
                        withLabel: false,
                        straightFirst: false,
                        straightLast: false,
                        dash: 1,
                        visible: false,
                        strokeWidth: 0,
                        highlight: false
                    });
                this.showIntersection(l1Shadow, l2Shadow, true);
            }
        }

        const f1 = function(c1) {
            // c2 = y2 + (1 + r)(y1 + W - c1)
            return me.options.gA2 + (1 + me.options.gA4) *
                (me.options.gA1 + me.options.gA3 - c1);
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

        if (this.options.gShowIntersection) {
            const p1 = this.board.create(
                'point', [this.options.gA1 + this.options.gA3, 0],
                invisiblePointOptions);

            const p2 = this.board.create(
                'point', [0, this.options.gA2],
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

const mkConsumptionSaving = function(board, options) {
    let g = new ConsumptionSavingGraph(board, options);
    g.make();
    g.postMake();
    return g;
};

class OptimalChoiceGraph extends ConsumptionSavingGraph {
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

const mkOptimalChoice = function(board, options) {
    let g = new OptimalChoiceGraph(board, options);
    g.make();
    g.postMake();
    return g;
};

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

const mkConsumptionLeisureOptimalChoice = function(board, options) {
    let g = new ConsumptionLeisureOptimalChoiceGraph(board, options);
    g.make();
    g.postMake();
    return g;
};

/**
 * Aggregate Demand - Aggregate Supply graph.
 */
class ADASGraph extends Graph {
    make() {
        const me = this;

        if (this.options.shadow && this.options.gDisplayShadow) {
            // Display the initial curves set by the instructor.
            const f1Shadow = function(x) {
                const slope = me.options.gLine1SlopeInitial;
                return (x - 2.5) * slope + 2.5;
            };

            const l1fShadow = this.board.create(
                'functiongraph', [f1Shadow, -20, 20], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    dash: this.options.gLine1Dashed ? 2 : 0,
                    highlight: false,
                    fixed: true,
                    layer: 4,
                    recursionDepthLow: 2,
                    recursionDepthHigh: 10
                });

            const f2Shadow = function(x) {
                const slope = me.options.gLine2SlopeInitial;
                return (x - 2.5) * slope + 2.5;
            };

            const l2fShadow = this.board.create(
                'functiongraph', [f2Shadow, -20, 20], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    dash: this.options.gLine2Dashed ? 2 : 0,
                    highlight: false,
                    fixed: true,
                    layer: 4,
                    recursionDepthLow: 2,
                    recursionDepthHigh: 10
                });

            const f3Shadow = function(x) {
                const slope = me.options.gLine3SlopeInitial;
                return (x - 2.5) * slope + 2.5;
            };

            const l3fShadow = this.board.create(
                'functiongraph', [f3Shadow, -20, 20], {
                    withLabel: false,
                    strokeWidth: 2,
                    strokeColor: this.shadowColor,
                    dash: this.options.gLine3Dashed ? 2 : 0,
                    highlight: false,
                    fixed: true,
                    layer: 4,
                    recursionDepthLow: 2,
                    recursionDepthHigh: 10
                });

            l1fShadow.setPosition(window.JXG.COORDS_BY_USER, [
                forceFloat(this.options.gLine1OffsetXInitial),
                forceFloat(this.options.gLine1OffsetYInitial)
            ]);
            l2fShadow.setPosition(window.JXG.COORDS_BY_USER, [
                forceFloat(this.options.gLine2OffsetXInitial),
                forceFloat(this.options.gLine2OffsetYInitial)
            ]);
            l3fShadow.setPosition(window.JXG.COORDS_BY_USER, [
                forceFloat(this.options.gLine3OffsetXInitial),
                forceFloat(this.options.gLine3OffsetYInitial)
            ]);

            // This is necessary, because otherwise the setPosition call
            // won't have an effect until the graph is interacted with.
            l1fShadow.fullUpdate(true);
            l2fShadow.fullUpdate(true);
            l3fShadow.fullUpdate(true);

            if (this.options.gDisplayIntersection1Initial) {
                this.showIntersection(l1fShadow, l2fShadow, true);
            }

            if (this.options.gDisplayIntersection2Initial) {
                this.showIntersection(l2fShadow, l3fShadow, true);
            }

            if (this.options.gDisplayIntersection3Initial) {
                this.showIntersection(l3fShadow, l1fShadow, true);
            }
        }

        const f1 = function(x) {
            const slope = me.options.gLine1Slope;
            return (x - 2.5) * slope + 2.5;
        };

        this.l1 = this.board.create('functiongraph', [f1, -20, 20], {
            name: this.options.gLine1Label,
            withLabel: true,
            dash: this.options.gLine1Dashed ? 2 : 0,
            strokeWidth: 2,
            strokeColor: this.l1Color,
            fixed: this.areLinesFixed,
            recursionDepthLow: 2,
            recursionDepthHigh: 10
        });

        const f2 = function(x) {
            const slope = me.options.gLine2Slope;
            return (x - 2.5) * slope + 2.5;
        };

        this.l2 = this.board.create('functiongraph', [f2, -20, 20], {
            name: this.options.gLine2Label,
            withLabel: true,
            dash: this.options.gLine2Dashed ? 2 : 0,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            fixed: this.areLinesFixed,
            recursionDepthLow: 2,
            recursionDepthHigh: 10
        });

        const f3 = function(x) {
            const slope = me.options.gLine3Slope;
            return (x - 2.5) * slope + 2.5;
        };

        this.l3 = this.board.create('functiongraph', [f3, -20, 20], {
            name: this.options.gLine3Label,
            withLabel: true,
            dash: this.options.gLine3Dashed ? 2 : 0,
            strokeWidth: 2,
            strokeColor: this.l3Color,
            fixed: this.areLinesFixed,
            recursionDepthLow: 2,
            recursionDepthHigh: 10
        });

        this.l1.setPosition(window.JXG.COORDS_BY_USER, [
            forceFloat(this.options.gLine1OffsetX),
            forceFloat(this.options.gLine1OffsetY)
        ]);
        this.l2.setPosition(window.JXG.COORDS_BY_USER, [
            forceFloat(this.options.gLine2OffsetX),
            forceFloat(this.options.gLine2OffsetY)
        ]);
        this.l3.setPosition(window.JXG.COORDS_BY_USER, [
            forceFloat(this.options.gLine3OffsetX),
            forceFloat(this.options.gLine3OffsetY)
        ]);

        // This is necessary, because otherwise the setPosition call
        // won't have an effect until the graph is interacted with.
        this.l1.fullUpdate(true);
        this.l2.fullUpdate(true);
        this.l3.fullUpdate(true);

        this.l1.on('up', function() {
            const xOffset = me.l1.transformations[0].matrix[1][0];
            const yOffset = me.l1.transformations[0].matrix[2][0];
            const offsetEvt = new CustomEvent('l1offset', {
                detail: {
                    x: xOffset,
                    y: yOffset
                }
            });
            document.dispatchEvent(offsetEvt);
        });

        this.l2.on('up', function() {
            const xOffset = me.l2.transformations[0].matrix[1][0];
            const yOffset = me.l2.transformations[0].matrix[2][0];
            const offsetEvt = new CustomEvent('l2offset', {
                detail: {
                    x: xOffset,
                    y: yOffset
                }
            });
            document.dispatchEvent(offsetEvt);
        });

        this.l3.on('up', function() {
            const xOffset = me.l3.transformations[0].matrix[1][0];
            const yOffset = me.l3.transformations[0].matrix[2][0];
            const offsetEvt = new CustomEvent('l3offset', {
                detail: {
                    x: xOffset,
                    y: yOffset
                }
            });
            document.dispatchEvent(offsetEvt);
        });

        if (this.options.gDisplayIntersection1) {
            this.showIntersection(
                this.l1, this.l2, false, this.options.gIntersectionLabel,
                this.options.gIntersectionHorizLineLabel,
                this.options.gIntersectionVertLineLabel
            );
        }
        if (this.options.gDisplayIntersection2) {
            this.showIntersection(
                this.l2, this.l3, false, this.options.gIntersection2Label,
                this.options.gIntersection2HorizLineLabel,
                this.options.gIntersection2VertLineLabel
            );
        }
        if (this.options.gDisplayIntersection3) {
            this.showIntersection(
                this.l3, this.l1, false, this.options.gIntersection3Label,
                this.options.gIntersection3HorizLineLabel,
                this.options.gIntersection3VertLineLabel
            );
        }
    }
}

const mkADAS = function(board, options) {
    let g = new ADASGraph(board, options);
    g.make();
    g.postMake();
    return g;
};

export const graphTypes = [
    // There are some null graph types here because the number of
    // total graphs in the system has been reduced since it was
    // originally designed, and I haven't updated the graph type
    // numerical values to reflect that yet.
    mkDemandSupply, mkNonLinearDemandSupply,
    null, mkCobbDouglas,
    null, mkConsumptionLeisure,
    null, mkConsumptionSaving,
    mkADAS,
    mkDemandSupplyAUC,
    mkNonLinearDemandSupplyAUC,
    mkOptimalChoice,

    // Joint graphs are null here. They don't have their own
    // constructors. Rather, combinations of existing constructors.
    null,
    null,
    null,

    mkConsumptionLeisureOptimalChoice
];
