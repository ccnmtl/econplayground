import {Graph} from './Graph.js';

export class PositiveExternalityIndustryGraph extends Graph {
}

export const mkPositiveExternalityIndustry = function(board, options) {
    let g = new PositiveExternalityIndustryGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
