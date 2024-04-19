import React from 'react';
import PropTypes from 'prop-types';
import { MathJaxProvider, MathJaxFormula } from 'mathjax3-react';
import { create, all } from 'mathjs';

import {handleFormUpdate} from '../utils.js';


const math = create(all, {});


export default class TemplateGraphEditor extends React.Component {
    /**
     * checkFormula()
     *
     * Check that the given expression (as a string) is a valid
     * expression with the x scope.
     *
     * Returns a boolean, true if valid.
     */
    checkFormula(expression) {
        try {
            math.evaluate(expression, { x: 1 });
            return true;
        } catch (e) {
            return false;
        }
    }

    renderExpressionInput(index=1, value) {
        let name = 'Expression';
        if (index > 1) {
            name = `Expression${index}`;
        }

        const isInvalid = !this.checkFormula(value);
        let invalidClass = '';
        if (isInvalid) {
            invalidClass = 'is-invalid';
        }

        return (
            <div className="d-flex flex-column mb-2">
                <div className="row">
                    <label className="w-100" htmlFor={`g${name}`}>
                        {`Expression ${index}`}
                    </label>
                    <div className="col d-flex">

                        <label
                            className="form-check-label me-2 flex-shrink-1 d-flex align-self-center"
                            htmlFor={`g${name}`}>
                            <MathJaxProvider>
                                <MathJaxFormula formula="$$y = $$" />
                            </MathJaxProvider>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${invalidClass}`}
                            id={`g${name}`}
                            name={name}
                            defaultValue={value}
                            onBlur={handleFormUpdate.bind(this)}
                            disabled={this.props.disabled} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <>
                {this.renderExpressionInput(1, this.props.gExpression)}
                {this.renderExpressionInput(2, this.props.gExpression2)}
                {this.renderExpressionInput(3, this.props.gExpression3)}
            </>
        );
    }
}

TemplateGraphEditor.propTypes = {
    gType: PropTypes.number,
    updateGraph: PropTypes.func.isRequired,
    disabled: PropTypes.bool,

    gExpression: PropTypes.string,
    gExpression2: PropTypes.string,
    gExpression3: PropTypes.string,
    gFunctionChoice: PropTypes.number
};
