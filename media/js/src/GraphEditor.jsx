import React from 'react';
import PropTypes from 'prop-types';

import ADASEditor from './editors/ADASEditor.jsx';
import CobbDouglasEditor from './editors/CobbDouglasEditor.jsx';
import CobbDouglasNLDSEditor from './editors/CobbDouglasNLDSEditor.jsx';
import NonLinearDemandSupplyEditor from './editors/NonLinearDemandSupplyEditor.jsx';
import ConsumptionLeisureEditor from './editors/ConsumptionLeisureEditor.jsx';
import ConsumptionSavingEditor from './editors/ConsumptionSavingEditor.jsx';
import DemandSupplyEditor from './editors/DemandSupplyEditor.jsx';
import LinearDemandSupplySurplusEditor from './editors/LinearDemandSupplySurplusEditor.jsx';
import TemplateGraphEditor from './editors/TemplateGraphEditor.jsx';
import CommonGraphEditor from './editors/CommonGraphEditor.jsx';
import CommonGraphSettings from './editors/CommonGraphSettings.jsx';
import OptimalChoiceConsumptionEditor from './editors/OptimalChoiceConsumption.jsx';
import CostFunctionsEditor from './editors/CostFunctionsEditor.jsx';
import MonopolyUniformPricingEditor from
    './editors/MonopolyUniformPricingEditor.jsx';
import RevenueElasticityEditor from './editors/RevenueElasticityEditor.jsx';
import OptimalChoiceCostMinimizingEditor from './editors/OptimalChoiceCostMinimizingEditor.jsx';
import TaxationLinearDemandEditor from './editors/TaxationLinearDemandEditor.jsx';
import TaxRevenueEditor from './editors/TaxRevenueEditor.jsx';
import NegativeProductionExternalityProducerEditor from './editors/NegativeProductionExternalityProducerEditor.jsx';
import NegativeProductionExternalityIndustryEditor from './editors/NegativeProductionExternalityIndustryEditor.jsx';
import PositiveExternalityIndustryEditor from './editors/PositiveExternalityIndustryEditor.jsx';

import JXGBoard from './JXGBoard.jsx';
import GraphPane from './GraphPane.jsx';
import {
    displayGraphType, handleFormUpdate, getCohortId, BOARD_HEIGHT, BOARD_WIDTH,
} from './utils';


export default class GraphEditor extends React.Component {
    title() {
        return (
            <div>
                <h1>{displayGraphType(this.props.gType)}</h1>
                <p className="lead">
                    Add and modify the information of your graph.
                </p>
            </div>
        );
    }
    render() {
        const courseId = getCohortId(window.location.pathname);

        const editRow = (
            <div className="d-grid gap-2 d-md-block">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleSaveGraph.bind(this)}>
                    Save
                </button>

                <button
                    onClick={this.handleSaveAndViewGraph.bind(this)}
                    type="button"
                    className="btn btn-secondary ms-md-2">
                    Save and View
                </button>

                {this.props.gId &&
                 <React.Fragment>
                     <a
                         role="button"
                         className="btn btn-danger ms-md-2 float-md-end"
                         title="Delete Graph"
                         href={`/course/${courseId}/graph/${this.props.gId}/delete/`}
                     >
                         <svg alt="" height="32" className="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="24" aria-hidden="true">
                             <path fillRule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path>
                         </svg>
                         Delete Graph
                     </a>
                     <a
                         role="button"
                         className="btn btn-primary ms-md-2 float-md-end"
                         title="Clone Graph"
                         href={`/course/${courseId}/graph/${this.props.gId}/clone/`}
                     >
                         <svg alt="" height="32" className="me-1 octicon octicon-repo-clone" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
                             <path fillRule="evenodd" d="M15 0H9v7c0 .55.45 1 1 1h1v1h1V8h3c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1zm-4 7h-1V6h1v1zm4 0h-3V6h3v1zm0-2h-4V1h4v4zM4 5H3V4h1v1zm0-2H3V2h1v1zM2 1h6V0H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h2v2l1.5-1.5L6 16v-2h5c.55 0 1-.45 1-1v-3H2V1zm9 10v2H6v-1H3v1H1v-2h10zM3 8h1v1H3V8zm1-1H3V6h1v1z"></path>
                         </svg>
                         Clone Graph
                     </a>
                 </React.Fragment>
                }
            </div>
        );

