import React from 'react';
import PropTypes from 'prop-types';
import {handleFormUpdate} from '../utils.js';

/**
 * This component contains the form fields  title, instructor notes,
 * and instructions.
 */
export default class CommonGraphEditor extends React.Component {
    render() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="gSummary">
                        Summary
                    </label>
                    <textarea id="gSummary"
                        onBlur={handleFormUpdate.bind(this)}
                        defaultValue={this.props.gSummary}
                        rows={4}
                        className="form-control form-control-sm" />
                </div>
                <div className="form-group">
                    <label htmlFor="gInstructions">
                        Instructions
                    </label>
                    <textarea id="gInstructions"
                        onBlur={handleFormUpdate.bind(this)}
                        defaultValue={this.props.gInstructions}
                        rows={4}
                        className="form-control form-control-sm" />
                </div>
                <div className="form-group">
                    <label htmlFor="gInstructorNotes">
                        Instructor Notes
                    </label>
                    <textarea id="gInstructorNotes"
                        onBlur={handleFormUpdate.bind(this)}
                        defaultValue={this.props.gInstructorNotes}
                        className="form-control form-control-sm" />
                </div>
            </div>
        );
    }
}

CommonGraphEditor.propTypes = {
    gTitle: PropTypes.string.isRequired,
    gSummary: PropTypes.string.isRequired,
    gInstructorNotes: PropTypes.string.isRequired,
    gInstructions: PropTypes.string.isRequired,

    updateGraph: PropTypes.func.isRequired
};
