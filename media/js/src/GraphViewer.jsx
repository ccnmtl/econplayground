import React from 'react';
import PropTypes from 'prop-types';
import * as commonmark from 'commonmark';

import ADASEditor from './editors/ADASEditor.jsx';
import CobbDouglasEditor from './editors/CobbDouglasEditor.jsx';
import CobbDouglasNLDSEditor from './editors/CobbDouglasNLDSEditor.jsx';
import ConsumptionLeisureEditor from './editors/ConsumptionLeisureEditor.jsx';
import ConsumptionSavingEditor from './editors/ConsumptionSavingEditor.jsx';
import DemandSupplyEditor from './editors/DemandSupplyEditor.jsx';
import LinearDemandSupplySurplusEditor from './editors/LinearDemandSupplySurplusEditor.jsx';
import NonLinearDemandSupplyEditor from './editors/NonLinearDemandSupplyEditor.jsx';
import TemplateGraphEditor from './editors/TemplateGraphEditor.jsx';
import OptimalChoiceConsumptionEditor from './editors/OptimalChoiceConsumption.jsx';
import CostFunctionsEditor from './editors/CostFunctionsEditor.jsx';
import OptimalChoiceCostMinimizingEditor from './editors/OptimalChoiceCostMinimizingEditor.jsx';
import TaxationLinearDemandEditor from './editors/TaxationLinearDemandEditor.jsx';
import NegativeProductionExternalityProducerEditor from
    './editors/NegativeProductionExternalityProducerEditor.jsx';
import NegativeProductionExternalityIndustryEditor from
    './editors/NegativeProductionExternalityIndustryEditor.jsx';
import PositiveExternalityIndustryEditor from
    './editors/PositiveExternalityIndustryEditor.jsx';

import ExportGraphButton from './buttons/ExportGraphButton.jsx';
import ResetGraphButton from './buttons/ResetGraphButton.jsx';
import JXGBoard from './JXGBoard.jsx';
import Feedback from './Feedback.jsx';
import {BOARD_WIDTH, BOARD_HEIGHT} from './utils';
import RevenueElasticityEditor from './editors/RevenueElasticityEditor.jsx';
import TaxRevenueEditor from './editors/TaxRevenueEditor.jsx';


/**
 * This component is used to view an econgraph object.
 */
export default class GraphViewer extends React.Component {
    constructor(props) {
        super(props);

        this.initialState = {
            currentFeedback: [],
            score: 0
        };
        this.state = this.initialState;
        this.updateGraph = this.updateGraph.bind(this);
    }

