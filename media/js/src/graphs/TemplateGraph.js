import { create, all } from 'mathjs';
import {Graph} from './Graph.js';

const math = create(all, {});

/**
 * getFunc
 *
 * Function representing the evaluation of a math expression input
 * by the user, to be used for rendering a functiongraph object in
 * jsxgraph.
 *
 * expression: a string containing a math function on the x scope.
 *
 * fallback: a string to name the variable to place the expression
 * fallback, i.e. latest valid state of the expression.
 *
 * Returns a function.
 */
const getFunc = function(expression, fallback='fallback', x) {
    const scope = {
        x: x
    };

    let func = function() {};
    try {
        func = math.evaluate(expression, scope);
        window.EconPlayground[fallback] = expression;
    } catch (e) {
        func = math.evaluate(window.EconPlayground[fallback], scope);
    }

    return func;
};

export class TemplateGraph extends Graph {
    make() {
        const me = this;

        const f1 = function(x) {
            const result = getFunc(me.options.gExpression, 'fallback', x);

            if (result < 0) {
                return NaN;
            }

            return result;
        };

        const f2 = function(x) {
            const result =  getFunc(me.options.gExpression2, 'fallback2', x);

            if (result < 0) {
                return NaN;
            }

            return result;
        };

        const f3 = function(x) {
            const result =  getFunc(me.options.gExpression3, 'fallback3', x);

            if (result < 0) {
                return NaN;
            }

            return result;
        };

        this.board.create('functiongraph', [f1, 0, 5], {
            name: 'expression',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l1Color
        });

        this.board.create('functiongraph', [f2, 0, 5], {
            name: 'expression2',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l2Color
        });

        this.board.create('functiongraph', [f3, 0, 5], {
            name: 'expression3',
            withLabel: true,
            strokeWidth: 2,
            strokeColor: this.l3Color
        });
    }
}

export const mkTemplate = function(board, options) {
    let g = new TemplateGraph(board, options);
    g.make();
    g.postMake();
    return g;
};
