import {Graph} from './Graph.js';

export class NegativeProductionExternalityProducerGraph extends Graph {
}

export const mkNegativeProductionExternalityProducer = function(board, options) {
    let g = new NegativeProductionExternalityProducerGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
