import React from 'react';
import PropTypes from 'prop-types';

export default class Checkbox extends React.Component {
    render() {
        return (
            <div className="form-check">
                <label className="form-check-label">
                    <input
                        id={this.props.id}
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        checked={this.props.checked}/>
                    {this.props.text}
                </label>
            </div>
        );
    }
}

Checkbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    onChange:PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
};