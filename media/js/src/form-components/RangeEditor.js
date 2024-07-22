import React from 'react';
import PropTypes from 'prop-types';
import { getKatexEl } from '../katexUtils.jsx';
import { btnStep } from '../utils.js';

/**
 * RangeEditor is a re-usable component that creates an <input> with
 * type="range". Also, it optionally displays an "override" checkbox
 * to allow the user to override that value.
 */
export default class RangeEditor extends React.Component {
    label() {
        if (!this.props.label) {
            return null;
        }

        if (!this.props.rawLabel) {
            return getKatexEl(this.props.label);
        } else {
            return (
                <span>{this.props.label}</span>
            );
        }
    }

    validateInput(e) {
        if (e.target.value === null || e.target.value === '') {
            return;
        }

        if (!isNaN(Number(e.target.value))) {
            return this.props.handler(e);
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col">
                        <div className="form-row">
                            <label key="dataId" className="w-100" htmlFor={this.props.id}>

                                {this.label()}

                                <div className="d-inline w-100">
                                    {this.props.showMinMax && (
                                        <div className="position-absolute l-0">
                                            {this.props.min}
                                        </div>
                                    )}
                                    <input
                                        className="d-inline form-range w-90"
                                        aria-label={this.props.note}
                                        id={this.props.id}
                                        data-id={this.props.dataId}
                                        name={this.props.dataId}
                                        type="range"
                                        onChange={this.props.handler}
                                        value={this.props.value}
                                        step={this.props.step || 0.01}
                                        min={this.props.min}
                                        max={this.props.max}
                                        disabled={this.props.disabled}
                                    />
                                    {this.props.showMinMax && (
                                        <div className="d-inline position-absolute r-0">
                                            {this.props.max}
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-2 input-group">
                            <button
                                className="btn btn-primary ms-1"
                                aria-label={'Decrease by ' + (Number(this.props.step) * 10 || 0.1)}
                                id={this.props.id}
                                data-id={this.props.dataId}
                                type="button"
                                onClick={this.props.handler}
                                disabled={this.props.disabled}
                                value={
                                    btnStep(
                                        this.props.value,
                                        -1,
                                        this.props.step * 10 || 0.1,
                                        this.props.min,
                                        this.props.max)
                                }>
                                &lt;&lt;
                            </button>
                            <button
                                className="btn btn-primary ms-1"
                                aria-label={'Increase by ' + (Number(this.props.step) * 10 || 0.1)}
                                id={this.props.id}
                                data-id={this.props.dataId}
                                type="button"
                                onClick={this.props.handler}
                                disabled={this.props.disabled}
                                value={
                                    btnStep(
                                        this.props.value,
                                        1,
                                        this.props.step * 10 || 0.1,
                                        this.props.min,
                                        this.props.max)
                                }>
                                &gt;&gt;
                            </button>
                            <input
                                className="form-control ms-1"
                                aria-label={'Input: ' + this.props.value}
                                type="number"
                                id={this.props.id}
                                data-id={this.props.dataId}
                                value={this.props.value}
                                onChange={this.validateInput.bind(this)}
                                step={Number(this.props.step) || 0.01}
                                disabled={this.props.disabled}
                                min={this.props.min}
                                max={this.props.max}>
                            </input>
                        </div>
                    </div>

                    <div className="input-group">
                        {this.props.showOverrideButton && (
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <input
                                        data-id={this.props.dataId}
                                        data-override={this.props.overrideValue}
                                        className="form-check-input override"
                                        type="radio"
                                        disabled={this.props.disabled}
                                        onChange={this.props.handler}
                                        checked={this.props.value === this.props.overrideValue} />
                                    {this.props.overrideLabel}
                                </label>
                            </div>
                        )}
                        {this.props.showOverride2Button && (
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <input
                                        data-id={this.props.dataId}
                                        data-override={this.props.override2Value}
                                        className="form-check-input override"
                                        type="radio"
                                        disabled={this.props.disabled}
                                        onChange={this.props.handler}
                                        checked={this.props.value === this.props.override2Value} />
                                    {this.props.override2Label}
                                </label>
                            </div>
                        )}
                    </div>
                    <small className="form-text text-muted ms-sm-2">
                        {this.props.note}
                    </small>
                </div>
            </React.Fragment>
        );
    }
}

RangeEditor.defaultProps = {
    label: null,
    rawLabel: false,
    min: -5,
    max: 5,
    showOverrideButton: false,
    overrideLabel: '',
    overrideValue: 0,
    showOverride2Button: false,
    override2Label: '',
    override2Value: 0,
    showMinMax: false,
    showValue: true,
    disabled: false
};

RangeEditor.propTypes = {
    id: PropTypes.string,
    dataId: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    showOverrideButton: PropTypes.bool,

    label: PropTypes.string,  // a LaTeX string
    // If true, don't format label with LaTeX.
    rawLabel: PropTypes.bool,

    overrideLabel: PropTypes.string,
    overrideValue: PropTypes.number,
    showOverride2Button: PropTypes.bool,
    override2Label: PropTypes.string,
    override2Value: PropTypes.number,
    showMinMax: PropTypes.bool,
    note: PropTypes.string,
    showNote: PropTypes.bool,
    showValue: PropTypes.bool,
    disabled: PropTypes.bool
};
