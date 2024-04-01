import React from 'react';
import PropTypes from 'prop-types';
import { MathComponent } from 'mathjax-react';
import { create, all } from 'mathjs';

import EditableControl from '../form-components/EditableControl.js';


const math = create(all, {});


export default class TemplateGraphEditor extends React.Component {
    checkFormula(expression) {
        try {
            math.evaluate(expression, { x: 1 });
            return false;
        } catch (e) {
            return true;
        }
    }

    render() {
        return (
            <>
                <div className="d-flex flex-wrap">
                    <div className="row">
                        <div className="col">
                            <label
                                className="form-check-label me-2"
                                htmlFor="gExpression">
                                <MathComponent tex="y = " />
                            </label>
                            <EditableControl
                                id="gExpression"
                                name="Expression"
                                value={this.props.gExpression}
                                valueEditable={true}
                                isInstructor={this.props.isInstructor}
                                disabled={this.props.disabled}
                                updateGraph={this.props.updateGraph} />
                            {
                                this.checkFormula(this.props.gExpression) &&
                                <p className='text-danger mt-2'>Formula Error</p>
                            }
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap mt-2">
                    <div className="row">
                        <div className="col">
                            <label
                                className="form-check-label me-2"
                                htmlFor="gExpression2">
                                <MathComponent tex="y = " />
                            </label>
                            <EditableControl
                                id="gExpression2"
                                name="Expression 2"
                                value={this.props.gExpression2}
                                valueEditable={true}
                                isInstructor={this.props.isInstructor}
                                disabled={this.props.disabled}
                                updateGraph={this.props.updateGraph} />
                            {
                                this.checkFormula(this.props.gExpression2) &&
                                <p className='text-danger mt-2'>Formula Error</p>
                            }
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap mt-2">
                    <div className="row">
                        <div className="col">
                            <label
                                className="form-check-label me-2"
                                htmlFor="gExpression3">
                                <MathComponent tex="y = " />
                            </label>
                            <EditableControl
                                id="gExpression3"
                                name="Expression 3"
                                value={this.props.gExpression3}
                                valueEditable={true}
                                isInstructor={this.props.isInstructor}
                                disabled={this.props.disabled}
                                updateGraph={this.props.updateGraph} />
                            {
                                this.checkFormula(this.props.gExpression3) &&
                                <p className='text-danger mt-2'>Formula Error</p>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

TemplateGraphEditor.propTypes = {
    gType: PropTypes.number,
    updateGraph: PropTypes.func.isRequired,
    isInstructor: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,

    gExpression: PropTypes.string,
    gExpression2: PropTypes.string,
    gExpression3: PropTypes.string,
    gFunctionChoice: PropTypes.number
};
