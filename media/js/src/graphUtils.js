import {
    defaults as linearDemandSupplySurplusDefaults
} from './graphs/LinearDemandSupplySurplus.js';
import {defaults as taxRevenueDefaults} from './graphs/TaxRevenueGraph.js';
import {
    defaults as optimalChoiceConsumptionDefaults,
    untoggledDefaults as untoggledOptimalChoiceConsumptionDefaults
} from './graphs/OptimalChoiceConsumption.js';
import {
    defaults as costFunctionsDefaults
} from './graphs/CostFunctionsGraph.js';
import {
    defaults as costMinimizingDefaults
} from './graphs/OptimalChoiceCostMinimizing.js';
import {
    defaults as cobbDouglasDefaults
} from './graphs/CobbDouglasGraph.js';
import {
    defaults as externalitiesProducerDefaults
} from './graphs/NegativeProductionExternalityProducerGraph.js';
import {
    defaults as externalitiesIndustryDefaults
} from './graphs/NegativeProductionExternalityIndustryGraph.js';
import {
    defaults as externalitiesPositiveIndustryDefaults
} from './graphs/PositiveExternalityIndustryGraph.js';

/**
 * Set defaults to the given state update object based on toggle and
 * function choice.
 *
 * Returns an object.
 */
const setDefaults = function(
    updateObj, defaults, untoggledDefaults, functionChoice
) {
    if (Object.hasOwn(updateObj, 'gFunctionChoice')) {
        Object.assign(
            updateObj,
            defaults[updateObj.gFunctionChoice]);
    }

    if (Object.hasOwn(updateObj, 'gToggle')) {
        if (updateObj.gToggle) {
            Object.assign(
                updateObj,
                defaults[functionChoice]);
        } else {
            Object.assign(updateObj, untoggledDefaults);
        }
    }

    return updateObj;
};

/**
 * Given a graph type and a state update object,
 * modify the state based on if it contains alterations
 * to properties such as gFunctionChoice and gToggle.
 *
 * Returns an object.
 */
export const setDynamicGraphDefaults = function(state, updateObj) {
    if (state.gType === 17) {
        updateObj = setDefaults(
            updateObj, optimalChoiceConsumptionDefaults,
            untoggledOptimalChoiceConsumptionDefaults,
            state.gFunctionChoice);
    } else if (state.gType === 18) {
        updateObj = setDefaults(
            updateObj, costFunctionsDefaults,
            costFunctionsDefaults,
            state.gFunctionChoice);
    } else if (state.gType === 21) {
        updateObj = setDefaults(
            updateObj,
            costMinimizingDefaults,
            {gXAxisMax: 1000, gYAxisMax: 1000},
            state.gFunctionChoice);
    } else if (state.gType === 22 || state.gType === 24) {
        updateObj = setDefaults(
            updateObj,
            taxRevenueDefaults,
            taxRevenueDefaults,
            state.gFunctionChoice);
    } else if (state.gType === 25) {
        updateObj = setDefaults(
            updateObj,
            linearDemandSupplySurplusDefaults,
            linearDemandSupplySurplusDefaults,
            state.gFunctionChoice);
    }

    return updateObj;
};

/**
 * Get the initial/default state for a graph type.
 *
 * Returns an object.
 */
export const getDefaultGraphState = function(graphType, state) {
    // Specific defaults based on graph type.

    if (graphType == 3) {
        Object.assign(state, cobbDouglasDefaults);
    } else if (graphType === 15) {
        state.gA4 = 0.5;
    } else if (graphType === 17) {
        Object.assign(
            state, untoggledOptimalChoiceConsumptionDefaults);
    } else if (graphType === 18) {
        Object.assign(state, costFunctionsDefaults[0]);
    } else if (graphType === 21) {
        Object.assign(state, {
            gA1: 5,
            gA2: 10,
            gA3: 2500,
            gA4: 0.5,
            gA5: 0.5,
            gA6: 0,
            gA7: 0,
            gA8: 0,
            gXAxisMax: 1000,
            gYAxisMax: 1000
        });
    } else if (graphType === 22 || graphType === 24) {
        Object.assign(
            state, taxRevenueDefaults[0]);
    } else if (graphType === 23) {
        Object.assign(state, {
            gA1: 1500,
            gA2: 100,
            gA3: 0,
            gLine1Slope: 2,
            gLine2Slope: 2,
            gXAxisMax: 1000,
            gYAxisMax: 2500
        });
    } else if (graphType === 25) {
        Object.assign(state, linearDemandSupplySurplusDefaults[0]);
    } else if (graphType === 26) {
        Object.assign(state, externalitiesProducerDefaults[0]);
    } else if (graphType === 27) {
        Object.assign(state, externalitiesIndustryDefaults[0]);
    } else if (graphType === 28) {
        Object.assign(state, externalitiesPositiveIndustryDefaults[0]);
    }

    return state;
};
