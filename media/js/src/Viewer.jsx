import React, { Component } from 'react';
import Assessment from './Assessment';
import GraphEditor from './GraphEditor';
import GraphViewer from './GraphViewer';
import { exportGraph, importGraph, defaultGraph } from './GraphMapping';
import {
    authedFetch, getGraphId, getCohortId, getAssessment,
    getSubmission, getError
} from './utils';

class Viewer extends Component {
    constructor(props) {
        super(props);

        this.graphId = getGraphId(window.location.pathname);

        this.state = {
            submission: null
        };

        Object.assign(this.state, defaultGraph);

        // TODO: clean up this regex
        if (window.location.href.match(/submitted=1/)) {
            this.state.alertText = 'Submitted.';
        }

        this.gv = React.createRef();
        this.ge = React.createRef();
    }

    render() {
        if (window.EconPlayground.isInstructor) {
            return <React.Fragment>
                <div className="alert alert-info"
                    hidden={this.state.alertText ? false : true}
                    role="alert"
                >
                    {this.state.alertText}
                </div>
                <GraphEditor
                    ref={this.ge}
                    showing={true}
                    gId={this.state.gId}
                    gTitle={this.state.gTitle}
                    gSummary={this.state.gSummary}
                    gInstructions={this.state.gInstructions}
                    gInstructorNotes={this.state.gInstructorNotes}
                    gType={this.state.gType}
                    gAssignmentType={this.state.gAssignmentType}
                    gNeedsSubmit={this.state.gNeedsSubmit}
                    gTopic={this.state.gTopic}
                    gShowIntersection={this.state.gShowIntersection}
                    gDisplayIntersection1={this.state.gDisplayIntersection1}
                    gIntersectionLabel={this.state.gIntersectionLabel}
                    gDisplayIntersection2={this.state.gDisplayIntersection2}
                    gIntersection2Label={this.state.gIntersection2Label}
                    gDisplayIntersection3={this.state.gDisplayIntersection3}
                    gIntersection3Label={this.state.gIntersection3Label}
                    gDisplayShadow={this.state.gDisplayShadow}
                    gIntersectionHorizLineLabel={this.state.gIntersectionHorizLineLabel}
                    gIntersectionVertLineLabel={this.state.gIntersectionVertLineLabel}
                    gIntersection2HorizLineLabel={this.state.gIntersection2HorizLineLabel}
                    gIntersection2VertLineLabel={this.state.gIntersection2VertLineLabel}
                    gIntersection3HorizLineLabel={this.state.gIntersection3HorizLineLabel}
                    gIntersection3VertLineLabel={this.state.gIntersection3VertLineLabel}
                    gIsPublished={this.state.gIsPublished}
                    gIsFeatured={this.state.gIsFeatured}
                    gDisplayFeedback={this.state.gDisplayFeedback}
                    gLine1Label={this.state.gLine1Label}
                    gLine2Label={this.state.gLine2Label}
                    gLine3Label={this.state.gLine3Label}
                    gLine4Label={this.state.gLine4Label}
                    gLine1Slope={this.state.gLine1Slope}
                    gLine2Slope={this.state.gLine2Slope}
                    gLine3Slope={this.state.gLine3Slope}
                    gLine4Slope={this.state.gLine4Slope}
                    gLine1Dashed={this.state.gLine1Dashed}
                    gLine2Dashed={this.state.gLine2Dashed}
                    gLine3Dashed={this.state.gLine3Dashed}
                    gXAxisLabel={this.state.gXAxisLabel}
                    gYAxisLabel={this.state.gYAxisLabel}
                    gXAxis2Label={this.state.gXAxis2Label}
                    gYAxis2Label={this.state.gYAxis2Label}
                    gLine1OffsetX={this.state.gLine1OffsetX}
                    gLine1OffsetY={this.state.gLine1OffsetY}
                    gLine2OffsetX={this.state.gLine2OffsetX}
                    gLine2OffsetY={this.state.gLine2OffsetY}
                    gLine3OffsetX={this.state.gLine3OffsetX}
                    gLine3OffsetY={this.state.gLine3OffsetY}
                    gLine4OffsetX={this.state.gLine4OffsetX}
                    gLine4OffsetY={this.state.gLine4OffsetY}
                    gAlpha={this.state.gAlpha}

                    gA1={this.state.gA1}
                    gA2={this.state.gA2}
                    gA3={this.state.gA3}
                    gA4={this.state.gA4}
                    gA5={this.state.gA5}

                    gA={this.state.gA}
                    gK={this.state.gK}
                    gR={this.state.gR}
                    gY1={this.state.gY1}
                    gY2={this.state.gY2}

                    gCobbDouglasA={this.state.gCobbDouglasA}
                    gCobbDouglasAName={this.state.gCobbDouglasAName}
                    gCobbDouglasL={this.state.gCobbDouglasL}
                    gCobbDouglasLName={this.state.gCobbDouglasLName}
                    gCobbDouglasK={this.state.gCobbDouglasK}
                    gCobbDouglasKName={this.state.gCobbDouglasKName}
                    gCobbDouglasAlpha={this.state.gCobbDouglasAlpha}
                    gCobbDouglasYName={this.state.gCobbDouglasYName}

                    gNName={this.state.gNName}

                    gFunctionChoice={this.state.gFunctionChoice}

                    gAreaConfiguration={this.state.gAreaConfiguration}

                    gIsAreaDisplayed={this.state.gIsAreaDisplayed}

                    gAreaAName={this.state.gAreaAName}
                    gAreaBName={this.state.gAreaBName}
                    gAreaCName={this.state.gAreaCName}

                    updateDisplayIntersection={this.updateDisplayIntersection.bind(this)}
                    updateGraph={this.handleGraphUpdate.bind(this)}
                    saveGraph={this.handleSaveGraph.bind(this)}
                    saveAndViewGraph={this.handleSaveGraph.bind(this, true)}
                />
            </React.Fragment>;
        } else {
            return <React.Fragment>
                <div
                    className="alert alert-info"
                    hidden={this.state.alertText ? false : true}
                    role="alert"
                >
                    {this.state.alertText}
                </div>
                <GraphViewer
                    ref={this.gv}
                    gId={this.state.gId}
                    gTitle={this.state.gTitle}
                    gInstructions={this.state.gInstructions}
                    gType={this.state.gType}
                    gAssignmentType={this.state.gAssignmentType}
                    gShowIntersection={this.state.gShowIntersection}
                    gDisplayIntersection1={this.state.gDisplayIntersection1}
                    gDisplayIntersection1Initial={this.state.gDisplayIntersection1Initial}
                    gIntersectionLabel={this.state.gIntersectionLabel}
                    gIntersectionLabelInitial={this.state.gIntersectionLabelInitial}
                    gDisplayIntersection2={this.state.gDisplayIntersection2}
                    gDisplayIntersection2Initial={this.state.gDisplayIntersection2Initial}
                    gIntersection2Label={this.state.gIntersection2Label}
                    gIntersection2LabelInitial={this.state.gIntersection2LabelInitial}
                    gDisplayIntersection3={this.state.gDisplayIntersection3}
                    gDisplayIntersection3Initial={this.state.gDisplayIntersection3Initial}
                    gIntersection3Label={this.state.gIntersection3Label}
                    gIntersection3LabelInitial={this.state.gIntersection3LabelInitial}
                    gNeedsSubmit={this.state.gNeedsSubmit}

                    gDisplayShadow={this.state.gDisplayShadow}
                    gIntersectionHorizLineLabel={this.state.gIntersectionHorizLineLabel}
                    gIntersectionVertLineLabel={this.state.gIntersectionVertLineLabel}
                    gIntersection2HorizLineLabel={this.state.gIntersection2HorizLineLabel}
                    gIntersection2VertLineLabel={this.state.gIntersection2VertLineLabel}
                    gIntersection3HorizLineLabel={this.state.gIntersection3HorizLineLabel}
                    gIntersection3VertLineLabel={this.state.gIntersection3VertLineLabel}
                    gIntersectionHorizLineLabelInitial={this.state.gIntersectionHorizLineLabelInitial}
                    gIntersectionVertLineLabelInitial={this.state.gIntersectionVertLineLabelInitial}
                    gIntersection2HorizLineLabelInitial={this.state.gIntersection2HorizLineLabelInitial}
                    gIntersection2VertLineLabelInitial={this.state.gIntersection2VertLineLabelInitial}
                    gIntersection3HorizLineLabelInitial={this.state.gIntersection3HorizLineLabelInitial}
                    gIntersection3VertLineLabelInitial={this.state.gIntersection3VertLineLabelInitial}
                    gDisplayFeedback={this.state.gDisplayFeedback}
                    gLine1Label={this.state.gLine1Label}
                    gLine2Label={this.state.gLine2Label}
                    gLine3Label={this.state.gLine3Label}
                    gLine4Label={this.state.gLine4Label}
                    gLine1LabelInitial={this.state.gLine1LabelInitial}
                    gLine2LabelInitial={this.state.gLine2LabelInitial}
                    gLine3LabelInitial={this.state.gLine3LabelInitial}
                    gLine4LabelInitial={this.state.gLine4LabelInitial}
                    gLine1Slope={this.state.gLine1Slope}
                    gLine1SlopeInitial={this.state.gLine1SlopeInitial}
                    gLine2Slope={this.state.gLine2Slope}
                    gLine2SlopeInitial={this.state.gLine2SlopeInitial}
                    gLine3Slope={this.state.gLine3Slope}
                    gLine3SlopeInitial={this.state.gLine3SlopeInitial}
                    gLine4Slope={this.state.gLine4Slope}
                    gLine4SlopeInitial={this.state.gLine4SlopeInitial}
                    gLine1Dashed={this.state.gLine1Dashed}
                    gLine2Dashed={this.state.gLine2Dashed}
                    gLine3Dashed={this.state.gLine3Dashed}
                    gXAxisLabel={this.state.gXAxisLabel}
                    gYAxisLabel={this.state.gYAxisLabel}
                    gXAxisLabelInitial={this.state.gXAxisLabelInitial}
                    gYAxisLabelInitial={this.state.gYAxisLabelInitial}
                    gXAxis2Label={this.state.gXAxis2Label}
                    gYAxis2Label={this.state.gYAxis2Label}
                    gXAxis2LabelInitial={this.state.gXAxis2LabelInitial}
                    gYAxis2LabelInitial={this.state.gYAxis2LabelInitial}
                    gLine1OffsetX={this.state.gLine1OffsetX}
                    gLine1OffsetY={this.state.gLine1OffsetY}
                    gLine1OffsetXInitial={this.state.gLine1OffsetXInitial}
                    gLine1OffsetYInitial={this.state.gLine1OffsetYInitial}
                    gLine2OffsetX={this.state.gLine2OffsetX}
                    gLine2OffsetY={this.state.gLine2OffsetY}
                    gLine2OffsetXInitial={this.state.gLine2OffsetXInitial}
                    gLine2OffsetYInitial={this.state.gLine2OffsetYInitial}
                    gLine3OffsetX={this.state.gLine3OffsetX}
                    gLine3OffsetY={this.state.gLine3OffsetY}
                    gLine3OffsetXInitial={this.state.gLine3OffsetXInitial}
                    gLine3OffsetYInitial={this.state.gLine3OffsetYInitial}
                    gLine4OffsetX={this.state.gLine4OffsetX}
                    gLine4OffsetY={this.state.gLine4OffsetY}
                    gLine4OffsetXInitial={this.state.gLine4OffsetXInitial}
                    gLine4OffsetYInitial={this.state.gLine4OffsetYInitial}
                    gAlpha={this.state.gAlpha}

                    gA1={this.state.gA1}
                    gA1Initial={this.state.gA1Initial}
                    gA2={this.state.gA2}
                    gA2Initial={this.state.gA2Initial}
                    gA3={this.state.gA3}
                    gA3Initial={this.state.gA3Initial}
                    gA4={this.state.gA4}
                    gA4Initial={this.state.gA4Initial}
                    gA5={this.state.gA5}
                    gA5Initial={this.state.gA5Initial}

                    gA={this.state.gA}
                    gK={this.state.gK}
                    gR={this.state.gR}
                    gY1={this.state.gY1}
                    gY2={this.state.gY2}

                    gCobbDouglasA={this.state.gCobbDouglasA}
                    gCobbDouglasAInitial={this.state.gCobbDouglasAInitial}
                    gCobbDouglasAName={this.state.gCobbDouglasAName}
                    gCobbDouglasL={this.state.gCobbDouglasL}
                    gCobbDouglasLInitial={this.state.gCobbDouglasLInitial}
                    gCobbDouglasLName={this.state.gCobbDouglasLName}
                    gCobbDouglasK={this.state.gCobbDouglasK}
                    gCobbDouglasKInitial={this.state.gCobbDouglasKInitial}
                    gCobbDouglasKName={this.state.gCobbDouglasKName}
                    gCobbDouglasAlpha={this.state.gCobbDouglasAlpha}
                    gCobbDouglasAlphaInitial={this.state.gCobbDouglasAlphaInitial}
                    gCobbDouglasYName={this.state.gCobbDouglasYName}

                    gNName={this.state.gNName}

                    gFunctionChoice={this.state.gFunctionChoice}

                    gAreaConfiguration={this.state.gAreaConfiguration}
                    gAreaConfigurationInitial={this.state.gAreaConfigurationInitial}
                    gIsAreaDisplayed={this.state.gIsAreaDisplayed}

                    gAreaAName={this.state.gAreaAName}
                    gAreaBName={this.state.gAreaBName}
                    gAreaCName={this.state.gAreaCName}

                    assessment={this.state.assessment}
                    submission={this.state.submission}
                    updateGraph={this.handleGraphUpdate.bind(this)}
                />
            </React.Fragment>;
        }
    }

