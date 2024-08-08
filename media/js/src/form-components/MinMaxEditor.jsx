import React from 'react';
import PropTypes from 'prop-types';

export default class MinMaxEditor extends React.Component {
    render() {
        return (
            <div className="input-group">
                <label
                    className="input-group-text"
                    htmlFor={this.props.id + 'Min'}>
                    Min
                </label>
                <input
                    className="form-control form-control-sm"
                    aria-label={this.props.label + ' min'}
                    id={this.props.id + 'Min'}
                    data-id={this.props.id + 'Min'}
                    name={this.props.label}
                    type="number"
                    onChange={this.props.handler}
                    value={this.props.min}
                />
                <label
                    className="input-group-text"
                    htmlFor={this.props.id + 'Max'}>
                    Max
                </label>
                <input
                    className="form-control form-control-sm"
                    aria-label={this.props.label + ' max'}
                    id={this.props.id + 'Max'}
                    data-id={this.props.id + 'Max'}
                    name={this.props.label}
                    type="number"
                    onChange={this.props.handler}
                    value={this.props.max}
                />
            </div>
        );
    }
}

MinMaxEditor.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
};
