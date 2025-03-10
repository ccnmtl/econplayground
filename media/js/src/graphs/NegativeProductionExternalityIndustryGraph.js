import {Graph} from './Graph.js';

export class NegativeProductionExternalityIndustryGraph extends Graph {
    static getGraphPane(gFunctionChoice) {
        return [
            {
                label: 'Unregulated Output Q*',
                color: 'red',
                value: 400
            },
            {
                label: 'Unregulated Price P*',
                color: 'red',
                value: 100
            },
            {
                label: 'Socially Desirable Output q<sup>soc</sup>',
                color: 'orange',
                value: 300
            },
            {
                label: 'Socially Desirable Price P<sup>soc</sup>',
                color: 'orange',
                value: 112.5
            },
        ];
    }
}

export const mkNegativeProductionExternalityIndustry = function(board, options) {
    let g = new NegativeProductionExternalityIndustryGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
