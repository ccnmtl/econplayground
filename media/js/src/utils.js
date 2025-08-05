/* globals process */

const BOARD_WIDTH = 540;
const BOARD_HEIGHT = 300;
const GRID_MAJOR = [
    {
        face: 'line',
        size: 5,
        strokeColor: '#ffffff',
    },
    {
        face: 'point',
        size: 4,
        strokeColor: '#bfbfbf',
        strokeOpacity: 1,
    },
    {
        face: 'line',
        size: 2,
        strokeColor: '#bfbfbf',
        strokeOpacity: 1,
    }
];

// In case we end up using minor grid markers
const GRID_MINOR = [
    {
        face: 'line',
        size: 0,
        strokeColor: '#ffffff',
    },
    {
        face: 'point',
        size: 3,
        strokeColor: '#efefef',
        strokeOpacity: 1,
    },
    {
        face: 'line',
        size: 1,
        strokeColor: '#efefef',
        strokeOpacity: 1,
    }
];

/**
 * A wrapper for `fetch` that passes along auth credentials.
 */
const authedFetch = function(url, method = 'get', data = null) {
    const elt = document.getElementById('csrf-token');
    const token = elt ? elt.getAttribute('content') : '';

    // Stub out fetch calls for jest.
    if (
        typeof process !== 'undefined' &&
            process.env.NODE_ENV === 'test'
    ) {
        return new Promise(() => {
            return;
        });
    }

    return fetch(url + '?format=json', {
        method: method,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': token
        },
        body: data,
        credentials: 'same-origin'
    });
};

const getAssessment = function(graphId) {
    return authedFetch(`/api/assessments/${graphId}/`)
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Not found';
            }
        });
};


const getGraph = function(graphId) {
    return authedFetch(`/api/graphs/${graphId}/`)
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Not found';
            }
        });
};

const getQuestion = function(questionId) {
    return authedFetch(`/api/questions/${questionId}/`)
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Not found';
            }
        });
};


const getMultipleChoice = function(questionId) {
    const elt = document.getElementById('csrf-token');
    const token = elt ? elt.getAttribute('content') : '';
    return fetch(`/api/multiple_choice/?format=json&questionId=${questionId}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': token
        },
        body: null,
        credentials: 'same-origin'
    }).then(function(response) {
        if (response.status === 200) {
            return response.json();
        } else {
            throw 'Not found';
        }});
};


const getEvaluations = function(questionId) {
    const elt = document.getElementById('csrf-token');
    const token = elt ? elt.getAttribute('content') : '';
    return fetch(`/api/evaluations/?format=json&questionId=${questionId}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': token
        },
        body: null,
        credentials: 'same-origin'
    });
};

