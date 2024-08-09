import React, { Component } from 'react';
import Assessment from './Assessment.js';
import GraphEditor from './GraphEditor.jsx';
import GraphViewer from './GraphViewer.jsx';
import { exportGraph, importGraph, defaultGraph } from './GraphMapping.js';
import {
    authedFetch, getGraphId, getCohortId, getAssessment, getSubmission,
    getError
} from './utils.js';
import { setDynamicGraphDefaults } from './graphUtils.js';

class Viewer extends Component {
    constructor(props) {
        super(props);

        this.graphId = getGraphId(window.location.pathname);
        // If the graph ID can't be found in the URL, look in the
        // global JS namespace.
        if (!this.graphId && window.GRAPH_ID) {
            this.graphId = window.GRAPH_ID;
        }

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
                    {...this.state}
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
                    {...this.state}
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
            })
            .then(function(json) {
                importGraph(json, me);
            });
    }

    /**
     * Save the graph to the backend. Returns a promise.
     */
    handleSaveGraph(studentView=false) {
        let data = exportGraph(this.state);
        data.author = window.EconPlayground.user;
        data.expression = window.EconPlayground.fallback;
        data.expression_2 = window.EconPlayground.fallback2;
        data.expression_3 = window.EconPlayground.fallback3;

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
        const updateObj = setDynamicGraphDefaults(this.state, obj);

        this.setState(updateObj);
    }
    updateDisplayIntersection(checked) {
        this.setState({gShowIntersection: checked});
    }
}

export default Viewer;
