import { create, all } from 'mathjs';
import {Graph} from './Graph.js';

const math = create(all, {});

export class TemplateGraph extends Graph {
    make() {
        const me = this;
        const f = function(x) {
            const scope = {
                x: x
            };

            let func = function() {};
            try {
                func = math.evaluate(me.options.gExpression, scope);
                window.EconPlayground.fallback = me.options.gExpression;
            } catch (e) {
                func = math.evaluate(window.EconPlayground.fallback, scope);
            }

            return func;
        };

        this.board.create('functiongraph', [f], {
            name: 'expression',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.options.gType === 12 ?
                this.l2Color : this.l1Color,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });
    }
}

export const mkTemplate = function(board, options) {
    let g = new TemplateGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
