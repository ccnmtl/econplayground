import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.js';
import Checkbox from '../form-components/Checkbox.js';
import { handleFormUpdate } from '../utils.js';

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
                <label className="form-check-label" htmlFor={`functionChoice-${idx}`}>
                    {optionTitle}
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

                <hr />

                <div>
                    {this.props.displaySliders && (
                        <>
                            <RangeEditor
                                itemlabel="w"
                                id="gA1"
                                dataId="gA1"
                                value={this.props.gA1}
                                min={0}
                                max={30}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                itemlabel="r"
                                id="gA2"
                                dataId="gA2"
                                value={this.props.gA2}
                                min={0.01}
                                max={30}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                itemlabel={this.props.gToggle ? 'q' : 'c'}
                                id="gA3"
                                dataId="gA3"
                                value={this.props.gA3}
                                min={0}
                                max={5000}
                                handler={handleFormUpdate.bind(this)} />

                            {this.props.gToggle && (
                                <>
                                    <RangeEditor
                                        itemlabel="\alpha"
                                        id="gA4"
                                        dataId="gA4"
                                        value={this.props.gA4}
                                        min={0.01}
                                        max={1}
                                        handler={handleFormUpdate.bind(this)} />
                                    <RangeEditor
                                        itemlabel="\beta"
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

    gFunctionChoice: PropTypes.number.isRequired,
    gToggle: PropTypes.bool.isRequired,

    displaySliders: PropTypes.bool.isRequired
};
