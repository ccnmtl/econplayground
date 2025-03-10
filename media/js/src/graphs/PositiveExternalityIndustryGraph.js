import {Graph} from './Graph.js';

export class PositiveExternalityIndustryGraph extends Graph {
    static getGraphPane(gFunctionChoice) {
        return [
            {
                label: 'Unregulated Output Q*',
                color: 'red',
                value: 240
            },
            {
                label: 'Unregulated Price P*',
                color: 'red',
                value: 120
            },
            {
                label: 'Socially Desirable Output q<sup>soc</sup>',
                color: 'orange',
                value: 266.667
            },
            {
                label: 'Socially Desirable Price P<sup>soc</sup>',
                color: 'orange',
                value: 133.333
            },
        ];
    }
}

export const mkPositiveExternalityIndustry = function(board, options) {
    let g = new PositiveExternalityIndustryGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
