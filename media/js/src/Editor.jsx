import React, { Component } from 'react';
import GraphEditor from './GraphEditor';
import GraphPicker from './GraphPicker';
import { exportGraph, defaultGraph } from './GraphMapping';
import { authedFetch, getError, getCohortId } from './utils';

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            user: null,
            alertText: null,
            inGraph: null,
            lastGraphVisited: null,
        };

        Object.assign(this.state, defaultGraph);

        this.gp = React.createRef();
        this.ge = React.createRef();

        // Back/Forward navigation work-around
        //      Refresh still messes with the state,
        //      but it's much less of a problem
        window.addEventListener('hashchange', () => {
            if (this.state.gType === null) {
                this.setState({
                    step: 0,
                    inGraph: false,
                });
            } else if (this.state.inGraph) {
                this.setState({
                    lastGraphVisited: this.state.gType,
                    step: 0,
                    inGraph: false,
                });
            } else {
                // Copy defaultGraph object
                let newState = Object.assign({}, defaultGraph);
                newState.step = 1;
                newState.gType = (this.state.gType !== null ? this.state.gType : this.state.lastGraphVisited);
                newState.inGraph = true;

                this.setState(newState);
            }
        });
    }
    render() {
        return (
            <div className="Editor">
                <div className="Editor-container">
                    <div className="alert alert-danger"
                        hidden={this.state.alertText ? false : true}
                        role="alert">
                        {this.state.alertText}
                    </div>
                    <GraphPicker
                        ref={this.gp}
                        showing={this.state.step === 0}
                        onSelectGraph={this.onSelectGraph.bind(this)} />
                    <GraphEditor
                        ref={this.ge}
                        showing={this.state.step === 1}
                        gTitle={this.state.gTitle}
                        gSummary={this.state.gSummary}
                        gType={this.state.gType}
                        gAssignmentType={this.state.gAssignmentType}
                        gInstructions={this.state.gInstructions}
                        gInstructorNotes={this.state.gInstructorNotes}
                        gShowIntersection={this.state.gShowIntersection}
                        gDisplayIntersection1={this.state.gDisplayIntersection1}
                        gIntersectionLabel={this.state.gIntersectionLabel}
                        gDisplayIntersection2={this.state.gDisplayIntersection2}
                        gIntersection2Label={this.state.gIntersection2Label}
                        gDisplayIntersection3={this.state.gDisplayIntersection3}
                        gIntersection3Label={this.state.gIntersection3Label}
                        gDisplayShadow={this.state.gDisplayShadow}
                        gNeedsSubmit={this.state.gNeedsSubmit}
                        gTopic={this.state.gTopic}

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

                        updateGraph={this.handleGraphUpdate.bind(this)}
                        saveGraph={this.handleSaveGraph.bind(this)}
                        saveAndViewGraph={this.handleSaveAndViewGraph.bind(this)} />
                </div>
            </div>
        );
    }
    reset() {
        this.setState({ step: 0 });
    }
    onSelectGraph(type) {
        let gA1default = 0;
        let gA2default = 0;
        let gA3default = 0;

        // Initialize different graph types with their own default
        // values.
        //
        // TODO: unify this with the switch/case statement in
        // JXGBoard.
        //
        switch (type) {
        case 5:
        case 7:
        case 11:
        case 15:
            gA1default = 4;
            gA2default = 1;
            gA3default = 0.5;
            break;
        default:
            break;
        }

        this.setState({
            step: 1,
            gType: type,
            gA1: gA1default,
            gA2: gA2default,
            gA3: gA3default
        });
    }
    /**
     * Save the graph to the backend. Returns a promise.
     *
     * If the `chain` param is true, then this function can be used
     * within a promise chain and customized as needed.
     */
    handleSaveGraph(chain = false) {
        let data = exportGraph(this.state);
        data.author = window.EconPlayground.user;

        const me = this;
        return authedFetch('/api/graphs/', 'post', JSON.stringify(data))
            .then(function(response) {
                if (chain) {
                    return response.json();
                }

                if (response.status === 201) {
                    me.setState({
                        alertText: null,
                        step: 2
                    });

                    response.json().then(function(graph) {
                        const courseId = getCohortId(window.location.pathname);
                        const url = `/course/${courseId}/graph/${graph.id}/`;
                        window.location.href = url;
                    });
                } else {
                    response.json().then(function(d) {
                        me.setState({
                            alertText: getError(d)
                        });
                        window.scrollTo(0, 0);
                    });
                }
            });
    }
    handleSaveAndViewGraph() {
        return this.handleSaveGraph(true).then(function(graph) {
            const courseId = getCohortId(window.location.pathname);
            const url = `/course/${courseId}/graph/${graph.id}/public/`;
            window.location.href = url;
        });

    }
    handleGraphUpdate(obj) {
        this.setState(obj);
    }
    componentDidMount() {
        const me = this;
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
}

export default Editor;
