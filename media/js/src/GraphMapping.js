/**
 * GraphMapping.js
 *
 * Mapping to and from a graph's react.js state and its
 * json representation in django-rest-framework.
 */
import { forceFloat, forceNumber } from './utils';

/**
 * Returns the current graph settings as a persistable JSON object.
 */
const exportGraph = function(state) {
    let obj = {
        title: state.gTitle,
        summary: state.gSummary,
        instructions: state.gInstructions,
        instructor_notes: state.gInstructorNotes,
        graph_type: state.gType,
        assignment_type: state.gAssignmentType,
        is_published: state.gIsPublished,
        featured: state.gIsFeatured,
        display_feedback: state.gDisplayFeedback,
        display_shadow: state.gDisplayShadow,
        needs_submit: state.gNeedsSubmit,
        topic: state.gTopic,

        show_intersection: state.gShowIntersection,
        intersection_label: state.gIntersectionLabel,

        intersection_2_label: state.gIntersection2Label,
        intersection_3_label: state.gIntersection3Label,

        intersection_horiz_line_label: state.gIntersectionHorizLineLabel,
        intersection_vert_line_label: state.gIntersectionVertLineLabel,
        intersection_2_horiz_line_label: state.gIntersection2HorizLineLabel,
        intersection_2_vert_line_label: state.gIntersection2VertLineLabel,
        intersection_3_horiz_line_label: state.gIntersection3HorizLineLabel,
        intersection_3_vert_line_label: state.gIntersection3VertLineLabel,

        display_intersection_1: state.gDisplayIntersection1,
        display_intersection_2: state.gDisplayIntersection2,
        display_intersection_3: state.gDisplayIntersection3,

        line_1_slope: forceFloat(state.gLine1Slope),
        line_2_slope: forceFloat(state.gLine2Slope),
        line_3_slope: forceFloat(state.gLine3Slope),
        line_4_slope: forceFloat(state.gLine4Slope),
        line_1_offset_x: forceFloat(state.gLine1OffsetX),
        line_1_offset_y: forceFloat(state.gLine1OffsetY),
        line_2_offset_x: forceFloat(state.gLine2OffsetX),
        line_2_offset_y: forceFloat(state.gLine2OffsetY),
        line_3_offset_x: forceFloat(state.gLine3OffsetX),
        line_3_offset_y: forceFloat(state.gLine3OffsetY),
        line_4_offset_x: forceFloat(state.gLine4OffsetX),
        line_4_offset_y: forceFloat(state.gLine4OffsetY),
        line_1_label: state.gLine1Label,
        line_2_label: state.gLine2Label,
        line_3_label: state.gLine3Label,
        line_4_label: state.gLine4Label,

        line_1_dashed: state.gLine1Dashed,
        line_2_dashed: state.gLine2Dashed,
        line_3_dashed: state.gLine3Dashed,
        line_4_dashed: state.gLine4Dashed,

        alpha: forceFloat(state.gAlpha),
        omega: forceFloat(state.gOmega),

        a1: forceFloat(state.gA1),
        a2: forceFloat(state.gA2),
        a3: forceFloat(state.gA3),
        a4: forceFloat(state.gA4),
        a5: forceFloat(state.gA5),

        a: forceFloat(state.gA),
        k: forceFloat(state.gK),
        r: forceFloat(state.gR),
        y1: forceFloat(state.gY1),
        y2: forceFloat(state.gY2),

        x_axis_label: state.gXAxisLabel,
        y_axis_label: state.gYAxisLabel,

        x_axis_2_label: state.gXAxis2Label,
        y_axis_2_label: state.gYAxis2Label,

        // I'm using these A and K fields for the non-linear
        // demand-supply graph and the cobb-douglas graph. The names
        // should be generalized.
        cobb_douglas_a: forceFloat(state.gCobbDouglasA),
        cobb_douglas_k: forceFloat(state.gCobbDouglasK),

        // Used by Cobb-Douglas and Non-Linear Demand-Supply graphs.
        cobb_douglas_a_name: state.gCobbDouglasAName,
        cobb_douglas_k_name: state.gCobbDouglasKName,

        n_name: state.gNName,

        function_choice: forceNumber(state.gFunctionChoice),

        // AUC features
        area_configuration: forceNumber(state.gAreaConfiguration),
        is_area_displayed: state.gIsAreaDisplayed,

        area_a_name: state.gAreaAName,
        area_b_name: state.gAreaBName,
        area_c_name: state.gAreaCName
    };

    if (state.gType === 3 || state.gType === 12) {
        // Don't send all these cobb-douglas related fields if not
        // saving a cobb-douglas graph.
        const cobb = {
            cobb_douglas_l: forceFloat(state.gCobbDouglasL),
            cobb_douglas_l_name: state.gCobbDouglasLName,
            cobb_douglas_alpha: forceFloat(state.gCobbDouglasAlpha),
            cobb_douglas_y_name: state.gCobbDouglasYName
        };
        Object.assign(obj, cobb);
    }

    return obj;
};

/**
 * Import the json graph into the current state.
 */
