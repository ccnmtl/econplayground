import React from 'react';
import PropTypes from 'prop-types';
import {
    eq, ep, cos, pos, tos, taxur, dwlu
} from './graphs/TaxationLinearDemandSupplyGraph.js';

/**
 * GraphPane
 *
 * This component is used to display textual graph values, based on
 * Mathematica's Pane object.
 */
export default function GraphPane({
    gType, gA1, gA2, gA3, gLine1Slope, gLine2Slope,
    gToggle, gFunctionChoice
}) {
    if (typeof gType === 'undefined' || gType === null || gType !== 23) {
        return null;
    }

    return (
        <div className="mb-2">
            <div className="ep-text-red">
                Equilibrium Quantity Q* = {
                    eq(gA1, gLine2Slope, gA2, gLine1Slope).toFixed(2)
                }
            </div>
            <div className="ep-text-red">
                Equilibrium Price P* = {
                    ep(gA1, gLine2Slope, gA2, gLine1Slope).toFixed(2)
                }
            </div>
            <div className="ep-text-blue">
                Consumer Surplus CS = {
                    cos(gA1, gLine2Slope, gA2, gLine1Slope).toFixed(2)
                }
            </div>
            <div className="ep-text-orange">
                Producer Surplus PS = {
                    pos(gA1, gLine2Slope, gA2, gLine1Slope).toFixed(2)
                }
            </div>
            {gToggle && (
                <>
                    <div className="ep-text-green">
                        Tax Revenue T = {
                            taxur(gA1, gLine2Slope, gA2, gLine1Slope, gA3).toFixed(2)
                        }
                    </div>

                    <div className="ep-text-red">
                        Deadweight Loss DWL = {
                            dwlu(gA1, gLine2Slope, gA2, gLine1Slope, gA3).toFixed(2)
                        }
                    </div>
                </>
            )}
            <div className="ep-text-red">
                Total Surplus TS = {
                    tos(gA1, gLine2Slope, gA2, gLine1Slope).toFixed(2)
                }
            </div>
        </div>
    );
}


GraphPane.propTypes = {
    gType: PropTypes.number,
    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gLine1Slope: PropTypes.number.isRequired,
    gLine2Slope: PropTypes.number.isRequired,
    gToggle: PropTypes.bool.isRequired,
    gFunctionChoice: PropTypes.number.isRequired,
};
