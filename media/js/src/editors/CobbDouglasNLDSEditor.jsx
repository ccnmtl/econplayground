import React from 'react';
import { getKatexEl } from '../katexUtils.jsx';
import RangeEditor from '../form-components/RangeEditor.jsx';
import EditableControl from '../form-components/EditableControl.jsx';
import { handleFormUpdate } from '../utils.js';

export default class CobbDouglasNLDSEditor extends React.Component {
    render() {
        let tex = String.raw`= ${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^\alpha ${this.props.gCobbDouglasLName}^{1 - \alpha}`;

        const func1 = String.raw`MP_${this.props.gNName} = (1 - \alpha)${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^\alpha ${this.props.gNName}^{-\alpha}`;
        const func2 = String.raw`MP_${this.props.gCobbDouglasKName} = \alpha ${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^{\alpha - 1} ${this.props.gNName}^{1 - \alpha}`;

        if (!this.props.isInstructor) {
            tex = String.raw`${this.props.gCobbDouglasYName} ${tex}`;
        }

        return (
            <div>
                <h3>Functions</h3>
                <blockquote className="ml-2"><em>
                    This is a projection of the Cobb-Douglas function
                    with {this.props.gCobbDouglasLName} plotted along
                    the X-axis.
                </em></blockquote>
                <div className="row">
                    {this.props.isInstructor && (
                        <div className="col">
                            <input
                                type="text"
                                className="form-control form-control-sm mr-2"
                                name="gCobbDouglasYName"
                                value={this.props.gCobbDouglasYName}
                                maxLength="1"
                                size="1"
                                onChange={handleFormUpdate.bind(this)}
                            />
                        </div>
                    )}
                    <div className="col">
                        {getKatexEl(tex)}
                    </div>
                </div>

                {this.props.isInstructor && !this.props.hideFunctionChoice && (
                    <>
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
                                <label className="form-check-label" htmlFor="gFunctionChoice1">
                                    {getKatexEl(func1)}
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
                                <label className="form-check-label" htmlFor="gFunctionChoice2">
                                    {getKatexEl(func2)}
                                </label>
                            </div>
                        </div>
                    </>
                )
                }
                <hr />

                {
                    this.props.displaySliders && (
                        <React.Fragment>
                            <h3>Slope</h3>
                            <label className="m-0" htmlFor="gCobbDouglasA">
                                {this.props.isInstructor ? (
                                    <input type="text"
                                        name="gCobbDouglasAName"
                                        maxLength="1"
                                        size="1"
                                        className="form-control form-control-sm"
                                        value={this.props.gCobbDouglasAName}
                                        onChange={handleFormUpdate.bind(this)}
                                    />
                                ) : (
                                    this.props.gCobbDouglasAName
                                )}
                            </label>
                            <RangeEditor
                                id="gCobbDouglasA"
                                value={this.props.gCobbDouglasA}
                                handler={handleFormUpdate.bind(this)}
                                min={0} />
                            <label className="m-0" htmlFor="gCobbDouglasK">
                                {this.props.isInstructor ? (
                                    <input type="text"
                                        name="gCobbDouglasKName"
                                        maxLength="1"
                                        size="1"
                                        className="form-control form-control-sm"
                                        value={this.props.gCobbDouglasKName}
                                        onChange={handleFormUpdate.bind(this)}
                                    />
                                ) : (
                                    this.props.gCobbDouglasKName
                                )}
                            </label>
                            <RangeEditor
                                id="gCobbDouglasK"
                                value={this.props.gCobbDouglasK}
                                handler={handleFormUpdate.bind(this)}
                                min={0} />
                            <RangeEditor
                                label="\alpha"
                                id="gCobbDouglasAlpha"
                                value={this.props.gCobbDouglasAlpha}
                                handler={handleFormUpdate.bind(this)}
                                min={0}
                                max={1}
                                showMinMax={true}
                            />
                            <label className="m-0" htmlFor="gCobbDouglasL">
                                {this.props.isInstructor ? (
                                    <input type="text"
                                        name="gCobbDouglasLName"
                                        maxLength="1"
                                        size="1"
                                        className="form-control form-control-sm"
                                        value={this.props.gCobbDouglasLName}
                                        onChange={handleFormUpdate.bind(this)}
                                    />
                                ) : (
                                    this.props.gCobbDouglasLName
                                )}
                            </label>
                            <RangeEditor
                                id="gCobbDouglasL"
                                value={this.props.gCobbDouglasL}
                                handler={handleFormUpdate.bind(this)}
                                min={0}
                                max={10} />
                            <RangeEditor
                                label="\text{Orange line slope}"
                                id="gLine1Slope"
                                value={this.props.gLine1Slope}
                                min={0}
                                showOverrideButton={true}
                                overrideLabel='Vertical'
                                overrideValue={999}
                                showOverride2Button={true}
                                override2Label='Horizontal'
                                override2Value={0}
                                handler={handleFormUpdate.bind(this)}
                                note="This variable is plotted along the X-axis."
                                showNote={this.props.isInstructor} />
                            <hr />
                        </React.Fragment>
                    )
                }

                {
                    this.props.displayLabels && (
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
                                    <EditableControl
                                        id="gLine2Label"
                                        name="Blue line label"
                                        value={this.props.gLine2Label}
                                        valueEditable={true}
                                        isInstructor={this.props.isInstructor}
                                        updateGraph={this.props.updateGraph}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }

                {
                    this.props.displayLabels && (
                        <div className="row align-items-end">
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionLabel"
                                    name="Intersection point label"
                                    value={this.props.gIntersectionLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionHorizLineLabel"
                                    name="Intersection&apos;s horizontal line label"
                                    value={this.props.gIntersectionHorizLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionVertLineLabel"
                                    name="Intersection&apos;s vertical line label"
                                    value={this.props.gIntersectionVertLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </div>
                    )
                }
            </div >
        );
    }
}
