import React from 'react';
import PropTypes from 'prop-types';
import * as commonmark from 'commonmark';
import Assessment from './Assessment';
import ADASEditor from './editors/ADASEditor';
import CobbDouglasEditor from './editors/CobbDouglasEditor';
import CobbDouglasNLDSEditor from './editors/CobbDouglasNLDSEditor';
import ConsumptionLeisureEditor from './editors/ConsumptionLeisureEditor';
import ConsumptionSavingEditor from './editors/ConsumptionSavingEditor';
import DemandSupplyEditor from './editors/DemandSupplyEditor';
import NonLinearDemandSupplyEditor from './editors/NonLinearDemandSupplyEditor';
import ExportGraphButton from './buttons/ExportGraphButton';
import ResetGraphButton from './buttons/ResetGraphButton';
import SubmitButton from './buttons/SubmitButton';
import JXGBoard from './JXGBoard';
import Feedback from './Feedback';
import {
    forceFloat, getOrCreateSubmission, BOARD_WIDTH, BOARD_HEIGHT
} from './utils';

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

        const token = document.getElementById(
            'csrf-token').getAttribute('content');

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
                    {...this.props}
                />
            );
        }
        let rightSide = null;

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
                    <form onSubmit={this.handleSubmit.bind(this)} action={action} method="post">
                        <input type="hidden" name="csrfmiddlewaretoken" value={token} />
                        <input type="hidden" name="score" value={this.state.score} />
                        <input type="hidden" name="next" value={successUrl} />
                        <input type="hidden" name="launchUrl" value={launchUrl} />

                        <div className="row">
                            {leftSide}
                        </div>

                        <Feedback feedback={this.state.currentFeedback} />

                        {rightSide}

                        <ResetGraphButton
                            initialState={initialState}
                            updateGraph={this.updateGraph} />

                        <ExportGraphButton />

                        <SubmitButton
                            assessment={this.props.assessment}
                            gNeedsSubmit={this.props.gNeedsSubmit}
                            submission={this.props.submission}
                            isInstructor={isInstructor} />
                    </form>
                </div>
            );
        }

        return (
            <div className="GraphViewer">
                {titleEl}
                {instructionsEl}
                <form onSubmit={this.handleSubmit.bind(this)} action={action} method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value={token} />
                    <input type="hidden" name="score" value={this.state.score} />
                    <input type="hidden" name="next" value={successUrl} />
                    <input type="hidden" name="launchUrl" value={launchUrl} />

                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            <div className="sticky-top">
                                {leftSide}

                                <Feedback feedback={this.state.currentFeedback} />
                            </div>
                        </div>

                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            {rightSide}

                            <ResetGraphButton
                                initialState={initialState}
                                updateGraph={this.updateGraph} />

                            <ExportGraphButton />

                            <SubmitButton
                                assessment={this.props.assessment}
                                gNeedsSubmit={this.props.gNeedsSubmit}
                                submission={this.props.submission}
                                isInstructor={isInstructor} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
    // When the submission is loaded by the Viewer, see if
    // this.state.currentFeedback should be updated.
    componentDidUpdate(prevProps) {
        if (prevProps.submission !== this.props.submission) {
            this.loadFeedback(
                this.props.submission.feedback_unfulfilled,
                this.props.submission.feedback_fulfilled);
        }
    }
    loadFeedback(unfulfilledFeedback, fulfilledFeedback) {
        const currentFeedback = [];

        unfulfilledFeedback = unfulfilledFeedback.split(';;');
        fulfilledFeedback = fulfilledFeedback.split(';;');

        unfulfilledFeedback.forEach(e => {
            if (e) {
                currentFeedback.push({
                    feedback: e,
                    fulfilled: false
                });
            }
        });
        fulfilledFeedback.forEach(e => {
            if (e) {
                currentFeedback.push({
                    feedback: e,
                    fulfilled: true
                });
            }
        });

        this.setState({currentFeedback: currentFeedback});
    }
    handleSubmit(event) {
        event.preventDefault();
        const assessment = new Assessment(this.props.assessment);
        const responses = assessment.evalState(this.props);

        if (this.props.gNeedsSubmit) {
            // LTI Assessment graph submitted. Create a Submission
            // object and submit to Canvas with LTI.
            const form = event.target;

            // Sum up the scores for all fulfilled rules.
            const scores = responses.map(x => forceFloat(x.score));
            const score = scores.reduce((a, b) => a + b, 0);

            this.setState({score: score});

            // Save the user's feedback on their Submission object to
            // make it persistent.
            const fulfilledFeedback = responses
                .filter(x => x.fulfilled)
                .map(x => x.feedback)
                .join(';;');
            const unfulfilledFeedback = responses
                .filter(x => !x.fulfilled)
                .map(x => x.feedback)
                .join(';;');

            getOrCreateSubmission({
                graph: this.props.gId,
                feedback_fulfilled: fulfilledFeedback,
                feedback_unfulfilled: unfulfilledFeedback,
                score: score
            }).then(function() {
                form.submit();
            });
        } else {
            // Practice Assessment submitted. Show feedback
            // immediately.
            this.setState({currentFeedback: responses});
        }
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
    gNeedsSubmit: PropTypes.bool,
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

    gAlpha: PropTypes.number,

    gA1: PropTypes.number,
    gA1Initial: PropTypes.number,
    gA2: PropTypes.number,
    gA2Initial: PropTypes.number,
    gA3: PropTypes.number,
    gA3Initial: PropTypes.number,
    gA4: PropTypes.number,
    gA4Initial: PropTypes.number,
    gA5: PropTypes.number,
    gA5Initial: PropTypes.number,

    gA: PropTypes.number,
    gK: PropTypes.number,
    gR: PropTypes.number,
    gY1: PropTypes.number,
    gY2: PropTypes.number,

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

    assessment: PropTypes.array,
    submission: PropTypes.object,
    updateGraph: PropTypes.func.isRequired
};
