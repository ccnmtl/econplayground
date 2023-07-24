import {mkDemandSupply} from './DemandSupplyGraph.js';
import {mkDemandSupplyAUC} from './DemandSupplyGraphAUC.js';
import {mkNonLinearDemandSupply} from './NonLinearDemandSupplyGraph.js';
import {mkNonLinearDemandSupplyAUC} from './NonLinearDemandSupplyGraphAUC.js';
import {mkCobbDouglas} from './CobbDouglasGraph.js';
import {mkConsumptionLeisure} from './ConsumptionLeisureGraph.js';
import {mkConsumptionLeisureOptimalChoice} from './ConsumptionLeisureOptimalChoiceGraph.js';
import {mkConsumptionSaving} from './ConsumptionSavingGraph.js';
import {mkOptimalChoice} from './OptimalChoiceGraph.js';
import {mkADAS} from './ADASGraph.js';

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

    mkConsumptionLeisureOptimalChoice
];
