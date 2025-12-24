import React from 'react';
import { getKatexEl } from '../katexUtils.jsx';
import RangeEditor from '../form-components/RangeEditor.jsx';
import EditableControl from '../form-components/EditableControl.jsx';
import { handleFormUpdate } from '../utils.js';

export default class ConsumptionSavingEditor extends React.Component {
    render() {
        const tex = String.raw`c_2 = y_2 + (1 + r) (y_1 + W - c_1)`;

        return (
            <div>
                {this.props.isInstructor &&
                    <React.Fragment>
                        <h3>Function</h3>
                        <div className="row ml-2 mb-2">
                            {getKatexEl(tex)}
                        </div>
                    </React.Fragment>
                }
                <div className="form-check ml-2">
                    <label className="form-check-label">
                        <input
                            id="gShowIntersection"
                            className="form-check-input"
                            type="checkbox"
                            onChange={handleFormUpdate.bind(this)}
                            checked={this.props.gShowIntersection} />
                        Show endowment point
                    </label>
                </div>
                <hr />

                {this.props.displaySliders && (
                    <React.Fragment>
                        <h3>Slope</h3>
                        <RangeEditor
                            label="y_1"
                            id="gA1"
                            value={this.props.gA1}
                            min={0}
                            max={5}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="y_2"
                            id="gA2"
                            value={this.props.gA2}
                            min={0}
                            max={5}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="W"
                            id="gA3"
                            value={this.props.gA3}
                            min={-5}
                            max={5}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="r"
                            id="gA4"
                            value={this.props.gA4}
                            min={-1}
                            max={10}
                            handler={handleFormUpdate.bind(this)} />
                        {this.props.gType === 11 && (
                            <RangeEditor
                                label="\beta"
                                id="gA5"
                                value={this.props.gA5}
                                min={0}
                                max={1}
                                handler={handleFormUpdate.bind(this)} />
                        )}
                        <hr />
                    </React.Fragment>
                )}
                {this.props.displayLabels && (
                    <React.Fragment>
                        <h3>Labels</h3>
                        <div className="row align-items-end">
                            <div className="col">
                                <EditableControl
                                    id="gLine1Label"
                                    name="Orange line label"
                                    value={this.props.gLine1Label}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                {this.props.gType === 11 && (
                                    <EditableControl
                                        id="gLine2Label"
                                        name="Blue line label"
                                        value={this.props.gLine2Label}
                                        valueEditable={true}
                                        isInstructor={this.props.isInstructor}
                                        updateGraph={this.props.updateGraph}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="row align-items-end">
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionLabel"
                                    name="Endowment point label"
                                    value={this.props.gIntersectionLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionHorizLineLabel"
                                    name="Endowment point&apos;s horizontal line label"
                                    value={this.props.gIntersectionHorizLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionVertLineLabel"
                                    name="Endowment point&apos;s vertical line label"
                                    value={this.props.gIntersectionVertLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </div>
                        {this.props.gType === 11 && (
                            <React.Fragment>
                                <div className="row align-items-end">
                                    <div className="col">
                                        <EditableControl
                                            id="gIntersection2Label"
                                            name="Optimal point label"
                                            value={this.props.gIntersection2Label}
                                            valueEditable={true}
                                            isInstructor={this.props.isInstructor}
                                            updateGraph={this.props.updateGraph}
                                        />
                                    </div>
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
                                <div className="row align-items-end">
                                    <div className="col">
                                        <EditableControl
                                            id="gIntersection3HorizLineLabel"
                                            name="Orange line&apos;s horizontal intercept label"
                                            value={this.props.gIntersection3HorizLineLabel}
                                            valueEditable={true}
                                            isInstructor={this.props.isInstructor}
                                            updateGraph={this.props.updateGraph}
                                        />
                                    </div>
                                    <div className="col">
                                        <EditableControl
                                            id="gIntersection3VertLineLabel"
                                            name="Orange line&apos;s vertical intercept label"
                                            value={this.props.gIntersection3VertLineLabel}
                                            valueEditable={true}
                                            isInstructor={this.props.isInstructor}
                                            updateGraph={this.props.updateGraph}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
        );
    }
}