    render() {
        let action = '';
        if (window.EconPlayground && window.EconPlayground.LTIPostGrade) {
            action = window.EconPlayground.LTIPostGrade;
        }

        let successUrl = '/';
        if (window.EconPlayground && window.EconPlayground.EmbedSuccess) {
            successUrl = window.EconPlayground.EmbedSuccess;
        }

        let launchUrl = '';
        if (window.EconPlayground && window.EconPlayground.EmbedLaunchUrl) {
            launchUrl = window.EconPlayground.EmbedLaunchUrl;
        }

        let isInstructor = false;
        if (window.EconPlayground && window.EconPlayground.isInstructor) {
            isInstructor = window.EconPlayground.isInstructor;
        }

        const displayLabels = isInstructor ||
            this.props.gAssignmentType === 0 ||
            this.props.gAssignmentType === 1;

        const displaySliders = isInstructor ||
            this.props.gAssignmentType === 0 ||
            this.props.gAssignmentType === 2;

        let token = null;
        const tokenEl = document.getElementById('csrf-token');
        if (tokenEl) {
            token = tokenEl.getAttribute('content');
        }

        let initialState = this.initialState;

        let key = '';
        for (key in this.props) {
            if (key.endsWith('Initial')) {
                initialState[key.replace(/Initial$/, '')] = this.props[key];
            }
        }

        let titleEl = <h1></h1>;
        let instructionsEl = <p></p>;

        if (!window.EconPlayground.hideTitleAndInstructions) {
            titleEl = <h1>{this.props.gTitle}</h1>;
        }

        if (!window.EconPlayground.hideTitleAndInstructions && this.props.gInstructions) {
            const reader = new commonmark.Parser();
            const writer = new commonmark.HtmlRenderer();
            const parsed = reader.parse(this.props.gInstructions);
            const instructions = writer.render(parsed);

            instructionsEl = <p className="lead" dangerouslySetInnerHTML={{__html:instructions}}></p>;
        }

        const commonViewerProps = {
            isInstructor: isInstructor,
            displayLabels: displayLabels,
            displaySliders: displaySliders,
            updateGraph: this.updateGraph,
        };

        let leftSide = (
            <p>Loading...</p>
        );
        if (
            typeof this.props.gType !== 'undefined' &&
                this.props.gType !== null
        ) {
            leftSide = (
                <JXGBoard
                    id={'editing-graph'}
                    width={BOARD_WIDTH}
                    height={BOARD_HEIGHT}
                    shadow={!isInstructor}
                    {...this.props}
                />
            );
        }

        let rightSide = (
            <p>Loading...</p>
        );

        if (this.props.gType === 0 || this.props.gType === 9) {
            // Demand-Supply, possibly AUC (area under curve)
            rightSide =
                <DemandSupplyEditor
                    showAUC={this.props.gType === 9}
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 1 || this.props.gType === 10) {
            // Non-Linear Demand Supply, possibly AUC (area under curve)
            rightSide =
                <NonLinearDemandSupplyEditor
                    showAUC={this.props.gType === 10}
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 3 || this.props.gType === 12) {
            if (this.props.gType === 3) {
                rightSide =
                    <CobbDouglasEditor
                        {...commonViewerProps}
                        {...this.props}
                    />;
            } else if (this.props.gType === 12) {
                rightSide =
                    <CobbDouglasNLDSEditor
                        showAUC={false}
                        {...commonViewerProps}
                        {...this.props}
                    />;
            }
        } else if (this.props.gType === 5 || this.props.gType === 15) {
            // Consumption Leisure: Contraint and Optimal Choice
            rightSide =
                <ConsumptionLeisureEditor
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 7 || this.props.gType === 11) {
            // Consumption-Saving
            rightSide =
                <ConsumptionSavingEditor
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 8) {
            // Aggregate Demand - Aggregate Supply
            rightSide =
                <ADASEditor
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 13 || this.props.gType === 14) {
            if (this.props.gType === 13) {
                rightSide =
                    <DemandSupplyEditor
                        showAUC={this.props.gType === 9}
                        {...commonViewerProps}
                        {...this.props}
                    />;
            } else if (this.props.gType === 14) {
            // Non-Linear Demand Supply horiz. joint graph
                rightSide =
                    <NonLinearDemandSupplyEditor
                        showAUC={this.props.gType === 10}
                        {...commonViewerProps}
                        {...this.props}
                    />;
            }

            // Show side-by-side view here.
            return (
                <div className="GraphViewer">
                    {titleEl}
                    {instructionsEl}
                    <form action={action} method="post">
                        <input type="hidden" name="csrfmiddlewaretoken" value={token} />
                        <input type="hidden" name="score" value={this.state.score} />
                        <input type="hidden" name="next" value={successUrl} />
                        <input type="hidden" name="launchUrl" value={launchUrl} />

                        <div className="row">
                            {leftSide}
                        </div>

                        <Feedback feedback={this.state.currentFeedback} />

                        {rightSide}

                        <hr />

                        <ResetGraphButton
                            initialState={initialState}
                            updateGraph={this.updateGraph} />

                        <ExportGraphButton />
                    </form>
                </div>
            );
        } else if (this.props.gType === 16) {
            // Template Graph: free-form equations
            rightSide =
                <TemplateGraphEditor
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 17) {
            //Optimal Choice Consumption
            rightSide =
                <OptimalChoiceConsumptionEditor
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 18) {
            rightSide =
                <CostFunctionsEditor
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 20) {
            rightSide =
                <RevenueElasticityEditor
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 21) {
            rightSide =
                <OptimalChoiceCostMinimizingEditor
                    updateGraph={this.props.updateGraph}
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 22) {
            rightSide =
                <TaxRevenueEditor
                    updateGraph={this.props.updateGraph}
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 23) {
            rightSide =
                <TaxationLinearDemandEditor
                    updateGraph={this.props.updateGraph}
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 24) {
            rightSide =
                <TaxRevenueEditor
                    updateGraph={this.props.updateGraph}
                    {...commonViewerProps}
                    {...this.props}
                />;

            return (
                <div className="GraphViewer">
                    {titleEl}
                    {instructionsEl}
                    <form action={action} method="post">
                        <input type="hidden" name="csrfmiddlewaretoken" value={token} />
                        <input type="hidden" name="score" value={this.state.score} />
                        <input type="hidden" name="next" value={successUrl} />
                        <input type="hidden" name="launchUrl" value={launchUrl} />

                        <div className="row">
                            {leftSide}
                        </div>

                        <Feedback feedback={this.state.currentFeedback} />

                        {rightSide}

                        <hr />

                        <ResetGraphButton
                            initialState={initialState}
                            updateGraph={this.updateGraph} />

                        <ExportGraphButton />
                    </form>
                </div>
            );
        } else if (this.props.gType === 25) {
            rightSide =
                <LinearDemandSupplySurplusEditor
                    updateGraph={this.props.updateGraph}
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 26) {
            rightSide =
                <NegativeProductionExternalityProducerEditor
                    updateGraph={this.props.updateGraph}
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 27) {
            rightSide =
                <NegativeProductionExternalityIndustryEditor
                    updateGraph={this.props.updateGraph}
                    {...commonViewerProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 28) {
            rightSide =
                <PositiveExternalityIndustryEditor
                    updateGraph={this.props.updateGraph}
                    {...commonViewerProps}
                    {...this.props}
                />;
        }

        return (
            <div className="GraphViewer">
                {titleEl}
                {instructionsEl}
                <form action={action} method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value={token} />
                    <input type="hidden" name="score" value={this.state.score} />
                    <input type="hidden" name="next" value={successUrl} />
                    <input type="hidden" name="launchUrl" value={launchUrl} />

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="sticky-top">
                                {leftSide}

                                <Feedback feedback={this.state.currentFeedback} />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            {rightSide}

                            <hr />

                            <ResetGraphButton
                                initialState={initialState}
                                updateGraph={this.updateGraph} />

                            <ExportGraphButton />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
    updateGraph(state) {
        this.setState({currentFeedback: state.currentFeedback});
        return this.props.updateGraph(state);
    }
}

GraphViewer.propTypes = {
    gId: PropTypes.number,
    gType: PropTypes.number,
    gTitle: PropTypes.string,
    gInstructions: PropTypes.string,
    gAssignmentType: PropTypes.number.isRequired,

    gShowIntersection: PropTypes.bool.isRequired,
    gDisplayIntersection1: PropTypes.bool.isRequired,
    gDisplayIntersection1Initial: PropTypes.bool,
    gIntersectionLabel: PropTypes.string.isRequired,
    gDisplayIntersection2: PropTypes.bool.isRequired,
    gDisplayIntersection2Initial: PropTypes.bool,
    gIntersection2Label: PropTypes.string.isRequired,
    gDisplayIntersection3: PropTypes.bool.isRequired,
    gDisplayIntersection3Initial: PropTypes.bool,
    gIntersection3Label: PropTypes.string.isRequired,
    gDisplayShadow: PropTypes.bool.isRequired,

    gIntersectionHorizLineLabel: PropTypes.string,
    gIntersectionVertLineLabel: PropTypes.string,
    gIntersection2HorizLineLabel: PropTypes.string,
    gIntersection2VertLineLabel: PropTypes.string,
    gIntersection3HorizLineLabel: PropTypes.string,
    gIntersection3VertLineLabel: PropTypes.string,

    gDisplayFeedback: PropTypes.bool,

    gLine1Label: PropTypes.string.isRequired,
    gLine2Label: PropTypes.string.isRequired,
    gLine3Label: PropTypes.string.isRequired,
    gLine4Label: PropTypes.string,

    gXAxisLabel: PropTypes.string,
    gYAxisLabel: PropTypes.string,
    gXAxis2Label: PropTypes.string,
    gYAxis2Label: PropTypes.string,
    gLine1Slope: PropTypes.number.isRequired,
    gLine1SlopeInitial: PropTypes.number,
    gLine2Slope: PropTypes.number,
    gLine2SlopeInitial: PropTypes.number,
    gLine3Slope: PropTypes.number,
    gLine3SlopeInitial: PropTypes.number,
    gLine4Slope: PropTypes.number,
    gLine4SlopeInitial: PropTypes.number,

    gLine1OffsetX: PropTypes.number.isRequired,
    gLine1OffsetY: PropTypes.number.isRequired,
    gLine1OffsetXInitial: PropTypes.number,
    gLine1OffsetYInitial: PropTypes.number,
    gLine2OffsetX: PropTypes.number.isRequired,
    gLine2OffsetY: PropTypes.number.isRequired,
    gLine2OffsetXInitial: PropTypes.number,
    gLine2OffsetYInitial: PropTypes.number,
    gLine3OffsetX: PropTypes.number.isRequired,
    gLine3OffsetY: PropTypes.number.isRequired,
    gLine3OffsetXInitial: PropTypes.number,
    gLine3OffsetYInitial: PropTypes.number,
    gLine4OffsetX: PropTypes.number.isRequired,
    gLine4OffsetY: PropTypes.number.isRequired,
    gLine4OffsetXInitial: PropTypes.number,
    gLine4OffsetYInitial: PropTypes.number,

    gLine1Dashed: PropTypes.bool.isRequired,
    gLine2Dashed: PropTypes.bool.isRequired,
    gLine3Dashed: PropTypes.bool.isRequired,

    gA1: PropTypes.number,
    gA1Name: PropTypes.string,
    gA1Initial: PropTypes.number,

    gA2: PropTypes.number,
    gA2Name: PropTypes.string,
    gA2Initial: PropTypes.number,

    gA3: PropTypes.number,
    gA3Name: PropTypes.string,
    gA3Initial: PropTypes.number,

    gA4: PropTypes.number,
    gA4Name: PropTypes.string,
    gA4Initial: PropTypes.number,

    gA5: PropTypes.number,
    gA5Name: PropTypes.string,
    gA5Initial: PropTypes.number,

    gA6: PropTypes.number,
    gA7: PropTypes.number,
    gA8: PropTypes.number,

    gA: PropTypes.number,
    gK: PropTypes.number,
    gR: PropTypes.number,
    gY1: PropTypes.number,
    gY2: PropTypes.number,

    gXAxisMax: PropTypes.number,
    gXAxisMin: PropTypes.number,
    gYAxisMax: PropTypes.number,
    gYAxisMin: PropTypes.number,

    gCobbDouglasA: PropTypes.number,
    gCobbDouglasAInitial: PropTypes.number,
    gCobbDouglasAName: PropTypes.string,
    gCobbDouglasL: PropTypes.number,
    gCobbDouglasLInitial: PropTypes.number,
    gCobbDouglasLName: PropTypes.string,
    gCobbDouglasK: PropTypes.number,
    gCobbDouglasKInitial: PropTypes.number,
    gCobbDouglasKName: PropTypes.string,
    gCobbDouglasAlpha: PropTypes.number,
    gCobbDouglasAlphaInitial: PropTypes.number,
    gCobbDouglasYName: PropTypes.string,

    gNName: PropTypes.string,

    gFunctionChoice: PropTypes.number,
    gToggle: PropTypes.bool,
    gExpression: PropTypes.string,
    gExpression2: PropTypes.string,
    gExpression3: PropTypes.string,

    updateGraph: PropTypes.func.isRequired
};