const importGraph = function(json, obj) {
    const updateObj = {
        gId: json.id,
        gTitle: json.title,
        gSummary: json.summary,
        gInstructions: json.instructions,
        gInstructorNotes: json.instructor_notes,
        gType: json.graph_type,
        gAssignmentType: json.assignment_type,
        gIsPublished: json.is_published,
        gIsFeatured: json.featured,
        gDisplayFeedback: json.display_feedback,
        gDisplayShadow: json.display_shadow,
        gNeedsSubmit: json.needs_submit,
        gTopic: json.topic,

        gShowIntersection: json.show_intersection,
        gDisplayIntersection1: json.display_intersection_1,
        gDisplayIntersection2: json.display_intersection_2,
        gDisplayIntersection3: json.display_intersection_3,
        gIntersectionLabel: json.intersection_label,
        gIntersection2Label: json.intersection_2_label,
        gIntersection3Label: json.intersection_3_label,

        gIntersectionHorizLineLabel: json.intersection_horiz_line_label,
        gIntersectionVertLineLabel: json.intersection_vert_line_label,
        gIntersection2HorizLineLabel: json.intersection_2_horiz_line_label,
        gIntersection2VertLineLabel: json.intersection_2_vert_line_label,
        gIntersection3HorizLineLabel: json.intersection_3_horiz_line_label,
        gIntersection3VertLineLabel: json.intersection_3_vert_line_label,

        gLine1Slope: window.parseFloat(json.line_1_slope),
        gLine2Slope: window.parseFloat(json.line_2_slope),
        gLine3Slope: window.parseFloat(json.line_3_slope),
        gLine4Slope: window.parseFloat(json.line_4_slope),
        gLine1OffsetX: window.parseFloat(json.line_1_offset_x),
        gLine1OffsetY: window.parseFloat(json.line_1_offset_y),
        gLine2OffsetX: window.parseFloat(json.line_2_offset_x),
        gLine2OffsetY: window.parseFloat(json.line_2_offset_y),
        gLine3OffsetX: window.parseFloat(json.line_3_offset_x),
        gLine3OffsetY: window.parseFloat(json.line_3_offset_y),
        gLine4OffsetX: window.parseFloat(json.line_4_offset_x),
        gLine4OffsetY: window.parseFloat(json.line_4_offset_y),
        gLine1Label: json.line_1_label,
        gLine2Label: json.line_2_label,
        gLine3Label: json.line_3_label,
        gLine4Label: json.line_4_label,

        gLine1Dashed: json.line_1_dashed,
        gLine2Dashed: json.line_2_dashed,
        gLine3Dashed: json.line_3_dashed,
        gLine4Dashed: json.line_4_dashed,

        gAlpha: window.parseFloat(json.alpha),
        gOmega: window.parseFloat(json.omega),

        gA1: window.parseFloat(json.a1),
        gA2: window.parseFloat(json.a2),
        gA3: window.parseFloat(json.a3),
        gA4: window.parseFloat(json.a4),
        gA5: window.parseFloat(json.a5),

        gA: window.parseFloat(json.a),
        gK: window.parseFloat(json.k),
        gR: window.parseFloat(json.r),
        gY1: window.parseFloat(json.y1),
        gY2: window.parseFloat(json.y2),

        gXAxisLabel: json.x_axis_label,
        gYAxisLabel: json.y_axis_label,

        gXAxis2Label: json.x_axis_2_label,
        gYAxis2Label: json.y_axis_2_label,

        gCobbDouglasA: window.parseFloat(json.cobb_douglas_a),
        gCobbDouglasAName: json.cobb_douglas_a_name,
        gCobbDouglasL: window.parseFloat(json.cobb_douglas_l),
        gCobbDouglasLName: json.cobb_douglas_l_name,
        gCobbDouglasK: window.parseFloat(json.cobb_douglas_k),
        gCobbDouglasKName: json.cobb_douglas_k_name,
        gCobbDouglasAlpha: window.parseFloat(json.cobb_douglas_alpha),
        gCobbDouglasYName: json.cobb_douglas_y_name,

        gNName: json.n_name,

        gFunctionChoice: json.function_choice,

        // AUC features
        gAreaConfiguration: json.area_configuration,
        gIsAreaDisplayed: json.is_area_displayed,

        gAreaAName: json.area_a_name,
        gAreaBName: json.area_b_name,
        gAreaCName: json.area_c_name
    };

    // When importing a graph for display, save the initial state of
    // everything in the global state separately. These values are
    // never updated through any sort of user interaction. Each
    // attribute will be accessible by appending "Initial" to its
    // name. This is used by both the shadow feature and assessment.
    let initialStateObj = {};
    let key = '';
    for (key in updateObj) {
        initialStateObj[key + 'Initial'] = updateObj[key];
    }

    // The beta value of the Optimal Choice graph defaults to 0.5
    // instead of 0.
    if (updateObj.gType === 11 && updateObj.gA5 === 0) {
        updateObj.gA5 = 0.5;
    }
    // The alpha value of the C-L Optimal Choice graph defaults to 0.5
    // instead of 0.
    if (updateObj.gType === 15 && updateObj.gA3 === 0) {
        updateObj.gA3 = 0.5;
    }

    return obj.setState(Object.assign({}, updateObj, initialStateObj));
};

