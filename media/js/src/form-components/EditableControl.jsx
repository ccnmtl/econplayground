import React from 'react';
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
        const commonAttrs = {
            name: this.props.id,
            className: `form-control ${this.props.inputClass}`,
            type: 'text',
            maxLength: this.props.maxLength || 60,
            disabled: this.props.disabled,
        };

        let input = (
            <input
                {...commonAttrs}
                value={this.props.value}
                onChange={handleFormUpdate.bind(this)} />
        );

        if (this.props.onBlur) {
            input = (
                <input
                    {...commonAttrs}
                    defaultValue={this.props.value}
                    onBlur={handleFormUpdate.bind(this)} />
            );
        }

        return (
            <>
                {(this.props.isInstructor || this.props.valueEditable) && (
                    <label
                        className={this.props.className}
                        data-testid="editablecontrol">
                        {this.props.name}
                        {input}
                    </label>
                )}
            </>
        );
    }
}
