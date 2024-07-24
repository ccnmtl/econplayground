import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.jsx';
import Checkbox from '../form-components/Checkbox.jsx';
import { handleFormUpdate } from '../utils.js';
import { getKatexEl } from '../katexUtils.jsx';

export default class OptimalChoiceCostMinimizingEditor extends React.Component {
    render() {
        const cobbDouglasOptions = [
            'General Cobb-Douglas Production Functions',
            'Standard Cobb-Douglas Production Functions',
            'Standard Cobb-Douglas Production Functions with Taxation',
            'CES Production Functions',
            'Perfect Substitutes',
            'Perfect Complements'
        ];
        const cobbDouglasKatexFunctions = [
            'f(l,k) = k^\\alpha l^\\beta',
            'f(l,k) = k^\\alpha l^{1 - \\alpha}',
            'f(l,k) = k^\\alpha l^{1 - \\alpha}',
            'f(l,k) = (k^\\rho + l^\\rho)^{1 / \\rho}',
            'f(l,k) = ak + bl',
            'f(l,k) = min \\{ ak + bl \\}',
        ];
        const radioButtons = cobbDouglasOptions.map((optionTitle, idx) =>
            <div key={idx} className="form-check">
                <input
                    type="radio" id={`functionChoice-${idx}`}
                    className="form-check-input"
                    value={idx}
                    disabled={this.props.gToggle ? false : true}
                    name="gFunctionChoice"
                    checked={this.props.gFunctionChoice === idx}
                    onChange={handleFormUpdate.bind(this)} />
                <label
                    className="form-check-label"
                    htmlFor={`functionChoice-${idx}`}>
                    {optionTitle}: {getKatexEl(cobbDouglasKatexFunctions[idx])}
                </label>
            </div>
        );

        return (
            <>
                <Checkbox
                    checked={this.props.gToggle}
                    id="gToggle"
                    onChange={handleFormUpdate.bind(this)}
                    text="Enable Cobb-Douglas Production Function" />

                {radioButtons}

                <div>
                    {this.props.displaySliders && (
                        <>
                            <RangeEditor
                                label="w"
                                id="gA1"
                                dataId="gA1"
                                value={this.props.gA1}
                                min={0}
                                max={30}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label="r"
                                id="gA2"
                                dataId="gA2"
                                value={this.props.gA2}
                                min={0.01}
                                max={30}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label={this.props.gToggle ? 'q' : 'c'}
                                id="gA3"
                                dataId="gA3"
                                value={this.props.gA3}
                                min={0}
                                max={5000}
                                handler={handleFormUpdate.bind(this)} />

                            {this.props.gToggle && this.props.gFunctionChoice === 0 && (
                                <>
                                    <RangeEditor
                                        label="\alpha"
                                        id="gA4"
                                        dataId="gA4"
                                        value={this.props.gA4}
                                        min={0.01}
                                        max={1}
                                        handler={handleFormUpdate.bind(this)} />
                                    <RangeEditor
                                        label="\beta"
                                        id="gA5"
                                        dataId="gA5"
                                        value={this.props.gA5}
                                        min={0.01}
                                        max={1}
                                        handler={handleFormUpdate.bind(this)} />
                                </>
                            )}

                            {this.props.gToggle && this.props.gFunctionChoice === 1 && (
                                <>
                                    <RangeEditor
                                        label="\alpha"
                                        id="gA4"
                                        dataId="gA4"
                                        value={this.props.gA4}
                                        min={0.01}
                                        max={1}
                                        handler={handleFormUpdate.bind(this)} />
                                </>
                            )}

                            {this.props.gToggle && this.props.gFunctionChoice === 2 && (
                                <>
                                    <RangeEditor
                                        label="\alpha"
                                        id="gA4"
                                        dataId="gA4"
                                        value={this.props.gA4}
                                        min={0}
                                        max={2}
                                        handler={handleFormUpdate.bind(this)} />

                                    <RangeEditor
                                        label="Input Tax Rate"
                                        rawLabel={true}
                                        id="gA5"
                                        dataId="gA5"
                                        value={this.props.gA5}
                                        min={0}
                                        max={2}
                                        handler={handleFormUpdate.bind(this)} />

                                    <RangeEditor
                                        label="Labor Tax Rate"
                                        rawLabel={true}
                                        id="gA6"
                                        dataId="gA6"
                                        value={this.props.gA6}
                                        min={0}
                                        max={2}
                                        handler={handleFormUpdate.bind(this)} />

                                    <RangeEditor
                                        label="Capital Tax Rate"
                                        rawLabel={true}
                                        id="gA7"
                                        dataId="gA7"
                                        value={this.props.gA7}
                                        min={0}
                                        max={2}
                                        handler={handleFormUpdate.bind(this)} />

                                    <RangeEditor
                                        label="Business License"
                                        rawLabel={true}
                                        id="gA8"
                                        dataId="gA8"
                                        value={this.props.gA8}
                                        min={0}
                                        max={2}
                                        handler={handleFormUpdate.bind(this)} />
                                </>
                            )}

                            {this.props.gToggle && this.props.gFunctionChoice === 3 && (
                                <>
                                    <RangeEditor
                                        label="\rho"
                                        id="gA4"
                                        dataId="gA4"
                                        value={this.props.gA4}
                                        min={0.01}
                                        max={1}
                                        handler={handleFormUpdate.bind(this)} />
                                </>
                            )}

                            {this.props.gToggle && (
                                this.props.gFunctionChoice === 4 ||
                                    this.props.gFunctionChoice === 5
                            ) && (
                                <>
                                    <RangeEditor
                                        label="a"
                                        id="gA4"
                                        dataId="gA4"
                                        value={this.props.gA4}
                                        min={0.01}
                                        max={1}
                                        handler={handleFormUpdate.bind(this)} />
                                    <RangeEditor
                                        label="b"
                                        id="gA5"
                                        dataId="gA5"
                                        value={this.props.gA5}
                                        min={0.01}
                                        max={1}
                                        handler={handleFormUpdate.bind(this)} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </>
        );
    }
}

OptimalChoiceCostMinimizingEditor.propTypes = {
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gA4: PropTypes.number.isRequired,
    gA5: PropTypes.number.isRequired,
    gA6: PropTypes.number.isRequired,
    gA7: PropTypes.number.isRequired,
    gA8: PropTypes.number.isRequired,

    gFunctionChoice: PropTypes.number.isRequired,
    gToggle: PropTypes.bool.isRequired,

    displaySliders: PropTypes.bool.isRequired
};
