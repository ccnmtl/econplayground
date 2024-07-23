import {mkDemandSupply} from './DemandSupplyGraph.js';
import {mkDemandSupplyAUC} from './DemandSupplyGraphAUC.js';
import {mkNonLinearDemandSupply} from './NonLinearDemandSupplyGraph.js';
import {mkNonLinearDemandSupplyAUC} from './NonLinearDemandSupplyGraphAUC.js';
import {mkCobbDouglas} from './CobbDouglasGraph.js';
import {mkConsumptionLeisure} from './ConsumptionLeisureGraph.js';
import {
    mkConsumptionLeisureOptimalChoice
} from './ConsumptionLeisureOptimalChoiceGraph.js';
import {mkConsumptionSaving} from './ConsumptionSavingGraph.js';
import {mkOptimalChoice} from './OptimalChoiceGraph.js';
import {mkCostFunctionsTotal} from './CostFunctionsTotalGraph.js';
import {mkCostFunctionsUnit} from './CostFunctionsUnitGraph.js';
import {mkADAS} from './ADASGraph.js';
import {mkTemplate} from './TemplateGraph.js';
import { mkOptimalChoiceConsumption } from './OptimalChoiceConsumption.js';
import { mkRevenueElasticity } from './RevenueElasticityGraph.js';
import {mkOptimalChoiceCostMinimizing} from './OptimalChoiceCostMinimizing.js';
import { mkTaxRevenue } from './TaxRevenueGraph.js';
import {
    mkTaxationLinearDemandSupply
} from './TaxationLinearDemandSupplyGraph.js';

export const graphTypes = [
    // There are some null graph types here because the number of
    // total graphs in the system has been reduced since it was
    // originally designed, and I haven't updated the graph type
    // numerical values to reflect that yet.
    mkDemandSupply, mkNonLinearDemandSupply,
    null, mkCobbDouglas,
    null, mkConsumptionLeisure,
    null, mkConsumptionSaving,
    mkADAS,
    mkDemandSupplyAUC,
    mkNonLinearDemandSupplyAUC,
    mkOptimalChoice,

    // Joint graphs are null here. They don't have their own
    // constructors. Rather, combinations of existing constructors.
    null,
    null,
    null,

    mkConsumptionLeisureOptimalChoice,

    mkTemplate,

    mkOptimalChoiceConsumption,

    mkCostFunctionsTotal, mkCostFunctionsUnit,
    mkRevenueElasticity,
    mkOptimalChoiceCostMinimizing,

    mkTaxRevenue,
    mkTaxationLinearDemandSupply
];
