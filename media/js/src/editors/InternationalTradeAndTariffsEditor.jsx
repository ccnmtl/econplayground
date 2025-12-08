import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.jsx';
import { handleFormUpdate } from '../utils.js';

export default class InternationalTradeAndTariffsEditor extends React.Component {
    render() {
        const me = this;

        const modesLeft = [
            'Demand and Supply - Imports and Exports',
            'Demand and Supply - Consumer and Producer Surplus',
        ];
        const modesRight = [
        ];

        const radioButtons1 = modesLeft.map((optionTitle, idx) =>
            <div key={idx} className="form-check">
                <input
                    type="radio" id={`functionChoice-${idx}`}
                    className="form-check-input"
                    value={idx}
                    name="gFunctionChoice"
                    checked={me.props.gFunctionChoice === idx}
                    onChange={handleFormUpdate.bind(me)} />
                <label
                    className="form-check-label"
                    htmlFor={`functionChoice-${idx}`}>
                    {optionTitle}
                </label>
            </div>
        );

        const radioButtons2 = modesRight.map(function(optionTitle, idx) {
            const newIdx = idx + modesLeft.length;
            return (
                <div key={newIdx} className="form-check">
                    <input
                        type="radio" id={`functionChoice-${newIdx}`}
                        className="form-check-input"
                        value={newIdx}
                        name="gFunctionChoice"
                        checked={me.props.gFunctionChoice === newIdx}
                        onChange={handleFormUpdate.bind(me)} />
                    <label
                        className="form-check-label"
                        htmlFor={`functionChoice-${newIdx}`}>
                        {optionTitle}
                    </label>
                </div>
            );
        });

        return (
            <>
                <div className="row">
                    <div className="col">
                        {radioButtons1}
                    </div>
                    <div className="col">
                        {radioButtons2}
                    </div>
                </div>

                <div>
                    {this.props.displaySliders && (
                        <>
                            <RangeEditor
                                label="Domestic Choke Price"
                                rawLabel={true}
                                id="gA1"
                                value={this.props.gA1}
                                min={0}
                                max={10000}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label="Domestic Demand Slope"
                                rawLabel={true}
                                id="gA2"
                                value={this.props.gA2}
                                min={0.01}
                                max={35}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label="Domestic Reservation Price"
                                rawLabel={true}
                                id="gA3"
                                value={this.props.gA3}
                                min={0}
                                max={10000}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label="Domestic Supply Slope"
                                rawLabel={true}
                                id="gA4"
                                value={this.props.gA4}
                                min={0.01}
                                max={35}
                                handler={handleFormUpdate.bind(this)} />

                            <RangeEditor
                                label="Global Price"
                                rawLabel={true}
                                id="gA5"
                                value={this.props.gA5}
                                min={0}
                                max={this.props.gA1}
                                handler={handleFormUpdate.bind(this)} />
                        </>
                    )}
                </div>
            </>
        );
    }
}

InternationalTradeAndTariffsEditor.propTypes = {
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gA4: PropTypes.number.isRequired,
    gA5: PropTypes.number.isRequired,
    gA6: PropTypes.number,

    gFunctionChoice: PropTypes.number.isRequired,
    gToggle: PropTypes.bool.isRequired,

    displaySliders: PropTypes.bool.isRequired
};
