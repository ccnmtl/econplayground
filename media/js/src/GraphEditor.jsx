import React from 'react';
import PropTypes from 'prop-types';
import ADASEditor from './editors/ADASEditor';
import CobbDouglasEditor from './editors/CobbDouglasEditor';
import CobbDouglasNLDSEditor from './editors/CobbDouglasNLDSEditor';
import NonLinearDemandSupplyEditor from './editors/NonLinearDemandSupplyEditor';
import ConsumptionLeisureEditor from './editors/ConsumptionLeisureEditor';
import ConsumptionSavingEditor from './editors/ConsumptionSavingEditor';
import DemandSupplyEditor from './editors/DemandSupplyEditor';
import CommonGraphEditor from './editors/CommonGraphEditor';
import CommonGraphSettings from './editors/CommonGraphSettings';
import JXGBoard from './JXGBoard';
import {
    displayGraphType, handleFormUpdate, getCohortId, BOARD_HEIGHT, BOARD_WIDTH
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
        if (!this.props.showing) {
            return null;
        }

        const courseId = getCohortId(window.location.pathname);

        const editRow = (
            <div className="row">
                <div className="ml-3 mr-2">
                    <button 
                        type="button"
                        className="btn btn-primary"
                        onClick={this.handleSaveGraph.bind(this)}
                    >
                        Save
                    </button>
                </div>
                <button 
                    onClick={this.handleSaveAndViewGraph.bind(this)}
                    type="button"
                    className="btn btn-secondary">Save and View</button>
                {this.props.gId &&
                <div className="ml-auto mr-2">
                    <a 
                        role="button"
                        className="btn btn-primary float-md-right"
                        title="Clone Graph"
                        href={`/course/${courseId}/graph/${this.props.gId}/clone/`}
                    >
                        <svg alt="" height="32" className="mr-1 octicon octicon-repo-clone" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
                            <path fillRule="evenodd" d="M15 0H9v7c0 .55.45 1 1 1h1v1h1V8h3c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1zm-4 7h-1V6h1v1zm4 0h-3V6h3v1zm0-2h-4V1h4v4zM4 5H3V4h1v1zm0-2H3V2h1v1zM2 1h6V0H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h2v2l1.5-1.5L6 16v-2h5c.55 0 1-.45 1-1v-3H2V1zm9 10v2H6v-1H3v1H1v-2h10zM3 8h1v1H3V8zm1-1H3V6h1v1z"></path>
                        </svg>
                        Clone Graph
                    </a>
                </div>
                }
                {this.props.gId &&
                <div className="mr-3">
                    <a
                        role="button"
                        className="btn btn-danger float-md-right"
                        title="Delete Graph"
                        href={`/course/${courseId}/graph/${this.props.gId}/delete/`}
                    >
                        <svg alt="" height="32" className="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="24" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path>
                        </svg>
                        Delete Graph
                    </a>
                </div>
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

                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                    <h2>Scenario</h2>
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
                    <div className="form-group">
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
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
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
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
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
        }

        return (
            <div className="GraphEditor">
                {this.title()}
                <form>
                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            <div className="sticky-top">
                                <h2>Scenario</h2>
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
                                <CommonGraphEditor
                                    {...this.props}
                                />
                                {this.props.gId &&
                                    <div className="form-group">
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
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            <CommonGraphSettings
                                {...this.props}
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

    gAlpha: PropTypes.number,

    gA1: PropTypes.number,
    gA2: PropTypes.number,
    gA3: PropTypes.number,
    gA4: PropTypes.number,

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

    gAreaConfiguration: PropTypes.number,
    gIsAreaDisplayed: PropTypes.bool,

    updateGraph: PropTypes.func.isRequired,
    saveGraph: PropTypes.func.isRequired,
    saveAndViewGraph: PropTypes.func.isRequired,
    showing: PropTypes.bool.isRequired
};
