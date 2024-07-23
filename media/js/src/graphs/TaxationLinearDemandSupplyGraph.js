import {DemandSupplyGraphAUC} from './DemandSupplyGraphAUC.js';

class TaxationLinearDemandSupplyGraph extends DemandSupplyGraphAUC {
    constructor(board, options, defaults) {
        super(board, options, defaults);

        this.center = options.gXAxisMax / 2;
    }
}

export const mkTaxationLinearDemandSupply = function(board, options) {
    options.locked = true;

    // Shade in the two left areas.
    options.gAreaConfiguration = 3;

    options.gShowIntersection = true;
    options.gIntersectionLabel = '(Q^t, p^d)';
    options.gIntersectionHorizLineLabel = 'p^d';
    options.gIntersectionVertLineLabel = 'Q^t';

    let g = new TaxationLinearDemandSupplyGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
