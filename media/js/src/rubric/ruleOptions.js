// Graph type 0
const linearDemandOptions = [
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

// Graph type 1
const inputMarketsOptions = [
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

// Graph type 3
const cobbDouglasOptions = [
    {
        name: 'Intersection point label',
        value: 'intersection_label'
    },
    {
        name: 'Y label',
        value: 'cobb_douglas_y_name'
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
        name: 'L label',
        value: 'cobb_douglas_l_name'
    },
    {
        name: 'A',
        value: 'cobb_douglas_a'
    },
    {
        name: 'K',
        value: 'cobb_douglas_k'
    },
    {
        name: 'Alpha (α)',
        value: 'cobb_douglas_alpha'
    },
    {
        name: 'L',
        value: 'cobb_douglas_l'
    }
];

// Graph type 9
// Linear Demand and Supply: Areas
const linearDemandAreasOptions = [
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
    },
    {
        name: 'Area A label',
        value: 'area_a_name'
    },
    {
        name: 'Area B label',
        value: 'area_b_name'
    },
    {
        name: 'Area C label',
        value: 'area_c_name'
    },
    {
        name: 'Area configuration',
        value: 'area_configuration'
    },
];

// Graph type 10
const inputMarketsAreasOptions = [
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
    },
    {
        name: 'Area A label',
        value: 'area_a_name'
    },
    {
        name: 'Area B label',
        value: 'area_b_name'
    },
    {
        name: 'Area C label',
        value: 'area_c_name'
    },
    {
        name: 'Area configuration',
        value: 'area_configuration'
    }
];

/**
 * getRuleOptions
 *
 * Get the appropriate rule options based on graph type.
 */
const getRuleOptions = (graphType) => {
    switch (graphType) {
        case 0:
            return linearDemandOptions;
        case 1:
            return inputMarketsOptions;
        case 3:
            return cobbDouglasOptions;
        case 9:
            return linearDemandAreasOptions;
        case 10:
            return inputMarketsAreasOptions;
        default:
            return [];
    }
};

export { getRuleOptions };