        let rightSide = null;

        const commonEditorProps = {
            displayLabels: true,
            displaySliders: true,
            isInstructor: true
        };

        let jxgBoard = (
            <p>Loading...</p>
        );
        if (
            typeof this.props.gType !== 'undefined' &&
                this.props.gType !== null
        ) {
            jxgBoard = (
                <JXGBoard
                    id={'editing-graph'}
                    width={BOARD_WIDTH}
                    height={BOARD_HEIGHT}
                    {...this.props}
                />
            );
        }

        const common2Graph = (
            <>
                {jxgBoard}

                <div className="col-xl-6">
                    <h3>Scenario</h3>
                    <div className="form-group">
                        <label htmlFor="gTitle">
                            Title
                        </label>
                        <input
                            id="gTitle"
                            onChange={handleFormUpdate.bind(this)}
                            value={this.props.gTitle}
                            className="form-control form-control-sm"
                            type="text"
                            maxLength="140"
                        />
                    </div>

                    <CommonGraphEditor
                        {...this.props}
                    />

                    {this.props.gId &&
                    <div className="form-group mt-1">
                        <a href={`/course/${courseId}/graph/` + this.props.gId + '/public/'}
                            title="Student View"
                            className="btn btn-secondary"
                        >
                            Student View
                        </a>
                    </div>
                    }
                </div>
            </>
        );

        if (this.props.gType === 0 || this.props.gType === 9) {
            // Demand-Supply, possibly AUC (area under curve)
            rightSide =
                <DemandSupplyEditor
                    showAUC={this.props.gType === 9}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 13) {
            // Horizontal Joint Graph: two Linear Demand-Supply graphs
            return (
                <div className="GraphEditor">
                    {this.title()}
                    <form>
                        <div className="row">
                            {common2Graph}
                            <div className="col-xl-6">
                                <DemandSupplyEditor
                                    showAUC={this.props.gType === 9}
                                    {...commonEditorProps}
                                    {...this.props}
                                />
                                <CommonGraphSettings
                                    {...this.props}
                                />
                            </div>
                        </div>
                        <hr/>
                        {editRow}
                    </form>
                </div>
            );
        } else if (this.props.gType === 14) {
            // Horizontal Joint Graph: two Non-Linear Demand-Supply graphs
            return (
                <div className="GraphEditor">
                    {this.title()}
                    <form>
                        <div className="row">
                            {common2Graph}
                            <div className="col-xl-6">
                                <NonLinearDemandSupplyEditor
                                    hideFunctionChoice={true}
                                    showAUC={this.props.gType === 10}
                                    {...commonEditorProps}
                                    {...this.props}
                                />
                                <CommonGraphSettings
                                    {...this.props}
                                />
                            </div>
                        </div>
                        <hr/>
                        {editRow}
                    </form>
                </div>
            );
        } else if (this.props.gType === 1 || this.props.gType === 10) {
            // Non-Linear Demand Supply, possibly AUC (area under curve)
            rightSide =
                <NonLinearDemandSupplyEditor
                    showAUC={this.props.gType === 10}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 3 || this.props.gType === 12) {
            // Cobb-Douglas
            rightSide =
                <>
                    {this.props.gType === 3 && (
                        <CobbDouglasEditor
                            {...commonEditorProps}
                            {...this.props}
                        />
                    )}
                    {this.props.gType === 12 && (
                        <CobbDouglasNLDSEditor
                            showAUC={false}
                            {...commonEditorProps}
                            {...this.props}
                        />
                    )}
                </>;
        } else if (this.props.gType === 5 || this.props.gType === 15) {
            // Consumption Leisure: Contraint and Optimal Choice
            rightSide =
                <ConsumptionLeisureEditor
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 7 || this.props.gType === 11) {
            // Consumption Savings
            rightSide =
                <ConsumptionSavingEditor
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 8) {
            // Aggregate Demand - Aggregate Supply
            rightSide =
                <ADASEditor
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 16) {
            // Template Graph: free-form equations
            rightSide =
                <TemplateGraphEditor
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 17) {
            //Optimal Choice Consumption
            rightSide =
                <OptimalChoiceConsumptionEditor
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 18) {
            rightSide =
                <CostFunctionsEditor
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 20) {
            rightSide =
                <RevenueElasticityEditor
                    updateGraph={this.props.updateGraph}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 21) {
            rightSide =
                <OptimalChoiceCostMinimizingEditor
                    updateGraph={this.props.updateGraph}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 22) {
            rightSide =
                <TaxRevenueEditor
                    updateGraph={this.props.updateGraph}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 23) {
            rightSide =
                <TaxationLinearDemandEditor
                    updateGraph={this.props.updateGraph}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 24) {
            return (
                <div className="GraphEditor">
                    {this.title()}
                    <form>
                        <div className="row">
                            {common2Graph}
                            <div className="col-xl-6">
                                <TaxRevenueEditor
                                    showAUC={this.props.gType === 9}
                                    {...commonEditorProps}
                                    {...this.props}
                                />
                                <CommonGraphSettings
                                    {...this.props}
                                />
                            </div>
                        </div>
                        <hr/>
                        {editRow}
                    </form>
                </div>
            );
        } else if (this.props.gType === 25) {
            rightSide =
                <LinearDemandSupplySurplusEditor
                    updateGraph={this.props.updateGraph}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 26) {
            rightSide =
                <NegativeProductionExternalityProducerEditor
                    updateGraph={this.props.updateGraph}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 27) {
            rightSide =
                <NegativeProductionExternalityIndustryEditor
                    updateGraph={this.props.updateGraph}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 28) {
            rightSide =
                <PositiveExternalityIndustryEditor
                    updateGraph={this.props.updateGraph}
                    {...commonEditorProps}
                    {...this.props}
                />;
        } else if (this.props.gType === 29 || this.props.gType === 30) {
            rightSide =
                <MonopolyUniformPricingEditor
                    {...commonEditorProps}
                    {...this.props}
                />;
        }

