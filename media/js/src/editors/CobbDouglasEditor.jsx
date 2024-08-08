import React from 'react';
import PropTypes from 'prop-types';
import { getKatexEl } from '../katexUtils.jsx';
import RangeEditor from '../form-components/RangeEditor.jsx';
import EditableControl from '../form-components/EditableControl.jsx';
import { handleFormUpdate } from '../utils.js';

export default class CobbDouglasEditor extends React.Component {
    render() {
        let tex = `= ${this.props.gA1Name}${this.props.gA3Name}^{\\alpha} ${this.props.gA2Name}^{1 - \\alpha}`;

        if (!this.props.isInstructor) {
            tex = `${this.props.gA5Name} ${tex}`;
        }

        return (
            <div>
                <h3>Function</h3>
                <blockquote className="ml-2"><em>
                    This is a projection of the Cobb-Douglas function
                    with {this.props.gA2Name} plotted along
                    the X-axis.
                </em></blockquote>
                <div className="row">
                    {this.props.isInstructor && (
                        <div className="col">
                            <input
                                type="text"
                                aria-label={'Function variable for ' + tex}
                                className="form-control form-control-sm mr-2"
                                name="gA5Name"
                                value={this.props.gA5Name}
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
                <hr />

                {this.props.displaySliders && (
                    <React.Fragment>
                        <h3>Slope</h3>
                        <label className="m-0" htmlFor="gA1">
                            {this.props.isInstructor ? (
                                <input type="text"
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
                            value={this.props.gA1}
                            handler={handleFormUpdate.bind(this)}
                            min={0} />
                        <label className="m-0" htmlFor="gA3">
                            {this.props.isInstructor ? (
                                <input type="text"
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
                            value={this.props.gA3}
                            handler={handleFormUpdate.bind(this)}
                            min={0} />
                        <RangeEditor
                            label="\alpha"
                            id="gA4"
                            value={this.props.gA4}
                            handler={handleFormUpdate.bind(this)}
                            min={0}
                            max={1}
                            showMinMax={true}
                        />
                        <label className="m-0" htmlFor="gA2">
                            {this.props.isInstructor ? (
                                <input type="text"
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
                            value={this.props.gA2}
                            handler={handleFormUpdate.bind(this)}
                            min={0}
                            max={10}
                            note="This variable is plotted along the X-axis."
                            showNote={this.props.isInstructor} />
                    </React.Fragment>
                )
                }

                {
                    this.props.displayLabels && (
                        <React.Fragment>
                            <h3>Label</h3>
                            <div className="row">
                                <EditableControl
                                    id="gIntersectionLabel"
                                    name="Intersection point label"
                                    value={this.props.gIntersectionLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </React.Fragment>
                    )
                }
            </div >
        );
    }
}

CobbDouglasEditor.propTypes = {
    updateGraph: PropTypes.func.isRequired,

    gA1: PropTypes.number.isRequired,
    gA1Name: PropTypes.string.isRequired,
    gA2: PropTypes.number.isRequired,
    gA2Name: PropTypes.string.isRequired,
    gA3: PropTypes.number.isRequired,
    gA3Name: PropTypes.string.isRequired,
    gA4: PropTypes.number.isRequired,
    gA5Name: PropTypes.string.isRequired,
    gIntersectionLabel: PropTypes.string.isRequired,

    displayLabels: PropTypes.bool.isRequired,
    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired
};
