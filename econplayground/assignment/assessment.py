from typing import List, Dict


LINE_COLORS = ['Orange', 'Blue', 'Red']


def line_assessment_names(line: int) -> List[Dict]:
    line_color = LINE_COLORS[line - 1]

    return [
        {
            'name': '{} line position'.format(line_color),
            'value': 'line_{}_offset_y'.format(line),
            'values': [
                {
                    'name': 'Up ↑',
                    'value': 1,
                },
                {
                    'name': 'Down ↓',
                    'value': -1,
                }
            ],
        },
        {
            'name': '{} line slope'.format(line_color),
            'value': 'line_{}_slope'.format(line),
            'values': [
                {
                    'name': 'Increase ↑',
                    'value': 1,
                },
                {
                    'name': 'Decrease ↓',
                    'value': -1,
                }
            ],
        }
    ]


def build_assessment_structure() -> List[Dict]:
    """
    Make structure for assessment management UI. The form fields are
    derived off this data.
    """
    return [
        {
            'name': 'Orange line',
            'value': 'line1',
            'names': line_assessment_names(1),
        },
        {
            'name': 'Blue line',
            'value': 'line2',
            'names': line_assessment_names(2),
        },
        {
            'name': 'Red line',
            'value': 'line3',
            'names': line_assessment_names(3),
        },
        {
            'name': 'Label',
            'value': 'label',
            'names': [
                {
                    'name': 'Orange line label',
                    'value': 'line_1_label'
                },
                {
                    'name': 'Blue line label',
                    'value': 'line_2_label'
                },
                {
                    'name': 'X-axis label',
                    'value': 'x_axis_label'
                },
                {
                    'name': 'Y-axis label',
                    'value': 'y_axis_label'
                },
                {
                    'name': 'Intersection point label',
                    'value': 'intersection_label'
                },
                {
                    'name': 'Intersection\'s horizontal line label',
                    'value': 'intersection_horiz_line_label'
                },
                {
                    'name': 'Intersection\'s vertical line label',
                    'value': 'intersection_vert_line_label'
                }
            ],
        },
        {
            'name': 'Parameter',
            'value': 'parameter',
            'names': [
                {
                    'name': 'Alpha (α)',
                    'value': 'alpha'
                }
            ],
        },
    ]
