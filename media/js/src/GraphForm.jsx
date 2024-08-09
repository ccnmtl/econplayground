import React from 'react';
import ADASEditor from './editors/ADASEditor.jsx';
import CobbDouglasEditor from './editors/CobbDouglasEditor.jsx';
import CobbDouglasNLDSEditor from './editors/CobbDouglasNLDSEditor.jsx';
import ConsumptionLeisureEditor from './editors/ConsumptionLeisureEditor.jsx';
import ConsumptionSavingEditor from './editors/ConsumptionSavingEditor.jsx';
import DemandSupplyEditor from './editors/DemandSupplyEditor.jsx';
import NonLinearDemandSupplyEditor from './editors/NonLinearDemandSupplyEditor.jsx';
import OptimalChoiceConsumptionEditor from './editors/OptimalChoiceConsumption.jsx';
import CostFunctionsEditor from './editors/CostFunctionsEditor.jsx';
import OptimalChoiceCostMinimizingEditor from './editors/OptimalChoiceCostMinimizingEditor.jsx';
import TaxationLinearDemandEditor from './editors/TaxationLinearDemandEditor.jsx';
import TaxRevenueEditor from './editors/TaxRevenueEditor.jsx';
import RevenueElasticityEditor from './editors/RevenueElasticityEditor.jsx';

/**
 * GraphForm
 *
 * Based on graph type and attributes, display graph form inputs.
 */
export default function GraphForm({ gType, updateGraph, props }) {
    const commonViewerProps = {
        isInstructor: false,
        displayLabels: true,
        displaySliders: true,
        disabled: props.submitted
    };

    let graphForm = null;

    if (gType === 0 || gType === 9) {
        // Demand-Supply, possibly AUC (area under curve)
        graphForm =
            <DemandSupplyEditor
                updateGraph={updateGraph}
                showAUC={gType === 9}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 1 || gType === 10) {
        // Non-Linear Demand Supply, possibly AUC (area under curve)
        graphForm =
            <NonLinearDemandSupplyEditor
                updateGraph={updateGraph}
                showAUC={gType === 10}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 3 || gType === 12) {
        if (gType === 3) {
            graphForm =
                <CobbDouglasEditor
                    updateGraph={updateGraph}
                    {...commonViewerProps}
                    {...props}
                />;
        } else if (gType === 12) {
            graphForm =
                <CobbDouglasNLDSEditor
                    updateGraph={updateGraph}
                    showAUC={false}
                    {...commonViewerProps}
                    {...props}
                />;
        }
    } else if (gType === 5 || gType === 15) {
        // Consumption Leisure: Contraint and Optimal Choice
        graphForm =
            <ConsumptionLeisureEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 7 || gType === 11) {
        // Consumption-Saving
        graphForm =
            <ConsumptionSavingEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 8) {
        // Aggregate Demand - Aggregate Supply
        graphForm =
            <ADASEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 13 || gType === 14) {
        if (gType === 13) {
            graphForm =
                <DemandSupplyEditor
                    updateGraph={updateGraph}
                    showAUC={gType === 9}
                    {...commonViewerProps}
                    {...props}
                />;
        } else if (gType === 14) {
            // Non-Linear Demand Supply horiz. joint graph
            graphForm =
                <NonLinearDemandSupplyEditor
                    updateGraph={updateGraph}
                    showAUC={gType === 10}
                    {...commonViewerProps}
                    {...props}
                />;
        }
    } else if (gType === 17) {
        // Optimal Choice Consumption Graph
        graphForm =
            <OptimalChoiceConsumptionEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 18) {
        // Cost Functions
        graphForm =
            <CostFunctionsEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    }else if (gType === 20) {
        // Cost Function: Unit
        graphForm =
            <RevenueElasticityEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    }  else if (gType === 21) {
        // Optimal Choice: Cost-Minimizing Production Inputs
        graphForm =
            <OptimalChoiceCostMinimizingEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 22) {
        // Taxation: Linear Demand
        graphForm =
            <TaxRevenueEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 23) {
        graphForm =
            <TaxationLinearDemandEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    } else if (gType === 24) {
        // Taxation: Linear Demand
        graphForm =
            <TaxRevenueEditor
                updateGraph={updateGraph}
                {...commonViewerProps}
                {...props}
            />;
    }

    return graphForm;
}