        const hasIntersection = ![
            5, 16, 18, 19, 20, 22
        ].includes(this.props.gType);

        return (
            <div className="GraphEditor">
                {this.title()}
                <form>
                    <div className="row">
                        <div className="col-xl-6">
                            <div className="sticky-top">
                                <h3>Scenario</h3>
                                <div className="form-group">
                                    <label htmlFor="gTitle">
                                        Title
                                    </label>
                                    <input
                                        id="gTitle"
                                        onChange={handleFormUpdate.bind(this)}
                                        value={this.props.gTitle}
                                        className="form-control form-control-sm"
                                        type="text"
                                        maxLength="140"
                                    />
                                </div>

                                {/* leftSide */}
                                {jxgBoard}

                                <GraphPane {...this.props} />

                                <CommonGraphEditor {...this.props} />

                                {this.props.gId &&
                                    <div className="form-group mt-1">
                                        <a href={`/course/${courseId}/graph/` + this.props.gId + '/public/'}
                                            title="Student View"
                                            className="btn btn-secondary"
                                        >
                                            Student View
                                        </a>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <CommonGraphSettings
                                {...this.props}
                                enableIntersectionToggle={hasIntersection}
                            />
                            {rightSide}
                        </div>
                    </div>
                    <hr/>
                    {editRow}
                </form>
            </div>
        );
    }
    handleSaveGraph() {
        this.props.saveGraph();
    }
    handleSaveAndViewGraph() {
        this.props.saveAndViewGraph();
    }
}