const defaultEvaluation = {
    // Graph options
    intersection_label: '',
    intersection_2_label: '',
    intersection_3_label: '',

    intersection_horiz_line_label: '',
    intersection_vert_line_label: '',
    intersection2_horiz_line_label: '',
    intersection2_vert_line_label: '',
    intersection3_horiz_line_label: '',
    intersection3_vert_line_label: '',

    line_1_slope: 1,
    line_2_slope: -1,
    line_3_slope: 999,
    line_4_slope: -1,

    line_1_offset_x: 0,
    line_1_offset_y: 0,
    line_2_offset_x: 0,
    line_2_offset_y: 0,
    line_3_offset_x: 0,
    line_3_offset_y: 0,
    line_4_offset_x: 0,
    line_4_offset_y: 0,
    line_1_label: '',
    line_2_label: '',
    line_3_label: '',
    line_4_label: '',
    x_axis_label: '',
    y_axis_label: '',
    x_axis_2_label: '',
    y_axis_2_label: '',

    alpha: 0.3,
    omega: 1,

    a1: 2.5,
    a2: 2,
    a3: 0.5,
    a4: 0,
    a5: 0.5, // used in graph type 11 - beta value

    a: 3,
    k: 2,
    r: 0,
    y1: 0,
    y2: 0,

    cobb_douglas_a: 2,
    cobb_douglas_a_name: 'A',
    cobb_douglas_l: 5,
    cobb_douglas_l_name: 'L',
    cobb_douglas_k: 1,
    cobb_douglas_k_name: 'K',
    cobb_douglas_alpha: 0.65,
    cobb_douglas_y_name: 'Y',

    n_name: 'N',

    area_a_name: 'A',
    area_b_name: 'B',
    area_c_name: 'C'
};

const defaultGraph = {
    // Graph options
    gId: null,
    gType: null,
    gAssignmentType: 0, // Default to "Template graph" - everything editable
    gTitle: '',
    gInstructions: '',
    gInstructorNotes: '',
    gSummary: '',
    gNeedsSubmit: false,
    gShowIntersection: true,
    gDisplayIntersection1: true,
    gDisplayIntersection2: false,
    gDisplayIntersection3: false,
    gDisplayShadow: true,
    gDisplayFeedback: false,
    gIsPublished: false,
    gIsFeatured: false,
    gTopic: null,

    gIntersectionLabel: '',
    gIntersection2Label: '',
    gIntersection3Label: '',

    gIntersectionHorizLineLabel: '',
    gIntersectionVertLineLabel: '',
    gIntersection2HorizLineLabel: '',
    gIntersection2VertLineLabel: '',
    gIntersection3HorizLineLabel: '',
    gIntersection3VertLineLabel: '',

    gLine1Slope: 1,
    gLine2Slope: -1,
    gLine3Slope: 999,
    gLine4Slope: -1,

    gLine1OffsetX: 0,
    gLine1OffsetY: 0,
    gLine2OffsetX: 0,
    gLine2OffsetY: 0,
    gLine3OffsetX: 0,
    gLine3OffsetY: 0,
    gLine4OffsetX: 0,
    gLine4OffsetY: 0,
    gLine1Label: '',
    gLine2Label: '',
    gLine3Label: '',
    gLine4Label: '',
    gLine1Dashed: false,
    gLine2Dashed: false,
    gLine3Dashed: false,
    gXAxisLabel: '',
    gYAxisLabel: '',
    gXAxis2Label: '',
    gYAxis2Label: '',

    gAlpha: 0.3,
    gOmega: 1,

    gA1: 2.5,
    gA2: 2,
    gA3: 0.5,
    gA4: 0,
    gA5: 0.5, // Used in graph type 11 - beta value

    gA: 3,
    gK: 2,
    gR: 0,
    gY1: 0,
    gY2: 0,

    gCobbDouglasA: 2,
    gCobbDouglasAName: 'A',
    gCobbDouglasL: 5,
    gCobbDouglasLName: 'L',
    gCobbDouglasK: 1,
    gCobbDouglasKName: 'K',
    gCobbDouglasAlpha: 0.65,
    gCobbDouglasYName: 'Y',

    gNName: 'N',

    gFunctionChoice: 0,

    gAreaConfiguration: 0,
    gIsAreaDisplayed: true,

    gAreaAName: 'A',
    gAreaBName: 'B',
    gAreaCName: 'C',

    // Use a hard-coded proof-of-concept assessment spreadsheet for
    // now. Eventually, this will be defined using a Google
    // Spreadsheet, or some react-spreadsheet component with its data
    // stored in our database. The details of that aren't so important
    // right now. I'll remove this once I have the graphs displaying
    // feedback and setting scores based on this format here.
    assessment: []
};

export { exportGraph, importGraph, defaultGraph, defaultEvaluation };
