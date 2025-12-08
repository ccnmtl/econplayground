import { DemandSupplyGraph, mkDemandSupply } from './DemandSupplyGraph.js';
import {
    LinearDemandSupplySurplus, mkLinearDemandSupplySurplus
} from './LinearDemandSupplySurplus.js';
import {
    DemandSupplyGraphAUC, mkDemandSupplyAUC
} from './DemandSupplyGraphAUC.js';
import {
    NonLinearDemandSupplyGraph, mkNonLinearDemandSupply
} from './NonLinearDemandSupplyGraph.js';
import {
    NonLinearDemandSupplyGraphAUC,
    mkNonLinearDemandSupplyAUC
} from './NonLinearDemandSupplyGraphAUC.js';
import { CobbDouglasGraph, mkCobbDouglas } from './CobbDouglasGraph.js';
import {
    ConsumptionLeisureGraph, mkConsumptionLeisure
} from './ConsumptionLeisureGraph.js';
import {
    ConsumptionLeisureOptimalChoiceGraph,
    mkConsumptionLeisureOptimalChoice
} from './ConsumptionLeisureOptimalChoiceGraph.js';
import {
    ConsumptionSavingGraph, mkConsumptionSaving
} from './ConsumptionSavingGraph.js';
import { OptimalChoiceGraph, mkOptimalChoice} from './OptimalChoiceGraph.js';
import { CostFunctionsGraph, mkCostFunctions } from './CostFunctionsGraph.js';
import { ADASGraph, mkADAS } from './ADASGraph.js';
import { TemplateGraph, mkTemplate } from './TemplateGraph.js';
import {
    MonopolyUniformPricingGraph, mkMonopolyUniformPricing
} from './MonopolyUniformPricingGraph.js';
import {
    MonopolyFirstDegreePriceDiscriminationGraph,
    mkMonopolyFirstDegreePriceDiscrimination
} from './MonopolyFirstDegreePriceDiscriminationGraph.js';
import {
    OptimalChoiceConsumptionGraph,
    mkOptimalChoiceConsumption
} from './OptimalChoiceConsumption.js';
import {
    RevenueElasticityGraph,
    mkRevenueElasticity
} from './RevenueElasticityGraph.js';
import {
    OptimalChoiceCostMinimizingGraph,
    mkOptimalChoiceCostMinimizing
} from './OptimalChoiceCostMinimizing.js';
import { TaxRevenueGraph, mkTaxRevenue } from './TaxRevenueGraph.js';
import {
    TaxationLinearDemandSupplyGraph,
    mkTaxationLinearDemandSupply
} from './TaxationLinearDemandSupplyGraph.js';
import {
    NegativeProductionExternalityProducerGraph,
    mkNegativeProductionExternalityProducer
} from './NegativeProductionExternalityProducerGraph.js';
import {
    NegativeProductionExternalityIndustryGraph,
    mkNegativeProductionExternalityIndustry
} from './NegativeProductionExternalityIndustryGraph.js';
import {
    PositiveExternalityIndustryGraph,
    mkPositiveExternalityIndustry
} from './PositiveExternalityIndustryGraph.js';
import {
    InternationalTradeAndTariffsGraph,
    mkInternationalTradeAndTariffs
} from './InternationalTradeAndTariffsGraph.js';


export const isJointGraph = function(graphType) {
    return [12, 13, 14, 24].includes(graphType);
};

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

    mkCostFunctions, null,
    mkRevenueElasticity,
    mkOptimalChoiceCostMinimizing,

    mkTaxRevenue,
    mkTaxationLinearDemandSupply,
    mkTaxRevenue,

    mkLinearDemandSupplySurplus,

    mkNegativeProductionExternalityProducer,
    mkNegativeProductionExternalityIndustry,
    mkPositiveExternalityIndustry,
    mkMonopolyUniformPricing,
    mkMonopolyFirstDegreePriceDiscrimination,

    mkInternationalTradeAndTariffs
];

/**
 * Given a graph type, return its class constructor.
 */
export const getGraphClass = function(graphType) {
    const graphClass = [
        DemandSupplyGraph, NonLinearDemandSupplyGraph,
        null, CobbDouglasGraph,
        null, ConsumptionLeisureGraph,
        null, ConsumptionSavingGraph,
        ADASGraph, DemandSupplyGraphAUC,
        NonLinearDemandSupplyGraphAUC,
        OptimalChoiceGraph,

        // Joint graphs
        // 12
        NonLinearDemandSupplyGraph,
        // 13
        DemandSupplyGraph,
        // 14
        NonLinearDemandSupplyGraph,

        ConsumptionLeisureOptimalChoiceGraph,
        TemplateGraph,
        OptimalChoiceConsumptionGraph,
        CostFunctionsGraph,
        RevenueElasticityGraph,
        OptimalChoiceCostMinimizingGraph,

        TaxRevenueGraph,
        TaxationLinearDemandSupplyGraph,
        TaxRevenueGraph,

        LinearDemandSupplySurplus,

        // Externalities
        NegativeProductionExternalityProducerGraph,
        NegativeProductionExternalityIndustryGraph,
        PositiveExternalityIndustryGraph,
        MonopolyUniformPricingGraph,
        MonopolyFirstDegreePriceDiscriminationGraph,
        InternationalTradeAndTariffsGraph
    ][graphType];

    return graphClass;
};
