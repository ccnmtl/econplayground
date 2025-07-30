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

    (29, 'Linear Demand and Supply - Monopoly'),
)


class BaseGraph(ABC):
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


class Graph0(BaseGraph):
    name = GRAPH_TYPES[0][1]
    graph_type = 0


class Graph1(BaseGraph):
    name = GRAPH_TYPES[1][1]
    graph_type = 1


class Graph3(BaseGraph):
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


class Graph5(BaseGraph):
    name = GRAPH_TYPES[3][1]
    graph_type = 5

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'Horizontal intercept value: T',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'Real Wage: w',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'Tax Rate: t',
                'possible_values': cls.variable_actions,
            },
        }


class Graph7(BaseGraph):
    name = GRAPH_TYPES[4][1]
    graph_type = 7

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'y₁',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'y₂',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'W',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'r',
                'possible_values': cls.variable_actions,
            },
        }


class Graph8(BaseGraph):
    name = GRAPH_TYPES[5][1]
    graph_type = 8

    @classmethod
    def get_rule_options(cls) -> dict:
        rules = super().get_rule_options()
        rules.update({
            'line3': {
                'name': 'Green line',
                'possible_values': cls.line_actions,
            }
        })
        return rules


class Graph9(BaseGraph):
    graph_type = 9

    @classmethod
    def get_rule_options(cls) -> dict:
        rules = super().get_rule_options()
        rules.update({
            'area_a_name': 'A',
            'area_b_name': 'B',
            'area_c_name': 'C',
        })
        return rules


class Graph10(BaseGraph):
    graph_type = 10

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
            'area_a_name': 'A',
            'area_b_name': 'B',
            'area_c_name': 'C',
            'a1': {
                'name': 'A',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'K',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'N',
                'possible_values': cls.variable_actions,
            },
        }


class Graph11(BaseGraph):
    graph_type = 11

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'y₁',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'y₂',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'W',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'r',
                'possible_values': cls.variable_actions,
            },
            'a5': {
                'name': 'β',
                'possible_values': cls.variable_actions,
            },
        }


class Graph15(BaseGraph):
    graph_type = 15

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'T',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'w',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'α',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 't',
                'possible_values': cls.variable_actions,
            },
        }


class Graph12(BaseGraph):
    graph_type = 12

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
            'a1': {
                'name': 'A',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'K',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'N',
                'possible_values': cls.variable_actions,
            },
        }


class Graph13(BaseGraph):
    graph_type = 13

    @classmethod
    def get_rule_options(cls) -> dict:
        rules = super().get_rule_options()
        rules.update({
            'line3': {
                'name': 'Right Graph: Orange line',
                'possible_values': cls.line_actions,
            },

            'line4': {
                'name': 'Right Graph: Blue line',
                'possible_values': cls.line_actions,
            },
            'line3 label': 'Orange line label',
            'line4 label': 'Blue line label',
            'intersection2Label': 'Intersection label',
            'intersection2HorizLineLabel':
                'Orange-Blue intersection horizontal label',
            'intersection2VertLineLabel':
                'Orange-Blue intersection vertical label',
            'x-axis-2 label': 'X-axis label',
            'y-axis-2 label': 'Y-axis label',
        })
        return rules


class Graph14(BaseGraph):
    graph_type = 14

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
            'a1': {
                'name': 'A',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'K',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'N',
                'possible_values': cls.variable_actions,
            },
        }


class Graph16(BaseGraph):
    graph_type = 16


class Graph17(BaseGraph):
    graph_type = 17

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'px',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'py',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'R',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'α/ρ/a',
                'possible_values': cls.variable_actions,
            },
            'a5': {
                'name': 'β/b',
                'possible_values': cls.variable_actions,
            },
        }


class Graph18(BaseGraph):
    graph_type = 18

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'a',
                'possible_values': cls.variable_actions,
            },
            'a1 label': 'a label',

            'a2': {
                'name': 'b',
                'possible_values': cls.variable_actions,
            },
            'a2 label': 'b label',

            'a3': {
                'name': 'c',
                'possible_values': cls.variable_actions,
            },
            'a3 label': 'c label',

            'line1 label': 'Orange line label',
            'line2 label': 'Blue line label',
            'line3 label': 'Red line label',
            'x-axis label': 'X-axis label',
            'y-axis label': 'Y-axis label',
        }


class Graph20(BaseGraph):
    graph_type = 20

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'b',
                'possible_values': cls.variable_actions,
            },
            'a1 label': 'b label',

            'a2': {
                'name': 'c',
                'possible_values': cls.variable_actions,
            },
            'a2 label': 'c label',

            'a3': {
                'name': 'p',
                'possible_values': cls.variable_actions,
            },
            'a3 label': 'p label',
        }


class Graph21(BaseGraph):
    graph_type = 21

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'w',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'r',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'q',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'α/ρ/a',
                'possible_values': cls.variable_actions,
            },
            'a5': {
                'name': 'β/b',
                'possible_values': cls.variable_actions,
            },
        }


class Graph22(BaseGraph):
    graph_type = 22

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
        }


class Graph23(BaseGraph):
    graph_type = 23

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'Choke Price',
                'possible_values': cls.variable_actions,
            },
            'line_2_slope': {
                'name': 'Demand Slope',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'Reservation Price',
                'possible_values': cls.variable_actions,
            },
            'line_1_slope': {
                'name': 'Supply Slope',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'Unit Tax/Tax Rate',
                'possible_values': cls.variable_actions,
            },
        }


class Graph24(BaseGraph):
    graph_type = 24

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
                'name': 'Unit Tax',
                'possible_values': cls.variable_actions,
            },
        }


class Graph25(BaseGraph):
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


class Graph26(BaseGraph):
    graph_type = 26

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'MB Constant',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'MC Constant',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'MC Slope',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'EMC Constant',
                'possible_values': cls.variable_actions,
            },
            'a5': {
                'name': 'EMC Slope',
                'possible_values': cls.variable_actions,
            },
        }


class Graph27(BaseGraph):
    graph_type = 27

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'MB Constant',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'MB Slope',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'MC Constant',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'MC Slope',
                'possible_values': cls.variable_actions,
            },
            'a5': {
                'name': 'EMC Constant',
                'possible_values': cls.variable_actions,
            },
            'a6': {
                'name': 'EMC Slope',
                'possible_values': cls.variable_actions,
            },
        }


class Graph28(BaseGraph):
    graph_type = 28

    @classmethod
    def get_rule_options(cls) -> dict:
        return {
            'a1': {
                'name': 'MB Constant',
                'possible_values': cls.variable_actions,
            },
            'a2': {
                'name': 'MB Slope',
                'possible_values': cls.variable_actions,
            },
            'a3': {
                'name': 'MC Constant',
                'possible_values': cls.variable_actions,
            },
            'a4': {
                'name': 'MC Slope',
                'possible_values': cls.variable_actions,
            },
            'a5': {
                'name': 'EMC Constant',
                'possible_values': cls.variable_actions,
            },
            'a6': {
                'name': 'EMC Slope',
                'possible_values': cls.variable_actions,
            },
        }
