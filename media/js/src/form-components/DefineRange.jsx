import React from 'react';
import PropTypes from 'prop-types';
import { getKatexEl } from '../katexUtils.jsx';

/**
 * DefineRange is a re-usable component that creates <input> elements with
 * type="number" in order to define a range.
 */
export default class DefineRange extends React.Component {
    validateRange = (e) => {
        //TODO: validate range
    };

    render() {
        return (
            <React.Fragment>
                <div className="input-group mb-2 w-50">
                    <label className="input-group-text" key="dataId" htmlFor={this.props.id + 'Min'}>
                        <div>
                            {getKatexEl(this.props.label)}
                        </div>
                    </label>
                    {[ // [label, id, value]
                        ['minimum', 'Min', this.props.min],
                        ['maximum', 'Max', this.props.max]
                    ].map((item, key) => {
                        return (
                            <input
                                key={key}
                                className="form-control"
                                aria-label={this.props.label + ' ' + item[0]}
                                id={this.props.id + item[1]}
                                data-id={this.props.id + item[1]}
                                name={this.props.id + item[1]}
                                type="number"
                                onChange={this.props.handler}
                                value={item[2]}
                            />
                        );
                    })}
                </div>
            </React.Fragment>
        );
    }
}

DefineRange.defaultProps = {
    label: null,
    min: 0,
    max: 10,
    disabled: false
};

DefineRange.propTypes = {
    id: PropTypes.string,
    dataId: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    label: PropTypes.string.isRequired,  // a LaTeX string
};
