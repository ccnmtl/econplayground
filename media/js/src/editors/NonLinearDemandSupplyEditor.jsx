import React from 'react';
import PropTypes from 'prop-types';
import { getKatexEl } from '../katexUtils.jsx';
import RangeEditor from '../form-components/RangeEditor.jsx';
import EditableControl from '../form-components/EditableControl.jsx';
import AreaConfiguration from './AreaConfiguration.jsx';
import { handleFormUpdate } from '../utils.js';

export default class NonLinearDemandSupplyEditor extends React.Component {
    render() {
        const func1 = String.raw`MP_${this.props.gNName} = (1 - \alpha)${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^\alpha ${this.props.gNName}^{-\alpha}`;
        const func2 = String.raw`MP_${this.props.gCobbDouglasKName} = \alpha ${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^{\alpha - 1} ${this.props.gNName}^{1 - \alpha}`;

        return (
            <>
                {this.props.isInstructor && !this.props.hideFunctionChoice && (
                    <React.Fragment>
                        <h3>Function</h3>
                        <div className="form-check mb-4">
                            <input className="form-check-input"
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
                        <div className="form-check">
                            <input className="form-check-input"
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
                        <hr />
                    </React.Fragment>
                )
                }
                {
                    this.props.displaySliders && (
                        <React.Fragment>
                            <h3>Slope</h3>
                            <RangeEditor
                                label="\text{Orange line slope}"
                                id="gLine1Slope"
                                value={this.props.gLine1Slope}
                                showOverrideButton={true}
                                overrideLabel='Vertical'
                                overrideValue={999}
                                showOverride2Button={true}
                                override2Label='Horizontal'
                                override2Value={0}
                                handler={handleFormUpdate.bind(this)} />

                            <label htmlFor="gCobbDouglasA">
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
                                step={0.1}
                                min={0}
                                max={18} />

                            <label htmlFor="gCobbDouglasK">
                                {(this.props.isInstructor ? (
                                    <input type="text"
                                        name="gCobbDouglasKName"
                                        maxLength="1"
                                        size="1"
                                        className="form-control form-control-sm"
                                        value={this.props.gCobbDouglasKName}
                                        onChange={handleFormUpdate.bind(this)}
                                    />
                                ) : this.props.gCobbDouglasKName)}
                            </label>
                            <RangeEditor
                                id="gCobbDouglasK"
                                value={this.props.gCobbDouglasK}
                                handler={handleFormUpdate.bind(this)}
                                min={0}
                                max={5} />

                            <label htmlFor="gNName">
                                {(this.props.isInstructor ? (
                                    <input type="text"
                                        name="gNName"
                                        maxLength="1"
                                        size="1"
                                        className="form-control form-control-sm"
                                        value={this.props.gNName}
                                        onChange={handleFormUpdate.bind(this)}
                                    />
                                ) : this.props.gNName)}
                            </label>
                            <hr />
                        </React.Fragment>
                    )
                }
                {
                    this.props.displayLabels && (
                        <React.Fragment>
                            <h3>Labels</h3>
                            <div className="d-flex flex-wrap">
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
                            </div>
                        </React.Fragment>
                    )
                }

                {
                    this.props.showAUC && (
                        <AreaConfiguration
                            displayLabels={this.props.displayLabels}
                            gAreaConfiguration={this.props.gAreaConfiguration}
                            gIsAreaDisplayed={this.props.gIsAreaDisplayed}

                            gAreaAName={this.props.gAreaAName}
                            gAreaBName={this.props.gAreaBName}
                            gAreaCName={this.props.gAreaCName}

                            updateGraph={this.props.updateGraph}
                        />
                    )
                }
            </>
        );
    }
}

NonLinearDemandSupplyEditor.propTypes = {
    updateGraph: PropTypes.func.isRequired,
    gIntersectionLabel: PropTypes.string.isRequired,
    gIntersectionHorizLineLabel: PropTypes.string.isRequired,
    gIntersectionVertLineLabel: PropTypes.string.isRequired,

    gCobbDouglasA: PropTypes.number.isRequired,
    gCobbDouglasAName: PropTypes.string.isRequired,
    gCobbDouglasK: PropTypes.number.isRequired,
    gCobbDouglasKName: PropTypes.string.isRequired,

    gNName: PropTypes.string.isRequired,

    gLine1Label: PropTypes.string.isRequired,
    gLine2Label: PropTypes.string.isRequired,
    gLine1Slope: PropTypes.number.isRequired,

    gFunctionChoice: PropTypes.number.isRequired,
    hideFunctionChoice: PropTypes.bool,

    gAreaConfiguration: PropTypes.number,
    gIsAreaDisplayed: PropTypes.bool,

    gAreaAName: PropTypes.string,
    gAreaBName: PropTypes.string,
    gAreaCName: PropTypes.string,

    displayLabels: PropTypes.bool.isRequired,
    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,
    showAUC: PropTypes.bool.isRequired
};