const getUserAssignment = function(id) {
    const elt = document.getElementById('csrf-token');
    const token = elt ? elt.getAttribute('content') : '';
    return fetch(`/api/user_assignments/?id=${id}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': token
        },
        body: null,
        credentials: 'same-origin'
    });
};

const getGraphId = function(urlpath) {
    let m = urlpath.match(/^\/?course\/\d+\/graph\/(\d+)\/?/);
    if (m && m.length > 1) {
        return forceNumber(m[1]);
    }

    m = urlpath.match(/^\/?graph\/(\d+)\/?/);
    if (m && m.length > 1) {
        return forceNumber(m[1]);
    }

    return null;
};

const getCohortId = function(urlpath) {
    const m = urlpath.match(/^\/?course\/(\d+)\/?.*/);
    if (m && m.length > 1) {
        return forceNumber(m[1]);
    }
    return null;
};

const getTopics = function(cohortId) {
    return authedFetch(`/api/cohorts/${cohortId}/`)
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw 'Not found';
            }
        });
};

const getL1SubmissionOffset = function() {
    return 0;
};

const getL2SubmissionOffset = function() {
    return 0;
};

/**
 * Propagate a form update to a callback.
 */
const handleFormUpdate = function(e, props=null) {
    let obj = {};

    // Use the element's id as the attribute name, and fall
    // back to data-id.
    let id = e.target.id || e.target.dataset.id || e.target.name;

    if (e.target.type === 'radio') {
        id = e.target.name || e.target.id || e.target.dataset.id;
    }

    switch(e.target.type) {
        case 'checkbox':
        case 'radio':
            if (e.target.className.includes('override')) {
                obj[id] = parseFloat(e.target.dataset.override);
            } else if (
                e.target.type !== 'checkbox' &&
                    typeof e.target.value !== 'undefined'
            ) {
                obj[id] = forceNumber(e.target.value);
            } else {
                obj[id] = e.target.checked;
            }
            break;
        case 'number':
        case 'range':
        case 'button':
            obj[id] = parseFloat(e.target.value);
            break;
        case 'select-one':
            obj[id] = parseInt(e.target.value, 10);
            break;
        case 'textarea':
            obj[id] = e.target.value;
            break;
        default:
            obj[id] = e.target.value;
    }

    if (typeof obj['gNeedsSubmit'] === 'number') {
        // Cast gNeedsSubmit to a boolean, in case it's a number (0 or
        // 1).
        obj['gNeedsSubmit'] = !!parseInt(obj['gNeedsSubmit'], 10);
    }

    if (props) {
        props.updateGraph(obj);
    } else if (this.props) {
        this.props.updateGraph(obj);
    }
};

/**
 * Given a line's slope and y-intercept, return its
 * y-offset at x-value n.
 */
const getOffset = function(slope, y, n) {
    const xpos = (slope * n) + y;
    return xpos - n;
};

/**
 * For a line that's defined as y = mx + b,
 * return its X intercept, given the slope (m)
 * and the Y offset (b).
 */
const getXIntercept = function(m, b) {
    return (-b) / m;
};

/**
 * Given y, m, and x, return b.
 */
const getYIntercept = function(y, m, x) {
    return y - (m * x);
};

/*
 * Force a value into a float that will be acceptable to the Django
 * API's DecimalFields. This is currently capped to 4 decimal places.
 */
const forceFloat = function(n) {
    n = Number(n);
    if (isNaN(n) || typeof n === 'undefined') {
        n = 0;
    }
    return Math.round(n * 10000) / 10000;
};

const forceNumber = function(n) {
    n = Number(n);
    if (isNaN(n) || typeof n === 'undefined') {
        n = 0;
    }
    return n;
};

/**
 * displayGraphType()
 *
 * This function is essentially duplicating the logic of
 * econplayground.main.utils.get_graph_name on the back-end,
 * and ideally we can refactor this out.
 */
const displayGraphType = function(gType) {
    let name = '';
    switch (gType) {
        case 0:
            name = 'Linear Demand and Supply';
            break;
        case 1:
            name = 'Input Markets';
            break;
        case 3:
            name = 'Cobb-Douglas Production Graph';
            break;
        case 5:
            name = 'Consumption-Leisure: Constraint';
            break;
        case 7:
            name = 'Consumption-Saving: Constraint';
            break;
        case 8:
            name = 'Linear Demand and Supply: 3 Functions';
            break;
        case 9:
            name = 'Linear Demand and Supply: Areas';
            break;
        case 10:
            name = 'Input Markets: Areas';
            break;
        case 11:
            name = 'Consumption-Saving: Optimal Choice';
            break;
        case 12:
            name = 'Input-Output Illustrations';
            break;
        case 13:
            name = 'Linear Demand and Supply: 2 Diagrams';
            break;
        case 14:
            name = 'Input Markets: 2 Diagrams';
            break;
        case 15:
            name = 'Consumption-Leisure: Optimal Choice';
            break;
        case 16:
            name = 'Template Graph';
            break;
        case 17:
            name = 'Optimal Choice: Consumption with 2 Goods';
            break;
        case 18:
            name = 'Cost Functions';
            break;
        case 20:
            name = 'Price Elasticity of Demand and Revenue';
            break;
        case 21:
            name = 'Optimal Choice: Cost-Minimizing Production Inputs';
            break;
        case 22:
            name = 'Tax Rate and Revenue';
            break;
        case 23:
            name = 'Taxation in Linear Demand and Supply';
            break;
        case 24:
            name = 'Tax Supply and Demand vs. Tax Revenue';
            break;
        case 25:
            name = 'Linear Demand and Supply - Surplus Policies';
            break;
        case 26:
            name = 'Negative Production Externality - Producer';
            break;
        case 27:
            name = 'Negative Production Externality - Industry';
            break;
        case 28:
            name = 'Positive Externality - Industry';
            break;
        case 29:
            name = 'Monopoly - Uniform Pricing';
            break;
        case 30:
            name = 'Monopoly - First-Degree Price Discrimination';
            break;
        default:
            break;
    }
    return name;
};

const getError = function(obj) {
    let o = null;
    for (o in obj) {
        return `${o}: ${obj[o]}`;
    }

    return 'An error occurred.';
};

/**
 * Processes step buttons for the slope in RangeEditor.
 *
 * Returns a number.
 */
const btnStep = function(val, sign, strength, min, max) {
    min = isNaN(min) ? -999 : min;
    max = isNaN(max) ? 999 : max;
    if (min > max) {
        return NaN;
    }
    val = val + (sign * strength);
    val = val < min ? min : val;
    val = val > max ? max : val;
    return forceFloat(val);
};

export {
    BOARD_HEIGHT, BOARD_WIDTH, GRID_MAJOR, GRID_MINOR,

    authedFetch, getAssessment, getQuestion, getMultipleChoice, getEvaluations,
    getGraph, getGraphId, getCohortId, getTopics, getUserAssignment,
    getL1SubmissionOffset, getL2SubmissionOffset, handleFormUpdate, getOffset,
    getXIntercept, getYIntercept, forceFloat, forceNumber, displayGraphType,
    getError, btnStep
};
