import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor';
import EditableControl from '../form-components/EditableControl';
import { handleFormUpdate } from '../utils';
import Checkbox from '../form-components/Checkbox';

export default class ADASEditor extends React.Component {

    formatControlStd(containerClass, id, name, value) {
        return (
            <div className={containerClass}>
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
        return (
            <div>
                {this.props.displaySliders && (
                    <React.Fragment>
                        <h2>Slope</h2>
                        <RangeEditor
                            itemlabel={["Orange line slope"]}
                            dataId="gLine1Slope"
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
                            itemlabel={["Blue line slope"]}
                            dataId="gLine2Slope"
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
                            itemlabel={["Red line slope"]}
                            dataId="gLine3Slope"
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

                <h2>Lines</h2>
                <Checkbox id="gDisplayIntersection1"
                          checked={this.props.gDisplayIntersection1}
                          onChange={handleFormUpdate.bind(this)}
                          text="Show Orange-Blue intersection"
                />
                <Checkbox id="gDisplayIntersection2"
                          checked={this.props.gDisplayIntersection2}
                          onChange={handleFormUpdate.bind(this)}
                          text="Show Blue-Red intersection"
                />
                <Checkbox id="gDisplayIntersection3"
                          checked={this.props.gDisplayIntersection3}
                          onChange={handleFormUpdate.bind(this)}
                          text="Show Orange-Red intersection"
                />

                {this.props.isInstructor && (
                    <React.Fragment>
                        <Checkbox id="gLine1Dashed"
                                  checked={this.props.gLine1Dashed}
                                  onChange={handleFormUpdate.bind(this)}
                                  text="Orange line dashed?"
                        />
                        <Checkbox id="gLine2Dashed"
                                  checked={this.props.gLine2Dashed}
                                  onChange={handleFormUpdate.bind(this)}
                                  text="Blue line dashed?"
                        />
                        <Checkbox id="gLine3Dashed"
                                  checked={this.props.gLine3Dashed}
                                  onChange={handleFormUpdate.bind(this)}
                                  text="Red line dashed?"
                        />
                        <hr />
                    </React.Fragment>
                )}

                {this.props.displayLabels && (
                    <React.Fragment>
                        <h2>Labels</h2>
                        <div className="d-flex flex-wrap justify-content-between align-items-end">
                            {this.formatControlStd(/* className, id, name, value */
                                'col-4',
                                'gLine1Label',
                                'Orange line',
                                this.props.gLine1Label
                            )}
                            {this.formatControlStd(
                                'col-4',
                                'gLine2Label',
                                'Blue line',
                                this.props.gLine2Label
                            )}
                            {this.formatControlStd(
                                'col-4',
                                'gLine3Label',
                                'Red line',
                                this.props.gLine3Label
                            )}
                            {this.formatControlStd(
                                'col-6',
                                'gXAxisLabel',
                                'X-Axis',
                                this.props.gXAxisLabel
                            )}
                            {this.formatControlStd(
                                'col-6',
                                'gYAxisLabel',
                                'Y-Axis',
                                this.props.gYAxisLabel
                            )}
                            {this.formatControlStd(
                                'col-4',
                                'gIntersectionLabel',
                                'Orange-Blue intersection',
                                this.props.gIntersectionLabel
                            )}
                            {this.formatControlStd(
                                'col-4',
                                'gIntersection2Label',
                                'Blue-Red intersection',
                                this.props.gIntersection2Label
                            )}
                            {this.formatControlStd(
                                'col-4',
                                'gIntersection3Label',
                                'Orange-Red intersection',
                                this.props.gIntersection3Label
                            )}
                            {this.formatControlStd(
                                'col-6',
                                'gIntersectionHorizLineLabel',
                                'Orange-Blue intersection horizontal',
                                this.props.gIntersectionHorizLineLabel
                            )}
                            {this.formatControlStd(
                                'col-6',
                                'gIntersectionVertLineLabel',
                                'Orange-Blue intersection vertical',
                                this.props.gIntersectionVertLineLabel
                            )}
                            {this.formatControlStd(
                                'col-6',
                                'gIntersection2HorizLineLabel',
                                'Blue-Red intersection horizontal',
                                this.props.gIntersection2HorizLineLabel
                            )}
                            {this.formatControlStd(
                                'col-6',
                                'gIntersection2VertLineLabel',
                                'Blue-Red intersection vertical',
                                this.props.gIntersection2VertLineLabel
                            )}
                            {this.formatControlStd(
                                'col-6',
                                'gIntersection3HorizLineLabel',
                                'Orange-Red intersection horizontal',
                                this.props.gIntersection3HorizLineLabel
                            )}
                            {this.formatControlStd(
                                'col-6',
                                'gIntersection3VertLineLabel',
                                'Orange-Red intersection vertical',
                                this.props.gIntersection3VertLineLabel
                            )}
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
    gIntersection2HorizLineLabel: PropTypes.string.isRequired,
    gIntersection2VertLineLabel: PropTypes.string.isRequired,
    gIntersection3HorizLineLabel: PropTypes.string.isRequired,
    gIntersection3VertLineLabel: PropTypes.string.isRequired,

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
    isInstructor: PropTypes.bool.isRequired
};
