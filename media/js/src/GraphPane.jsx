import React from 'react';
import PropTypes from 'prop-types';
import {
    eq, ep, cos, pos, tos, taxur, taxar, dwlu
} from './graphs/TaxationLinearDemandSupplyGraph.js';
import {
    LinearDemandSupplySurplus
} from './graphs/LinearDemandSupplySurplus.js';

/**
 * GraphPane
 *
 * This component is used to display textual graph values, based on
 * Mathematica's Pane object.
 */
export default function GraphPane({
    gType, gA1, gA2, gA3, gA4, gA5, gLine1Slope, gLine2Slope,
    gToggle, gFunctionChoice
}) {
    if (typeof gType === 'undefined' || gType === null) {
        return null;
    }

    if (gType === 23) {
        let taxRevenue = null;
        if (gToggle && gFunctionChoice === 0) {
            taxRevenue = taxur(gA1, gLine2Slope, gA2, gLine1Slope, gA3).toFixed(2);
        } else if (gToggle && gFunctionChoice === 1) {
            taxRevenue = taxar(gA1, gLine2Slope, gA2, gLine1Slope, gA3).toFixed(2);
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
                            Tax Revenue T = {taxRevenue}
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
    } else if (gType === 25) {
        const lineItems = LinearDemandSupplySurplus.getGraphPane(
            gFunctionChoice, gA1, gA2, gA3, gA4, gA5
        );

        return (
            <div className="mb-2">
                {lineItems.map((item, index) =>
                    <div key={index} className={`ep-text-${item.color}`}>
                        {item.label} = {item.value}
                    </div>
                )}
            </div>
        );
    }
}


GraphPane.propTypes = {
    gType: PropTypes.number,
    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gA4: PropTypes.number,
    gA5: PropTypes.number,
    gLine1Slope: PropTypes.number.isRequired,
    gLine2Slope: PropTypes.number.isRequired,
    gToggle: PropTypes.bool.isRequired,
    gFunctionChoice: PropTypes.number.isRequired,
};
