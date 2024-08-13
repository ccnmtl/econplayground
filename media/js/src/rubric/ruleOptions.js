import {DemandSupplyGraph} from '../graphs/DemandSupplyGraph.js';
import {
    NonLinearDemandSupplyGraph
} from '../graphs/NonLinearDemandSupplyGraph.js';
import {CobbDouglasGraph} from '../graphs/CobbDouglasGraph.js';
import {ConsumptionLeisureGraph} from '../graphs/ConsumptionLeisureGraph.js';
import {ConsumptionSavingGraph} from '../graphs/ConsumptionSavingGraph.js';
import {ADASGraph} from '../graphs/ADASGraph.js';
import {DemandSupplyGraphAUC} from '../graphs/DemandSupplyGraphAUC.js';
import {
    NonLinearDemandSupplyGraphAUC
} from '../graphs/NonLinearDemandSupplyGraphAUC.js';
import {OptimalChoiceGraph} from '../graphs/OptimalChoiceGraph.js';
import {
    ConsumptionLeisureOptimalChoiceGraph
} from '../graphs/ConsumptionLeisureOptimalChoiceGraph.js';
import {OptimalChoiceConsumptionGraph} from '../graphs/OptimalChoiceConsumption.js';

// Type 12
const inputOutputIllustrationsOptions = [
    {
        name: 'Cobb-Douglas A',
        value: 'cobb_douglas_a'
    },
    {
        name: 'Cobb-Douglas K',
        value: 'cobb_douglas_k'
    },
    {
        name: 'Cobb-Douglas Alpha',
        value: 'cobb_douglas_alpha'
    },
    {
        name: 'Cobb-Douglas L',
        value: 'cobb_douglas_l'
    },
    {
        name: 'Orange line slope',
        value: 'line_1_slope'
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
];

// Type 13
const linearDemandSupplyTwoDiagramsOptions = [
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
        name: 'Orange line 2',
        value: 'line3',
    },
    {
        name: 'Blue line 2',
        value: 'line4',
    },
    {
        name: 'Orange line label',
        value: 'line_3_label'
    },
    {
        name: 'Blue line label',
        value: 'line_4_label'
    },
    {
        name: 'X-axis label',
        value: 'x_axis_2_label'
    },
    {
        name: 'Y-axis label',
        value: 'y_axis_2_label'
    },
    {
        name: 'Intersection point label',
        value: 'intersection_2_label'
    },
    {
        name: 'Intersection\'s horizontal line label',
        value: 'intersection_2_horiz_line_label'
    },
    {
        name: 'Intersection\'s vertical line label',
        value: 'intersection_2_vert_line_label'
    },
    {
        name: 'Orange line slope',
        value: 'line_3_slope'
    },
    {
        name: 'Blue line slope',
        value: 'line_4_slope'
    },
];

// Type 17
const inputMarketsTwoDiagramsOptions = [
    {
        name: 'px',
        value: 'a1',
    },
    {
        name: 'py',
        value: 'a2',
    },
    {
        name: 'R',
        value: 'a3'
    },
    {
        name: 'α (alpha)',
        value: 'a4'
    },
    {
        name: 'β (beta)',
        value: 'a5'
    },
    {
        name: 'Budget Line',
        value: 'line_1_label'
    },
    {
        name: 'U_star',
        value: 'line_2_label'
    },
    {
        name: 'Optimal Bundle',
        value: 'intersection_label'
    },
    {
        name: 'x_star',
        value: 'intersection_horiz_line_label'
    },
    {
        name: 'y_star',
        value: 'intersection_vert_line_label'
    },
];

/**
 * getRuleOptions
 *
 * Get the appropriate rule options based on graph type.
 */
const getRuleOptions = (graphType) => {
    switch (graphType) {
        case 0:
            return DemandSupplyGraph.getRuleOptions();
        case 1:
            return NonLinearDemandSupplyGraph.getRuleOptions();
        case 3:
            return CobbDouglasGraph.getRuleOptions();
        case 5:
            return ConsumptionLeisureGraph.getRuleOptions();
        case 7:
            return ConsumptionSavingGraph.getRuleOptions();
        case 8:
            return ADASGraph.getRuleOptions();

            // AUC Graphs
        case 9:
            return DemandSupplyGraphAUC.getRuleOptions();
        case 10:
            return NonLinearDemandSupplyGraphAUC.getRuleOptions();
        case 11:
            return OptimalChoiceGraph.getRuleOptions();
        case 15:
            return ConsumptionLeisureOptimalChoiceGraph.getRuleOptions();

            // Joint graphs
        case 12:
            return inputOutputIllustrationsOptions;
        case 13:
            return linearDemandSupplyTwoDiagramsOptions;
        case 14:
            return inputMarketsTwoDiagramsOptions;
        case 17:
            return OptimalChoiceConsumptionGraph.getRuleOptions();

        default:
            return [];
    }
};

export { getRuleOptions };
