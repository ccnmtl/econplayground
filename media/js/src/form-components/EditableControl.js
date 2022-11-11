import React from 'react';
import PropTypes from 'prop-types';
import {handleFormUpdate} from '../utils';

/**
 * EditableControl
 *
 * An abstraction for the "Editable Control" idea. This control is
 * always available on the instructor side, and optionally for the
 * student as well.
 */
export default class EditableControl extends React.Component {
    render() {
        return (
            <React.Fragment>
                {(this.props.isInstructor || this.props.valueEditable) && (
                    <div className="form-group">
                        <label>
                            {this.props.name}
                            <input
                                name={this.props.id}
                                className="form-control"
                                type="text"
                                maxLength="60"
                                value={this.props.value}
                                onChange={handleFormUpdate.bind(this)} />
                        </label>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

EditableControl.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isInstructor: PropTypes.bool.isRequired,
    value: PropTypes.string,
    valueEditable: PropTypes.bool.isRequired
};
