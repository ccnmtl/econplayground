import React from 'react';
import PropTypes from 'prop-types';
import { MathComponent } from 'mathjax-react';

import EditableControl from '../form-components/EditableControl.js';
import { handleFormUpdate } from '../utils.js';

export default class TemplateGraphEditor extends React.Component {
    render() {
        const func1 = String.raw`MP_N = (1 - \alpha)AK^\alpha N^{-\alpha}`;
        const func2 = String.raw`MP_K = \alpha AK^{\alpha - 1} N^{1 - \alpha}`;

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
                        </div>
                    </div>
                </div>

                <h3 className="mt-3">
                    NLDS Function
                </h3>

                <div className="row">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            aria-label={func1}
                            type="radio"
                            name="gFunctionChoice"
                            id="gFunctionChoice1"
                            onChange={handleFormUpdate.bind(this)}
                            value={0}
                            checked={this.props.gFunctionChoice === 0} />
                        <label
                            className="form-check-label"
                            htmlFor="gFunctionChoice1">
                            <MathComponent tex={func1} />
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            aria-label={func2}
                            type="radio"
                            name="gFunctionChoice"
                            id="gFunctionChoice2"
                            onChange={handleFormUpdate.bind(this)}
                            value={1}
                            checked={this.props.gFunctionChoice === 1} />
                        <label
                            className="form-check-label"
                            htmlFor="gFunctionChoice2">
                            <MathComponent tex={func2} />
                        </label>
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
    gFunctionChoice: PropTypes.number
};