    /**
     * Get an assessment from Django and set it in this.state.
     */
    loadAssessment(gId) {
        const me = this;

        return getAssessment(gId).then(function(a) {
            if (a && a.assessmentrule_set) {
                const assessment = new Assessment(a.assessmentrule_set);
                me.setState({assessment: assessment.assessment});
            }
        }, function() {
            // No assessment found
        });
    }

    /**
     * Get a submission from Django and set it in this.state.
     */
    loadSubmission(gId) {
        const me = this;

        return getSubmission(gId).then(function(s) {
            me.setState({
                alertText: 'Submitted.',
                submission: s
            });
        }, function() {
            // No submission found
        });
    }

    componentDidMount() {
        // Load graph and submission data
        const me = this;

        this.getGraph().then(function() {
            me.loadAssessment(me.graphId);
            if (me.state.gNeedsSubmit) {
                me.loadSubmission(me.graphId);
            }
        });

        // Add graph feedback event handlers
        document.addEventListener('l1up', function() {
            // TODO
        });
        document.addEventListener('l1down', function() {
        });
        document.addEventListener('l2up', function() {
        });
        document.addEventListener('l2down', function() {
        });
        document.addEventListener('l1initial', function() {
        });
        document.addEventListener('l2initial', function() {
        });

        document.addEventListener('l1offset', function(e) {
            const offset = e.detail;
            let line = 1;
            if (e.detail.line) {
                line = e.detail.line;
            }
            me.setState({
                [`gLine${line}OffsetX`]: offset.x,
                [`gLine${line}OffsetY`]: offset.y
            });
        });
        document.addEventListener('l2offset', function(e) {
            const offset = e.detail;
            let line = 2;
            if (e.detail.line) {
                line = e.detail.line;
            }
            me.setState({
                [`gLine${line}OffsetX`]: offset.x,
                [`gLine${line}OffsetY`]: offset.y
            });
        });
        document.addEventListener('l3offset', function(e) {
            const offset = e.detail;
            me.setState({
                gLine3OffsetX: offset.x,
                gLine3OffsetY: offset.y
            });
        });
    }

