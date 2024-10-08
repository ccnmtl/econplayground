import React from 'react';
import PropTypes from 'prop-types';
import { getKatexEl } from '../katexUtils.jsx';
import RangeEditor from '../form-components/RangeEditor.jsx';
import EditableControl from '../form-components/EditableControl.jsx';
import { forceFloat, handleFormUpdate } from '../utils.js';

export default class ConsumptionLeisureEditor extends React.Component {
    render() {
        let tex = '';
        if (this.props.gType === 15) {
            tex = String.raw`c = (${this.props.gA1} - f)w(1 - ${this.props.gA4})`;
        } else {
            const n = forceFloat(this.props.gA1 - this.props.gA4);
            tex = `c = (${n} - x)w`;
        }

        return (
            <div>
                {this.props.isInstructor &&
                    <React.Fragment>
                        <h3>Function</h3>
                        <div className="row">
                            <div className="col-auto">
                                {getKatexEl(tex)}
                            </div>
                        </div>
                        <hr />
                    </React.Fragment>
                }

                {this.props.displaySliders && (
                    <React.Fragment>
                        <h3>Slope</h3>
                        <RangeEditor
                            label="\text{Horizontal intercept value: }T"
                            id="gA1"
                            value={this.props.gA1}
                            min={0}
                            max={9}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="\text{Real Wage: }w"
                            id="gA2"
                            value={this.props.gA2}
                            min={0}
                            max={5}
                            handler={handleFormUpdate.bind(this)} />
                        {this.props.gType === 15 && (
                            <RangeEditor
                                label="\text{Rel. Preference: }\alpha"
                                id="gA3"
                                value={this.props.gA3}
                                min={0}
                                max={0.99999}
                                handler={handleFormUpdate.bind(this)} />
                        )}
                        <RangeEditor
                            label="\text{Tax Rate: }t"
                            id="gA4"
                            value={this.props.gA4}
                            min={0}
                            max={0.99999}
                            handler={handleFormUpdate.bind(this)} />
                        <hr />
                    </React.Fragment>
                )}

                {this.props.displayLabels && (
                    <div className="d-flex flex-wrap">
                        <div className="row align-items-end">
                            <div className="col">
                                <EditableControl
                                    id="gLine1Label"
                                    name={'Budget line label'}
                                    value={this.props.gLine1Label}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            {this.props.gType === 15 && (
                                <div className="col">
                                    <EditableControl
                                        id="gIntersectionLabel"
                                        name="Optimal point label"
                                        value={this.props.gIntersectionLabel}
                                        valueEditable={true}
                                        isInstructor={this.props.isInstructor}
                                        updateGraph={this.props.updateGraph}
                                    />
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
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gYAxisLabel"
                                    name="Y-axis label"
                                    value={this.props.gYAxisLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </div>
                        <div className="row align-items-end">
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionHorizLineLabel"
                                    name="Horizontal intersection label"
                                    value={this.props.gIntersectionHorizLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionVertLineLabel"
                                    name="Vertical intersection label"
                                    value={this.props.gIntersectionVertLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {
                    this.props.gType === 15 && this.props.displayLabels && (
                        <div className="d-flex flex-wrap">
                            <div className="row align-items-end">
                                <div className="col">
                                    <EditableControl
                                        id="gIntersection2HorizLineLabel"
                                        name="Optimal point&apos;s horizontal line label"
                                        value={this.props.gIntersection2HorizLineLabel}
                                        valueEditable={true}
                                        isInstructor={this.props.isInstructor}
                                        updateGraph={this.props.updateGraph}
                                    />
                                </div>
                                <div className="col">
                                    <EditableControl
                                        id="gIntersection2VertLineLabel"
                                        name="Optimal point&apos;s vertical line label"
                                        value={this.props.gIntersection2VertLineLabel}
                                        valueEditable={true}
                                        isInstructor={this.props.isInstructor}
                                        updateGraph={this.props.updateGraph}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }

            </div >
        );
    }
}

ConsumptionLeisureEditor.propTypes = {
    gType: PropTypes.number.isRequired,
    gIntersectionLabel: PropTypes.string.isRequired,
    gIntersectionHorizLineLabel: PropTypes.string.isRequired,
    gIntersectionVertLineLabel: PropTypes.string.isRequired,

    gIntersection2HorizLineLabel: PropTypes.string,
    gIntersection2VertLineLabel: PropTypes.string,

    gXAxisLabel: PropTypes.string.isRequired,
    gYAxisLabel: PropTypes.string.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number,
    gA4: PropTypes.number,

    gLine1Label: PropTypes.string.isRequired,

    displayLabels: PropTypes.bool.isRequired,
    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired
};
