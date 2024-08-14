import { getGraphClass } from '../graphs/graphTypes.js';

/**
 * getRuleOptions
 *
 * Get the appropriate rule options based on graph type.
 */
export const getRuleOptions = (graphType) => {
    let ruleOptions = [];

    const graphClass = getGraphClass(graphType);
    if (graphClass && graphClass.getRuleOptions) {
        ruleOptions = graphClass.getRuleOptions();
    }

    return ruleOptions;
};
