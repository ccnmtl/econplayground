import React from 'react';
import { getKatexEl } from '../katexUtils.jsx';
import RangeEditor from '../form-components/RangeEditor.jsx';
import Checkbox from '../form-components/Checkbox.jsx';
import EditableControl from '../form-components/EditableControl.jsx';
import { handleFormUpdate } from '../utils.js';

export default class OptimalChoiceConsumptionEditor extends React.Component {
    render() {
        const me = this;

        const formula = 'y_1 = \\frac{R - px * x_1}{py}';

        const functionOptionsLeft = [
            'U(x, y) = x^\\alpha y^\\beta',
            'U(x, y) = x^\\alpha y^{1 - \\alpha}',
            'U(x, y) = (x^\\rho + y^\\rho)^{1 / \\rho}',
            'U(x, y) = \\frac{x^\\delta}{\\delta} + \\frac{y^\\delta}{\\delta}',
        ];
        const functionOptionsRight = [
            'U(x, y) = lnx + lny',
            'U(x, y) = ax + by',
            'U(x, y) = \\min\\{ax, by\\}',
            'U(x, y) = a * lnx + by',
        ];
        const radioButtons = functionOptionsLeft.map((functionKatex, idx) =>
            <div key={idx} className="form-check">
                <input
                    type="radio" id={`functionChoice-${idx}`}
                    className="form-check-input"
                    value={idx}
                    disabled={this.props.gToggle ? false : true}
                    name="gFunctionChoice"
                    checked={this.props.gFunctionChoice === idx}
                    onChange={handleFormUpdate.bind(this)} />
                <label
                    className="form-check-label"
                    htmlFor={`functionChoice-${idx}`}>
                    {getKatexEl(functionKatex)}
                </label>
            </div>
        );

        const radioButtons2 = functionOptionsRight.map(function(functionKatex, idx) {
            const newIdx = idx + functionOptionsLeft.length;
            return (
                <div key={newIdx} className="form-check">
                    <input
                        type="radio" id={`functionChoice-${newIdx}`}
                        className="form-check-input"
                        value={newIdx}
                        disabled={me.props.gToggle ? false : true}
                        name="gFunctionChoice"
                        checked={me.props.gFunctionChoice === newIdx}
                        onChange={handleFormUpdate.bind(me)} />
                    <label
                        className="form-check-label"
                        htmlFor={`functionChoice-${newIdx}`}>
                        {getKatexEl(functionKatex)}
                    </label>
                </div>
            );
        });

        let extraFields = null;
        if (this.props.gToggle) {
            const fields = [
                <>
                    <RangeEditor
                        label="\alpha"
                        id="gA4"
                        value={this.props.gA4}
                        min={0.01}
                        max={5}
                        handler={handleFormUpdate.bind(this)} />

                    <RangeEditor
                        label="\beta"
                        id="gA5"
                        value={this.props.gA5}
                        min={0.01}
                        max={5}
                        handler={handleFormUpdate.bind(this)} />
                </>,
                <>
                    <RangeEditor
                        label="\alpha"
                        id="gA4"
                        value={this.props.gA4}
                        min={0.01}
                        max={0.99}
                        handler={handleFormUpdate.bind(this)} />
                </>,
                <>
                    <RangeEditor
                        label="\rho"
                        id="gA4"
                        value={this.props.gA4}
                        min={-10}
                        max={0.99}
                        handler={handleFormUpdate.bind(this)} />
                </>,
                <>
                    <RangeEditor
                        label="\delta"
                        id="gA4"
                        value={this.props.gA4}
                        min={-10}
                        max={0.99}
                        handler={handleFormUpdate.bind(this)} />
                </>,
                null,
                <>
                    <RangeEditor
                        label="a"
                        id="gA4"
                        value={this.props.gA4}
                        min={0}
                        max={25}
                        handler={handleFormUpdate.bind(this)} />

                    <RangeEditor
                        label="b"
                        id="gA5"
                        value={this.props.gA5}
                        min={0}
                        max={25}
                        handler={handleFormUpdate.bind(this)} />
                </>,
                <>
                    <RangeEditor
                        label="a"
                        id="gA4"
                        value={this.props.gA4}
                        min={0.01}
                        max={25}
                        handler={handleFormUpdate.bind(this)} />

                    <RangeEditor
                        label="b"
                        id="gA5"
                        value={this.props.gA5}
                        min={0.01}
                        max={25}
                        handler={handleFormUpdate.bind(this)} />
                </>,
                <>
                    <RangeEditor
                        label="a"
                        id="gA4"
                        value={this.props.gA4}
                        min={0}
                        max={500}
                        handler={handleFormUpdate.bind(this)} />

                    <RangeEditor
                        label="b"
                        id="gA5"
                        value={this.props.gA5}
                        min={0.01}
                        max={25}
                        handler={handleFormUpdate.bind(this)} />
                </>
            ];

            extraFields = fields[this.props.gFunctionChoice];
        }

        return (
            <div>
                {this.props.isInstructor &&
                    <>
                        {getKatexEl(formula)}
                    </>
                }

                <Checkbox
                    checked={this.props.gToggle}
                    id="gToggle"
                    onChange={handleFormUpdate.bind(this)}
                    text="Enable Utility Function" />

                <div className="row">
                    <div className="col">
                        {radioButtons}
                    </div>
                    <div className="col">
                        {radioButtons2}
                    </div>
                </div>

                {this.props.displaySliders && (
                    <React.Fragment>
                        <RangeEditor
                            label="px"
                            id="gA1"
                            value={this.props.gA1}
                            min={0}
                            max={30}
                            handler={handleFormUpdate.bind(this)} />

                        <RangeEditor
                            label="py"
                            id="gA2"
                            value={this.props.gA2}
                            min={0.01}
                            max={30}
                            handler={handleFormUpdate.bind(this)} />

                        <RangeEditor
                            label="R"
                            id="gA3"
                            value={this.props.gA3}
                            min={0}
                            max={5000}
                            handler={handleFormUpdate.bind(this)} />

                        {extraFields}

                        <hr />
                    </React.Fragment>
                )}

                {this.props.displayLabels && (
                    <div className="d-flex flex-wrap">
                        <div className="row align-items-end">
                            <div className="col">
                                <EditableControl
                                    id="gLine2Label"
                                    name={'Budget line label'}
                                    value={this.props.gLine2Label}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gLine1Label"
                                    name={'U* Line label'}
                                    value={this.props.gLine1Label}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </div>
                        <div className="row align-items-end">
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionLabel"
                                    name={'Optimal point label'}
                                    value={this.props.gIntersectionLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
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
                                    id="gIntersectionLabel"
                                    name="Intersection label"
                                    value={this.props.gIntersectionLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
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
            </div >
        );
    }
}
