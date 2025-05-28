"""
Graph-specific logic
"""
from abc import ABC


GRAPH_TYPES = (
    (0, 'Linear Demand and Supply'),
    (1, 'Input Markets'),
    (3, 'Cobb-Douglas Production Graph'),
    (5, 'Consumption-Leisure: Constraint'),
    (7, 'Consumption-Saving: Constraint'),
    (8, 'Linear Demand and Supply: 3 Functions'),

    # Area Under Curve graphs
    (9, 'Linear Demand and Supply: Areas'),
    (10, 'Input Markets: Areas'),

    (11, 'Consumption-Saving: Optimal Choice'),
    (15, 'Consumption-Leisure: Optimal Choice'),

    # Joint Graphs
    (12, 'Input-Output Illustrations'),
    (13, 'Linear Demand and Supply: 2 Diagrams'),
    (14, 'Input Markets: 2 Diagrams'),

    (16, 'Template Graph'),

    (17, 'Optimal Choice: Consumption with 2 Goods'),
    (18, 'Cost Functions'),
    (20, 'Price Elasticity of Demand and Revenue'),
    (21, 'Optimal Choice: Cost-Minimizing Production Inputs'),

    (22, 'Tax Rate and Revenue'),
    (23, 'Taxation in Linear Demand and Supply'),
    (24, 'Tax Supply and Demand vs. Tax Revenue'),

    (25, 'Linear Demand and Supply - Surplus Policies'),

    # Externalities
    (26, 'Negative Production Externality - Producer'),
    (27, 'Negative Production Externality - Industry'),
    (28, 'Positive Externality - Industry'),
)


class Graph(ABC):
    name = 'Generic Graph'
    line_actions = [
        'up',
        'down',
        'slope up',
        'slope down',
    ]
    variable_actions = [
        'up',
        'down',
        '<exact value>',
    ]

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'line1': {
                'name': 'Orange line',
                'possible_values': cls.line_actions,
            },

            'line2': {
                'name': 'Blue line',
                'possible_values': cls.line_actions,
            },

            'line1 label': 'Orange line label',
            'line2 label': 'Blue line label',
            'intersectionLabel': 'Intersection label',
            'intersectionHorizLineLabel':
            'Orange-Blue intersection horizontal label',
            'intersectionVertLineLabel':
            'Orange-Blue intersection vertical label',
            'x-axis label': 'X-axis label',
            'y-axis label': 'Y-axis label',
        }


class Graph0(Graph):
    name = GRAPH_TYPES[0][1]
    graph_type = 0


class Graph1(Graph):
    name = GRAPH_TYPES[1][1]
    graph_type = 1


class Graph3(Graph):
    name = GRAPH_TYPES[2][1]
    graph_type = 3

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a5_name': 'Y label',
            'a1_name': 'A label',
            'a1': {
                'name': 'A',
                'possible_values': cls.variable_actions,
            },
            'a3_name': 'K label',
            'a3': {
                'name': 'K',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'α',
                'possible_values': cls.variable_actions,
            },
            'a2_name': 'L label',
            'a2': {
                'name': 'L',
                'possible_values': cls.variable_actions,
            }
        }


class Graph5(Graph):
    name = GRAPH_TYPES[3][1]
    graph_type = 5


class Graph7(Graph):
    name = GRAPH_TYPES[4][1]
    graph_type = 7


class Graph8(Graph):
    name = GRAPH_TYPES[5][1]
    graph_type = 8


class Graph9(Graph):
    graph_type = 9


class Graph10(Graph):
    graph_type = 10


class Graph11(Graph):
    graph_type = 11


class Graph15(Graph):
    graph_type = 15


class Graph12(Graph):
    graph_type = 12


class Graph13(Graph):
    graph_type = 13


class Graph14(Graph):
    graph_type = 14


class Graph16(Graph):
    graph_type = 16


class Graph17(Graph):
    graph_type = 17


class Graph18(Graph):
    graph_type = 18


class Graph20(Graph):
    graph_type = 20


class Graph21(Graph):
    graph_type = 21


class Graph22(Graph):
    graph_type = 22


class Graph23(Graph):
    graph_type = 23


class Graph24(Graph):
    graph_type = 24


class Graph25(Graph):
    graph_type = 25

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'Choke Price',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'Demand Slope',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'Reservation Price',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'Supply Slope',
                'possible_values': cls.variable_actions,
            },
            'a5': {
                'name': 'Global/Minimum/Maximum Price or Production Quota',
                'possible_values': cls.variable_actions,
            },
            'a6': {
                'name': 'Tariff',
                'possible_values': cls.variable_actions,
            },
        }


class Graph26(Graph):
    graph_type = 26


class Graph27(Graph):
    graph_type = 27


class Graph28(Graph):
    graph_type = 28
