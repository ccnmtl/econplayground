import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.jsx';
import EditableControl from '../form-components/EditableControl.jsx';
import { handleFormUpdate } from '../utils.js';
import Checkbox from '../form-components/Checkbox.jsx';
import { getKatexEl } from '../katexUtils.jsx';

export default class ADASEditor extends React.Component {

    formatControlStd(id, name, value) {
        return (
            <div className="col">
                <EditableControl
                    id={id}
                    name={name}
                    value={value}
                    valueEditable={true}
                    isInstructor={this.props.isInstructor}
                    updateGraph={this.props.updateGraph}
                />
            </div>
        );
    }

    render() {
        const func1 = `\\text{Orange: } y = mx + b = ${this.props.gLine1Slope} (x - 2.5) + 2.5)`;
        const func2 = `\\text{Blue: } y = mx + b = ${this.props.gLine2Slope} (x - 2.5) + 2.5`;
        const func3 = `\\text{Red: } y = mx + b = ${this.props.gLine3Slope} (x - 2.5) + 2.5)`;

        return (
            <div>
                <h3>Function</h3>
                <div className="col">
                    <div>
                        {getKatexEl(func1)}
                    </div>
                    <div>
                        {getKatexEl(func2)}
                    </div>
                    <div>
                        {getKatexEl(func3)}
                    </div>
                </div>
                <hr />
                {this.props.displaySliders && (
                    <React.Fragment>
                        <h3>Slope</h3>
                        <RangeEditor
                            label="\text{Orange line slope}"
                            id="gLine1Slope"
                            value={this.props.gLine1Slope}
                            min={0}
                            max={5}
                            showOverrideButton={true}
                            overrideLabel='Vertical'
                            overrideValue={999}
                            showOverride2Button={true}
                            override2Label='Horizontal'
                            override2Value={0}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="\text{Blue line slope}"
                            id="gLine2Slope"
                            min={-5}
                            max={0}
                            value={this.props.gLine2Slope}
                            showOverrideButton={true}
                            overrideLabel='Vertical'
                            overrideValue={-999}
                            showOverride2Button={true}
                            override2Label='Horizontal'
                            override2Value={0}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="\text{Red line slope}"
                            id="gLine3Slope"
                            value={this.props.gLine3Slope}
                            min={-5}
                            max={5}
                            showOverrideButton={true}
                            overrideLabel='Vertical'
                            overrideValue={999}
                            showOverride2Button={true}
                            override2Label='Horizontal'
                            override2Value={0}
                            handler={handleFormUpdate.bind(this)} />
                        <hr />
                    </React.Fragment>
                )}

                <h3>Lines</h3>
                <Checkbox
                    id="gDisplayIntersection1"
                    checked={this.props.gDisplayIntersection1}
                    onChange={handleFormUpdate.bind(this)}
                    text="Show Orange-Blue intersection"
                />
                <Checkbox
                    id="gDisplayIntersection2"
                    checked={this.props.gDisplayIntersection2}
                    onChange={handleFormUpdate.bind(this)}
                    text="Show Blue-Red intersection"
                />
                <Checkbox
                    id="gDisplayIntersection3"
                    checked={this.props.gDisplayIntersection3}
                    onChange={handleFormUpdate.bind(this)}
                    text="Show Orange-Red intersection"
                />

                {this.props.isInstructor && (
                    <React.Fragment>
                        <Checkbox
                            id="gLine1Dashed"
                            checked={this.props.gLine1Dashed}
                            onChange={handleFormUpdate.bind(this)}
                            text="Orange line dashed?"
                        />
                        <Checkbox
                            id="gLine2Dashed"
                            checked={this.props.gLine2Dashed}
                            onChange={handleFormUpdate.bind(this)}
                            text="Blue line dashed?"
                        />
                        <Checkbox
                            id="gLine3Dashed"
                            checked={this.props.gLine3Dashed}
                            onChange={handleFormUpdate.bind(this)}
                            text="Red line dashed?"
                        />
                        <hr />
                    </React.Fragment>
                )}

                {this.props.displayLabels && (
                    <React.Fragment>
                        <h3>Labels</h3>
                        <div className="d-flex flex-wrap">
                            <div className="row align-items-end">
                                {this.formatControlStd(
                                    'gLine1Label',
                                    'Orange line',
                                    this.props.gLine1Label
                                )}
                                {this.formatControlStd(
                                    'gLine2Label',
                                    'Blue line',
                                    this.props.gLine2Label
                                )}
                                {this.formatControlStd(
                                    'gLine3Label',
                                    'Red line',
                                    this.props.gLine3Label
                                )}
                            </div>
                            <div className="row align-items-end">
                                {this.formatControlStd(
                                    'gXAxisLabel',
                                    'X-Axis',
                                    this.props.gXAxisLabel
                                )}
                                {this.formatControlStd(
                                    'gYAxisLabel',
                                    'Y-Axis',
                                    this.props.gYAxisLabel
                                )}
                            </div>
                            <div className="row align-items-end">
                                {this.formatControlStd(
                                    'gIntersectionLabel',
                                    'Orange-Blue intersection',
                                    this.props.gIntersectionLabel
                                )}
                                {this.formatControlStd(
                                    'gIntersection2Label',
                                    'Blue-Red intersection',
                                    this.props.gIntersection2Label
                                )}
                                {this.formatControlStd(
                                    'gIntersection3Label',
                                    'Orange-Red intersection',
                                    this.props.gIntersection3Label
                                )}
                            </div>
                            <div className="row align-items-end">
                                {this.formatControlStd(
                                    'gIntersectionHorizLineLabel',
                                    'Orange-Blue intersection horizontal',
                                    this.props.gIntersectionHorizLineLabel
                                )}
                                {this.formatControlStd(
                                    'gIntersectionVertLineLabel',
                                    'Orange-Blue intersection vertical',
                                    this.props.gIntersectionVertLineLabel
                                )}
                            </div>
                            <div className="row align-items-end">
                                {this.formatControlStd(
                                    'gIntersection2HorizLineLabel',
                                    'Blue-Red intersection horizontal',
                                    this.props.gIntersection2HorizLineLabel
                                )}
                                {this.formatControlStd(
                                    'gIntersection2VertLineLabel',
                                    'Blue-Red intersection vertical',
                                    this.props.gIntersection2VertLineLabel
                                )}
                            </div>
                            <div className="row align-items-end">
                                {this.formatControlStd(
                                    'gIntersection3HorizLineLabel',
                                    'Orange-Red intersection horizontal',
                                    this.props.gIntersection3HorizLineLabel
                                )}
                                {this.formatControlStd(
                                    'gIntersection3VertLineLabel',
                                    'Orange-Red intersection vertical',
                                    this.props.gIntersection3VertLineLabel
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

ADASEditor.propTypes = {
    gIntersectionLabel: PropTypes.string.isRequired,
    gIntersectionHorizLineLabel: PropTypes.string.isRequired,
    gIntersectionVertLineLabel: PropTypes.string.isRequired,
    gIntersection2Label: PropTypes.string,
    gIntersection2HorizLineLabel: PropTypes.string.isRequired,
    gIntersection2VertLineLabel: PropTypes.string.isRequired,
    gIntersection3Label: PropTypes.string,
    gIntersection3HorizLineLabel: PropTypes.string.isRequired,
    gIntersection3VertLineLabel: PropTypes.string.isRequired,

    gLine1Dashed: PropTypes.bool.isRequired,
    gLine2Dashed: PropTypes.bool.isRequired,
    gLine3Dashed: PropTypes.bool.isRequired,

    gDisplayIntersection1: PropTypes.bool.isRequired,
    gDisplayIntersection2: PropTypes.bool.isRequired,
    gDisplayIntersection3: PropTypes.bool.isRequired,

    gXAxisLabel: PropTypes.string.isRequired,
    gYAxisLabel: PropTypes.string.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,

    gLine1Slope: PropTypes.number.isRequired,
    gLine1Label: PropTypes.string.isRequired,
    gLine2Slope: PropTypes.number.isRequired,
    gLine2Label: PropTypes.string.isRequired,
    gLine3Slope: PropTypes.number.isRequired,
    gLine3Label: PropTypes.string.isRequired,

    displayLabels: PropTypes.bool.isRequired,
    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired
};
