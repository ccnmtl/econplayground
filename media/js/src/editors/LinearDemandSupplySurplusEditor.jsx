import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.jsx';
import { handleFormUpdate } from '../utils.js';

export default class LinearDemandSupplySurplusEditor extends React.Component {
    render() {
        const demandSupplyOptions = [
            'Linear Demand and Supply',
            'with Welfare Analysis',
            'Imports and Exports',
            'Price Controls',
            'Quantity Controls',
        ];

        const radioButtons = demandSupplyOptions.map((optionTitle, idx) =>
            <div key={idx} className="form-check">
                <input
                    type="radio" id={`functionChoice-${idx}`}
                    className="form-check-input"
                    value={idx}
                    name="gFunctionChoice"
                    checked={this.props.gFunctionChoice === idx}
                    onChange={handleFormUpdate.bind(this)} />
                <label
                    className="form-check-label"
                    htmlFor={`functionChoice-${idx}`}>
                    {optionTitle}
                </label>
            </div>
        );

        return (
            <>
                {radioButtons}

                <div>
                    {this.props.displaySliders && (
                        <>
                            <RangeEditor
                                label="Choke Price"
                                rawLabel={true}
                                id="gA1"
                                value={this.props.gA1}
                                min={0}
                                max={10000}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label="Demand Slope"
                                rawLabel={true}
                                id="gA2"
                                value={this.props.gA2}
                                min={0.01}
                                max={35}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label="Reservation Price"
                                rawLabel={true}
                                id="gA3"
                                value={this.props.gA3}
                                min={0}
                                max={10000}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label="Supply Slope"
                                rawLabel={true}
                                id="gA4"
                                value={this.props.gA4}
                                min={0.01}
                                max={35}
                                handler={handleFormUpdate.bind(this)} />
                        </>
                    )}
                    {(
                        this.props.gFunctionChoice === 2 ||
                            this.props.gFunctionChoice === 3
                    ) && (
                        <RangeEditor
                            label="Global Price"
                            rawLabel={true}
                            id="gA5"
                            value={this.props.gA5}
                            min={0}
                            max={this.props.gA1}
                            handler={handleFormUpdate.bind(this)} />
                    )}
                </div>
            </>
        );
    }
}

LinearDemandSupplySurplusEditor.propTypes = {
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gA4: PropTypes.number.isRequired,
    gA5: PropTypes.number,

    gFunctionChoice: PropTypes.number.isRequired,
    gToggle: PropTypes.bool.isRequired,

    displaySliders: PropTypes.bool.isRequired
};
