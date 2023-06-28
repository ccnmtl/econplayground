import React from 'react';
import PropTypes from 'prop-types';
import { MathComponent } from 'mathjax-react';
import { btnStep } from '../utils.js';

/**
 * RangeEditor is a re-usable component that creates an <input> with
 * type="range". Also, it optionally displays an "override" checkbox
 * to allow the user to override that value.
 */
export default class RangeEditor extends React.Component {
    render() {
        return <React.Fragment>
            <div className="form-row slider-wrapper">
                <label key="dataId" className="w-100" htmlFor={this.props.id}>
                    {this.props.itemlabel && (
                        <div style={{display: 'flex'}}>
                            <MathComponent tex={this.props.itemlabel} />
                        </div>
                    )}
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
                            type="range"
                            onChange={this.props.handler}
                            value={this.props.value}
                            step={this.props.step || 0.01}
                            min={this.props.min}
                            max={this.props.max}
                        />
                        {this.props.showMinMax && (
                            <div className="d-inline position-absolute r-0">
                                {this.props.max}
                            </div>
                        )}
                    </div>
                </label>
                <div className="mb-2 input-group">
                    <button
                        className="btn btn-sm btn-primary ms-1 w-20"
                        aria-label={'Decrease by ' + (Number(this.props.step) * 10 || 0.1)}
                        id={this.props.id}
                        data-id={this.props.dataId}
                        type="button"
                        onClick={this.props.handler}
                        value={
                            btnStep(
                                this.props.value,
                                -1,
                                this.props.step * 10 || 0.1,
                                this.props.min,
                                this.props.max)
                        }>
                        &lt;&lt;&lt;
                    </button>
                    <button
                        className="btn btn-sm btn-info ms-1 w-20"
                        aria-label={'Decrease by ' + (Number(this.props.step) || 0.01)}
                        id={this.props.id}
                        data-id={this.props.dataId}
                        type="button"
                        onClick={this.props.handler}
                        value={
                            btnStep(
                                this.props.value,
                                -1,
                                this.props.step || 0.01,
                                this.props.min,
                                this.props.max)
                        }>
                        &lt;
                    </button>
                    <button
                        className="btn btn-sm btn-info ms-1 w-20"
                        aria-label={'Increase by ' + (Number(this.props.step) || 0.01)}
                        id={this.props.id}
                        data-id={this.props.dataId}
                        type="button"
                        onClick={this.props.handler}
                        value={
                            btnStep(
                                this.props.value,
                                1,
                                this.props.step || 0.01,
                                this.props.min,
                                this.props.max)
                        }>
                        &gt;
                    </button>
                    <button
                        className="btn btn-sm btn-primary ms-1 w-20"
                        aria-label={'Increase by ' + (Number(this.props.step) * 10 || 0.1)}
                        id={this.props.id}
                        data-id={this.props.dataId}
                        type="button"
                        onClick={this.props.handler}
                        value={
                            btnStep(
                                this.props.value,
                                1,
                                this.props.step * 10 || 0.1,
                                this.props.min,
                                this.props.max)
                        }>
                        &gt;&gt;&gt;
                    </button>
                    <input
                        className="form-control ms-1"
                        aria-label={'Input: ' + this.props.value}
                        type="number"
                        id={this.props.id}
                        data-id={this.props.dataId}
                        value={this.props.value}
                        step={Number(this.props.step) || 0.01}
                        onChange={this.props.handler}
                        min={this.props.min}
                        max={this.props.max}>
                    </input>
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
        </React.Fragment>;
    }
}

RangeEditor.defaultProps = {
    itemlabel: null,
    min: -5,
    max: 5,
    showOverrideButton: false,
    overrideLabel: '',
    overrideValue: 0,
    showOverride2Button: false,
    override2Label: '',
    override2Value: 0,
    showMinMax: false,
    showValue: true
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
    itemlabel: PropTypes.string,  // a LaTeX string
    overrideLabel: PropTypes.string,
    overrideValue: PropTypes.number,
    showOverride2Button: PropTypes.bool,
    override2Label: PropTypes.string,
    override2Value: PropTypes.number,
    showMinMax: PropTypes.bool,
    note: PropTypes.string,
    showNote: PropTypes.bool,
    showValue: PropTypes.bool
};