GraphEditor.propTypes = {
    gId: PropTypes.number,
    gTitle: PropTypes.string,
    gSummary: PropTypes.string,
    gInstructions: PropTypes.string,
    gTopic: PropTypes.number,

    gShowIntersection: PropTypes.bool.isRequired,
    gDisplayIntersection1: PropTypes.bool.isRequired,
    gIntersectionLabel: PropTypes.string.isRequired,
    gDisplayIntersection2: PropTypes.bool.isRequired,
    gIntersection2Label: PropTypes.string.isRequired,
    gDisplayIntersection3: PropTypes.bool.isRequired,
    gIntersection3Label: PropTypes.string.isRequired,
    gDisplayShadow: PropTypes.bool.isRequired,

    gIntersectionHorizLineLabel: PropTypes.string.isRequired,
    gIntersectionVertLineLabel: PropTypes.string.isRequired,
    gIntersection2HorizLineLabel: PropTypes.string.isRequired,
    gIntersection2VertLineLabel: PropTypes.string.isRequired,
    gIntersection3HorizLineLabel: PropTypes.string.isRequired,
    gIntersection3VertLineLabel: PropTypes.string.isRequired,

    gIsPublished: PropTypes.bool.isRequired,
    gIsFeatured: PropTypes.bool.isRequired,
    gDisplayFeedback: PropTypes.bool.isRequired,
    gInstructorNotes: PropTypes.string.isRequired,
    gLine1Label: PropTypes.string.isRequired,
    gLine2Label: PropTypes.string.isRequired,
    gLine3Label: PropTypes.string.isRequired,
    gLine4Label: PropTypes.string,
    gLine1Slope: PropTypes.number.isRequired,
    gLine2Slope: PropTypes.number.isRequired,
    gLine3Slope: PropTypes.number.isRequired,
    gLine4Slope: PropTypes.number.isRequired,
    gLine1OffsetX: PropTypes.number.isRequired,
    gLine1OffsetY: PropTypes.number.isRequired,
    gLine2OffsetX: PropTypes.number.isRequired,
    gLine2OffsetY: PropTypes.number.isRequired,
    gLine3OffsetX: PropTypes.number.isRequired,
    gLine3OffsetY: PropTypes.number.isRequired,
    gLine4OffsetX: PropTypes.number,
    gLine4OffsetY: PropTypes.number,
    gLine1Dashed: PropTypes.bool.isRequired,
    gLine2Dashed: PropTypes.bool.isRequired,
    gLine3Dashed: PropTypes.bool.isRequired,

    gXAxisLabel: PropTypes.string.isRequired,
    gYAxisLabel: PropTypes.string.isRequired,
    gXAxis2Label: PropTypes.string.isRequired,
    gYAxis2Label: PropTypes.string.isRequired,
    gType: PropTypes.number,
    gAssignmentType: PropTypes.number,
    gNeedsSubmit: PropTypes.bool,

    gA1: PropTypes.number,
    gA1Name: PropTypes.string,
    gA1Max: PropTypes.number,
    gA1Min: PropTypes.number,

    gA2: PropTypes.number,
    gA2Name: PropTypes.string,
    gA2Max: PropTypes.number,
    gA2Min: PropTypes.number,

    gA3: PropTypes.number,
    gA3Name: PropTypes.string,
    gA3Max: PropTypes.number,
    gA3Min: PropTypes.number,

    gA4: PropTypes.number,
    gA4Name: PropTypes.string,
    gA4Max: PropTypes.number,
    gA4Min: PropTypes.number,

    gA5: PropTypes.number,
    gA5Name: PropTypes.string,
    gA5Max: PropTypes.number,
    gA5Min: PropTypes.number,

    gA6: PropTypes.number,
    gA7: PropTypes.number,
    gA8: PropTypes.number,

    gCobbDouglasA: PropTypes.number,
    gCobbDouglasAName: PropTypes.string,
    gCobbDouglasL: PropTypes.number,
    gCobbDouglasLName: PropTypes.string,
    gCobbDouglasK: PropTypes.number,
    gCobbDouglasKName: PropTypes.string,
    gCobbDouglasAlpha: PropTypes.number,
    gCobbDouglasYName: PropTypes.string,

    gNName: PropTypes.string,

    gFunctionChoice: PropTypes.number,
    gToggle: PropTypes.bool,
    gExpression: PropTypes.string,
    gExpression2: PropTypes.string,
    gExpression3: PropTypes.string,

    gAreaConfiguration: PropTypes.number,
    gIsAreaDisplayed: PropTypes.bool,

    gXAxisMax: PropTypes.number,
    gXAxisMin: PropTypes.number,
    gYAxisMax: PropTypes.number,
    gYAxisMin: PropTypes.number,

    gMajorGridType: PropTypes.number,
    gMinorGridType: PropTypes.number,

    updateGraph: PropTypes.func.isRequired,
    saveGraph: PropTypes.func.isRequired,
    saveAndViewGraph: PropTypes.func.isRequired,
};
