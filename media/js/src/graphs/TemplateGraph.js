import {Graph} from './Graph.js';

export class TemplateGraph extends Graph {
    make() {
    }
}

export const mkTemplate = function(board, options) {
    let g = new TemplateGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
