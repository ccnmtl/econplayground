import React from 'react';
import PropTypes from 'prop-types';
import EditableControl from '../form-components/EditableControl.jsx';
import RangeEditor from '../form-components/RangeEditor.jsx';
import { handleFormUpdate } from '../utils.js';
import { getKatexEl } from '../katexUtils.jsx';

export default class CostFunctionsEditor extends React.Component {
    render() {
        const modes = ['Total', 'Unit'];
        const radioButtons = modes.map((mode, idx) =>
            <div key={idx} className="form-check form-check-inline">
                <input
                    type="radio" id={`functionChoice-${idx}`}
                    className="form-check-input"
                    value={idx}
                    name="gFunctionChoice"
                    checked={this.props.gFunctionChoice === idx}
                    onChange={handleFormUpdate.bind(this)} />
                <label
                    className="form-check-label"
                    htmlFor={`functionChoice-${idx}`}>
                    {mode}
                </label>
            </div>
        );

        return (
            <div>
                {radioButtons}

                <div className="col">
                    <div>
                        {getKatexEl(`Cost= ${this.props.gA1Name} + ${this.props.gA2Name}x + ${this.props.gA3Name}x^2=
                            ${this.props.gA1}+
                            ${this.props.gA2}x+
                            ${this.props.gA3}x^2`)}
                    </div>
                    <div>
                        {getKatexEl(`F_{cost} = ${this.props.gA1Name} = ${this.props.gA1}`)}
                    </div>
                    <div>
                        {getKatexEl(`V_{cost} = ${this.props.gA2Name}x + ${this.props.gA3Name}x^2`)}
                    </div>
                </div>
                <hr />
                {this.props.displaySliders && (
                    <React.Fragment>
                        <div className="mb-2">
                            <label htmlFor="gA1Name">
                                {this.props.isInstructor ? (
                                    <input
                                        type="text"
                                        name="gA1Name"
                                        maxLength="1"
                                        size="1"
                                        className="form-control form-control-sm"
                                        value={this.props.gA1Name}
                                        onChange={handleFormUpdate.bind(this)}
                                    />
                                ) : (
                                    this.props.gA1Name
                                )}
                            </label>
                            <RangeEditor
                                id="gA1"
                                name={this.props.gA1Name}
                                value={this.props.gA1}
                                min={this.props.gA1Min}
                                max={this.props.gA1Max}
                                showMinMaxEditor={true}
                                handler={handleFormUpdate.bind(this)} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="gA2Name">
                                {this.props.isInstructor ? (
                                    <input
                                        type="text"
                                        name="gA2Name"
                                        maxLength="1"
                                        size="1"
                                        className="form-control form-control-sm"
                                        value={this.props.gA2Name}
                                        onChange={handleFormUpdate.bind(this)}
                                    />
                                ) : (
                                    this.props.gA2Name
                                )}
                            </label>
                            <RangeEditor
                                id="gA2"
                                name={this.props.gA2Name}
                                value={this.props.gA2}
                                min={this.props.gA2Min}
                                max={this.props.gA2Max}
                                showMinMaxEditor={true}
                                handler={handleFormUpdate.bind(this)} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="gA3Name">
                                {this.props.isInstructor ? (
                                    <input
                                        type="text"
                                        name="gA3Name"
                                        maxLength="1"
                                        size="1"
                                        className="form-control form-control-sm"
                                        value={this.props.gA3Name}
                                        onChange={handleFormUpdate.bind(this)}
                                    />
                                ) : (
                                    this.props.gA3Name
                                )}
                            </label>
                            <RangeEditor
                                id="gA3"
                                name={this.props.gA3Name}
                                value={this.props.gA3}
                                min={this.props.gA3Min}
                                max={this.props.gA3Max}
                                showMinMaxEditor={true}
                                handler={handleFormUpdate.bind(this)} />
                        </div>

                    </React.Fragment>
                )}
                {this.props.displayLabels && (
                    <>
                        <h3>Labels</h3>
                        <div className="d-flex flex-wrap">
                            <div className="row align-items-end">
                                <div className="col">
                                    <EditableControl
                                        id="gLine1Label"
                                        name="Orange line label"
                                        value={this.props.gLine1Label}
                                        valueEditable={true}
                                        isInstructor={true}
                                        updateGraph={this.props.updateGraph} />
                                </div>
                                <div className="col">
                                    <EditableControl
                                        id="gLine2Label"
                                        name="Blue line label"
                                        value={this.props.gLine2Label}
                                        valueEditable={true}
                                        isInstructor={true}
                                        updateGraph={this.props.updateGraph} />
                                </div>
                                <div className="col">
                                    <EditableControl
                                        id="gLine3Label"
                                        name="Red line label"
                                        value={this.props.gLine3Label}
                                        valueEditable={true}
                                        isInstructor={true}
                                        updateGraph={this.props.updateGraph} />
                                </div>
                                {this.props.gFunctionChoice === 1 && (
                                    <div className="col">
                                        <EditableControl
                                            id="gLine4Label"
                                            name="Green line label"
                                            value={this.props.gLine4Label}
                                            valueEditable={true}
                                            isInstructor={true}
                                            updateGraph={this.props.updateGraph} />
                                    </div>
                                )}
                            </div>
                            <div className="row align-items-end">
                                <div className="col">
                                    <EditableControl
                                        id="gXAxisLabel"
                                        name="X-axis label"
                                        value={this.props.gXAxisLabel}
                                        valueEditable={true}
                                        isInstructor={true}
                                        updateGraph={this.props.updateGraph} />
                                </div>
                                <div className="col">
                                    <EditableControl
                                        id="gYAxisLabel"
                                        name="Y-axis label"
                                        value={this.props.gYAxisLabel}
                                        valueEditable={true}
                                        isInstructor={true}
                                        updateGraph={this.props.updateGraph} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

CostFunctionsEditor.propTypes = {
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number.isRequired,
    gA1Name: PropTypes.string.isRequired,
    gA1Min: PropTypes.number.isRequired,
    gA1Max: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA2Name: PropTypes.string.isRequired,
    gA2Min: PropTypes.number.isRequired,
    gA2Max: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gA3Name: PropTypes.string.isRequired,
    gA3Min: PropTypes.number.isRequired,
    gA3Max: PropTypes.number.isRequired,

    displayLabels: PropTypes.bool.isRequired,
    gLine1Label: PropTypes.string.isRequired,
    gLine2Label: PropTypes.string.isRequired,
    gLine3Label: PropTypes.string.isRequired,
    gLine4Label: PropTypes.string.isRequired,

    gXAxisLabel: PropTypes.string.isRequired,
    gYAxisLabel: PropTypes.string.isRequired,

    gFunctionChoice: PropTypes.number.isRequired,

    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired
};
