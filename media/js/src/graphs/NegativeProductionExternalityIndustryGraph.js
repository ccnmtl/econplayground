import {Graph} from './Graph.js';

export class NegativeProductionExternalityIndustryGraph extends Graph {
}

export const mkNegativeProductionExternalityIndustry = function(board, options) {
    let g = new NegativeProductionExternalityIndustryGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
