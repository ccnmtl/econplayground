import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.jsx';
import { handleFormUpdate } from '../utils.js';

function MonopolyUniformPricingEditor(props) {
    const modesLeft = [
        'Outcome',
        'vs. Perfectly Competitive Market',
    ];
    let modesRight = [
        'Welfare Analysis',
    ];
    if (props.gType === 29) {
        modesRight.push('Linear Demand - Marginal Revenue');
        modesRight.push('Linear Demand - Revenue');
    }

    const radioButtons1 = modesLeft.map((optionTitle, idx) =>
        <div key={idx} className="form-check">
            <input
                type="radio" id={`functionChoice-${idx}`}
                className="form-check-input"
                value={idx}
                name="gFunctionChoice"
                checked={props.gFunctionChoice === idx}
                onChange={(e) => handleFormUpdate(e, props)} />
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
                    checked={props.gFunctionChoice === newIdx}
                    onChange={(e) => handleFormUpdate(e, props)} />
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
                {props.displaySliders && (
                    <>
                        <RangeEditor
                            label="Choke Price"
                            rawLabel={true}
                            id="gA1"
                            value={props.gA1}
                            min={0}
                            max={10000}
                            handler={(e) => handleFormUpdate(e, props)} />

                        <RangeEditor
                            label="Demand Slope"
                            rawLabel={true}
                            id="gA2"
                            value={props.gA2}
                            min={0.01}
                            max={35}
                            handler={(e) => handleFormUpdate(e, props)} />

                        <RangeEditor
                            label="Reservation Price"
                            rawLabel={true}
                            id="gA3"
                            value={props.gA3}
                            min={0}
                            max={10000}
                            handler={(e) => handleFormUpdate(e, props)} />

                        <RangeEditor
                            label="Supply Slope"
                            rawLabel={true}
                            id="gA4"
                            value={props.gA4}
                            min={0.01}
                            max={35}
                            handler={(e) => handleFormUpdate(e, props)} />
                    </>
                )}
            </div>
        </>
    );
}

MonopolyUniformPricingEditor.propTypes = {
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gA4: PropTypes.number.isRequired,

    gFunctionChoice: PropTypes.number.isRequired,
    displaySliders: PropTypes.bool.isRequired
};

export default MonopolyUniformPricingEditor;
