import { defaultGraph } from '../GraphMapping.js';
import {getOffset} from '../utils.js';
import {drawPolygon} from '../jsxgraphUtils.js';


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

export const invisiblePointOptions = {
    hasLabel: false,
    withLabel: false,
    label: {
        visible: false
    },
    size: 0,
    showInfobox: false,
    fixed: true
};

export const getIntersectionPointOptions = function(
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

export const AREA_A_COLOR = 'purple';
export const AREA_B_COLOR = 'lime';
export const AREA_C_COLOR = 'red';


export const drawAreaBC = function(
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

/**
 * Graph
 *
 * Each graph type is a sub-class of the common Graph class. A Graph
 * sub-class must implement the make() method. See existing graph
 * types for examples.
 */
export class Graph {
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

            this.l1.on('up', function() {
                // Only do this line reset functionality if this
                // is a submittable graph. Otherwise, students
                // should be able to play freely.
                if (!window.EconPlayground.isInstructor && me.options.gNeedsSubmit) {
                    me.resetLine2();
                }

                if (this.getRise() > me.initialL1Y) {
                    console.log('l1up');
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

        if (
            this.l2 && (typeof this.l2.getRise === 'function') &&
                !this.options.isSubmitted
        ) {
            this.initialL2Y = this.l2.getRise();

            this.l2.on('up', function() {
                // Only do this line reset functionality if this
                // is a submittable graph. Otherwise, students
                // should be able to play freely.
                if (!window.EconPlayground.isInstructor && me.options.gNeedsSubmit) {
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