    getGraph() {
        const me = this;
        return authedFetch(`/api/graphs/${this.graphId}/`).then(
            function(response) {
                return response.json();
            }).then(function(json) {importGraph(json, me);});
    }

    /**
     * Save the graph to the backend. Returns a promise.
     */
    handleSaveGraph(studentView=false) {
        let data = exportGraph(this.state);
        data.author = window.EconPlayground.user;

        const me = this;
        return authedFetch(
            `/api/graphs/${this.graphId}/`, 'put', JSON.stringify(data))
            .then(function(response) {
                if (response.status === 200) {
                    if (studentView) {
                        const courseId = getCohortId(window.location.pathname);
                        const graphId = getGraphId(window.location.pathname);
                        const url = `/course/${courseId}/graph/${graphId}/public/`;
                        window.location.href = url;
                    } else {
                        me.setState({
                            alertText: 'Graph saved'
                        });


                        window.scrollTo(0, 0);
                    }
                } else {
                    return response.json().then(function(d) {
                        me.setState({
                            alertText: getError(d)
                        });
                        window.scrollTo(0, 0);
                    });
                }
            });
    }

    handleGraphUpdate(obj) {
        this.setState(obj);
    }
    updateDisplayIntersection(checked) {
        this.setState({gShowIntersection: checked});
    }
}

export default Viewer;
