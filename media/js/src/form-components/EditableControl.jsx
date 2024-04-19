import React from 'react';
import PropTypes from 'prop-types';
import {handleFormUpdate} from '../utils.js';

/**
 * EditableControl
 *
 * An abstraction for the "Editable Control" idea. This control is
 * always available on the instructor side, and optionally for the
 * student as well.
 */
export default class EditableControl extends React.Component {

    render() {
        let input = (
            <input
                name={this.props.id}
                className="form-control"
                type="text"
                maxLength={this.props.maxLength || 60}
                disabled={this.props.disabled}
                value={this.props.value}
                onChange={handleFormUpdate.bind(this)} />
        );

        if (this.props.onBlur) {
            input = (
                <input
                    name={this.props.id}
                    className="form-control"
                    type="text"
                    maxLength={this.props.maxLength || 60}
                    disabled={this.props.disabled}
                    defaultValue={this.props.value}
                    onBlur={handleFormUpdate.bind(this)} />
            );
        }

        return (
            <React.Fragment>
                {(this.props.isInstructor || this.props.valueEditable) && (
                    <label className={this.props.className}>
                        {this.props.name}
                        {input}
                    </label>
                )}
            </React.Fragment>
        );
    }
}

EditableControl.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,

    // updateGraph is required by handleFormUpdate, bound to this with
    // onChange.
    updateGraph: PropTypes.func.isRequired,

    isInstructor: PropTypes.bool.isRequired,
    value: PropTypes.string,
    valueEditable: PropTypes.bool.isRequired,

    // Custom classes for the parent element of this component.
    className: PropTypes.string,

    onBlur: PropTypes.bool,
    disabled: PropTypes.bool,
    maxLength: PropTypes.number
};
