const shapeOptions = {
    withLabel: false,
    fixed: true,
    draggable: false,
    isDraggable: false,
    vertices: {
        visible: false
    },
    borders: {
        strokeWidth: 0,
        highlightStrokeWidth: 0,
        visible: false
    }
};

/**
 * Given a board and an array of points,
 * draw a label at the center of these points.
 */
const drawLabel = function(board, points, text) {
    const group = board.create('group', []);
    group.addPoints(points);
    const center = group._update_centroid_center();

    board.create('text', [center[0], center[1], text], {
        anchorX: 'middle'
    });
};

/**
 * Draw a polygon with the given points and options on the board,
 * for the AUC (area under curve) feature.
 *
 * Returns the new polygon
 */
const drawPolygon = function(board, points, name, color, visible=true) {
    const p = board.create('polygon', points, {
        fillColor: color,
        highlightFillColor: color,
        visible: visible,
        ...shapeOptions
    });

    if (visible) {
        drawLabel(board, points, name);
    }

    return p;
};


/**
 * Given a point and the line's slope, return its x-intercept.
 *
 * From: https://stackoverflow.com/a/36183654/173630
 */
const getXInterceptWithPoint = function(p, slope) {
    return p.X() - p.Y() / slope;
};

export {
    drawLabel, drawPolygon, getXInterceptWithPoint
};
