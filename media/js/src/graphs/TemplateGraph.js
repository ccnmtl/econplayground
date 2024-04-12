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

        const f2 = function(x) {
            const scope = {
                x: x
            };

            let func = function() {};
            try {
                func = math.evaluate(me.options.gExpression2, scope);
                window.EconPlayground.fallback2 = me.options.gExpression2;
            } catch (e) {
                func = math.evaluate(window.EconPlayground.fallback2, scope);
            }

            return func;
        };

        const f3 = function(x) {
            const scope = {
                x: x
            };

            let func = function() {};
            try {
                func = math.evaluate(me.options.gExpression3, scope);
                window.EconPlayground.fallback3 = me.options.gExpression3;
            } catch (e) {
                func = math.evaluate(window.EconPlayground.fallback3, scope);
            }

            return func;
        };

        this.board.create('functiongraph', [f], {
            name: 'expression',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l1Color,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        this.board.create('functiongraph', [f2], {
            name: 'expression2',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l2Color,
            recursionDepthLow: 8,
            recursionDepthHigh: 15
        });

        this.board.create('functiongraph', [f3], {
            name: 'expression3',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l3Color,
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
