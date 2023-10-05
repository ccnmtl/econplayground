const LINE_COLORS = ['Orange', 'Blue', 'Red'];

const lineAssessmentNames = (line) => {
    const lineColor = LINE_COLORS[line - 1];

    return [
        {
            'name': `${lineColor} line`,
            'value': `line_${line}`,
            'values': [
                {
                    'name': 'Up ↑',
                    'value': 1,
                },
                {
                    'name': 'Down ↓',
                    'value': -1,
                }
            ]
        }
    ];
};

const getRuleOptions = () => {
    return [
        {
            name: 'Orange line',
            value: 'line1',
            names: lineAssessmentNames(1),
        },
        {
            name: 'Blue line',
            value: 'line2',
            names: lineAssessmentNames(2),
        },
        {
            name: 'Red line',
            value: 'line3',
            names: lineAssessmentNames(3),
        },
        {
            name: 'Label',
            value: 'label',
            names: [
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
                }
            ],
        },
        {
            name: 'Parameter',
            value: 'parameter',
            names: [
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
                },
            ],
        },
    ];
};

export { getRuleOptions };
