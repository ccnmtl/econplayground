import React from 'react';
import PropTypes from 'prop-types';
import {handleFormUpdate} from '../utils';

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
                        onChange={handleFormUpdate.bind(this)}
                        value={this.props.gSummary}
                        rows={4}
                        className="form-control form-control-sm" />
                </div>
                <div className="form-group">
                    <label htmlFor="gInstructions">
                        Instructions
                    </label>
                    <textarea id="gInstructions"
                        onChange={handleFormUpdate.bind(this)}
                        value={this.props.gInstructions}
                        rows={4}
                        className="form-control form-control-sm" />
                </div>
                <div className="form-group">
                    <label htmlFor="gInstructorNotes">
                        Instructor Notes
                    </label>
                    <textarea id="gInstructorNotes"
                        onChange={handleFormUpdate.bind(this)}
                        value={this.props.gInstructorNotes}
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
}
