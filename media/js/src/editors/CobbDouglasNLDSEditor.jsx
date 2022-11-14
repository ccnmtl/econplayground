import React from 'react';
import PropTypes from 'prop-types';
import { MathComponent } from 'mathjax-react';
import RangeEditor from '../form-components/RangeEditor';
import EditableControl from '../form-components/EditableControl';
import { handleFormUpdate } from '../utils';

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
                <h2>Functions</h2>
                <blockquote className="ml-2"><em>
                    This is a projection of the Cobb-Douglas function
                    with {this.props.gCobbDouglasLName} plotted along
                    the X-axis.
                </em></blockquote>
                <div className="form-inline">
                    {this.props.isInstructor && (
                        <input type="text"
                            className="form-control form-control-sm mr-2"
                            name="gCobbDouglasYName"
                            value={this.props.gCobbDouglasYName}
                            maxLength="1"
                            size="1"
                            onChange={handleFormUpdate.bind(this)}
                        />
                    )}
                    <MathComponent tex={tex} />
                </div>

                {this.props.isInstructor && !this.props.hideFunctionChoice && (
                    <>
                        <h3 className="mt-3">
                            NLDS Function
                        </h3>
                        <div className="form-check ml-4">
                            <div className="row mb-4">
                                <input className="form-check-input"
                                    aria-label={func1}
                                    type="radio"
                                    name="gFunctionChoice"
                                    id="gFunctionChoice1"
                                    onChange={handleFormUpdate.bind(this)}
                                    value={0}
                                    checked={this.props.gFunctionChoice === 0} />
                                <label className="form-check-label" htmlFor="gFunctionChoice1">
                                    <MathComponent tex={func1} />
                                </label>
                            </div>
                            <div className="row">
                                <input className="form-check-input"
                                    aria-label={func2}
                                    type="radio"
                                    name="gFunctionChoice"
                                    id="gFunctionChoice2"
                                    onChange={handleFormUpdate.bind(this)}
                                    value={1}
                                    checked={this.props.gFunctionChoice === 1} />
                                <label className="form-check-label" htmlFor="gFunctionChoice2">
                                    <MathComponent tex={func2} />
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
                            <h2>Slope</h2>
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
                                dataId="gCobbDouglasA"
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
                                dataId="gCobbDouglasK"
                                value={this.props.gCobbDouglasK}
                                handler={handleFormUpdate.bind(this)}
                                min={0} />
                            <RangeEditor
                                itemlabel={["ɑ"]}
                                dataId="gCobbDouglasAlpha"
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
                                dataId="gCobbDouglasL"
                                value={this.props.gCobbDouglasL}
                                handler={handleFormUpdate.bind(this)}
                                min={0}
                                max={10} />
                            <RangeEditor
                                itemlabel={["Orange line slope"]}
                                dataId="gLine1Slope"
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
                            <h2>Labels</h2>
                            <div className="row justify-content-between align-items-end">
                                <div className="col-6">
                                    <EditableControl
                                        id="gLine1Label"
                                        name="Orange line label"
                                        value={this.props.gLine1Label}
                                        valueEditable={true}
                                        isInstructor={this.props.isInstructor}
                                        updateGraph={this.props.updateGraph}
                                    />
                                </div>
                                <div className="col-6">
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
                        <div className="row justify-content-between align-items-end">
                            <div className="col-4">
                                <EditableControl
                                    id="gIntersectionLabel"
                                    name="Intersection point label"
                                    value={this.props.gIntersectionLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col-4">
                                <EditableControl
                                    id="gIntersectionHorizLineLabel"
                                    name="Intersection&apos;s horizontal line label"
                                    value={this.props.gIntersectionHorizLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col-4">
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

CobbDouglasNLDSEditor.propTypes = {
    updateGraph: PropTypes.func.isRequired,

    gCobbDouglasA: PropTypes.number.isRequired,
    gCobbDouglasAName: PropTypes.string.isRequired,
    gCobbDouglasL: PropTypes.number.isRequired,
    gCobbDouglasLName: PropTypes.string.isRequired,
    gCobbDouglasK: PropTypes.number.isRequired,
    gCobbDouglasKName: PropTypes.string.isRequired,
    gCobbDouglasAlpha: PropTypes.number.isRequired,
    gCobbDouglasYName: PropTypes.string.isRequired,
    gIntersectionLabel: PropTypes.string.isRequired,

    gNName: PropTypes.string.isRequired,

    gIntersectionLabel: PropTypes.string.isRequired,
    gIntersectionHorizLineLabel: PropTypes.string.isRequired,
    gIntersectionVertLineLabel: PropTypes.string.isRequired,

    gLine1Label: PropTypes.string.isRequired,
    gLine2Label: PropTypes.string.isRequired,
    gLine1Slope: PropTypes.number.isRequired,

    gFunctionChoice: PropTypes.number.isRequired,
    hideFunctionChoice: PropTypes.bool,

    displayLabels: PropTypes.bool.isRequired,
    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired
};
