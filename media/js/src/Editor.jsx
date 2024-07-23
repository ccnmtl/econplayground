import React, { Component } from 'react';
import GraphEditor from './GraphEditor.jsx';
import { exportGraph, defaultGraph } from './GraphMapping.js';
import {authedFetch, getError, getCohortId} from './utils.js';

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertText: null,
            gType: null
        };

        this.defaults = {
            gA1: 2.5,
            gA2: 2,
            gA3: 0.5,
            gA4: 2,
            gA5: 0.5
        };

        Object.assign(this.state, defaultGraph);
        Object.assign(this.state, this.defaults);

        this.gp = React.createRef();
        this.ge = React.createRef();
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
                    <GraphEditor
                        {...this.state}
                        gType={this.state.gType}
                        ref={this.ge}
                        updateGraph={this.handleGraphUpdate.bind(this)}
                        saveGraph={this.handleSaveGraph.bind(this)}
                        saveAndViewGraph={this.handleSaveGraph.bind(this, true)}
                    />
                </div>
            </div>
        );
    }
    /**
     * Save the graph to the backend. Returns a promise.
     */
    handleSaveGraph(studentView=false) {
        let data = exportGraph(this.state);
        data.graph_type = window.EconPlayground.graphType;
        data.author = window.EconPlayground.user;
        data.expression = window.EconPlayground.fallback;
        data.expression_2 = window.EconPlayground.fallback2;
        data.expression_3 = window.EconPlayground.fallback3;

        const me = this;
        return authedFetch('/api/graphs/', 'post', JSON.stringify(data))
            .then(function(response) {
                if (response.status === 201) {
                    me.setState({
                        alertText: null,
                    });

                    return response.json().then(function(graph) {
                        const courseId = getCohortId(window.location.pathname);
                        let url = `/course/${courseId}/graph/${graph.id}/`;
                        if (studentView) {
                            url += 'public/';
                        }

                        window.location.href = url;
                    });
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
        if (this.state.gType === 21 && Object.hasOwn(obj, 'gToggle')) {
            // Update axis dynamically based on this toggle.
            if (obj.gToggle) {
                obj.gXAxisMax = 10000;
                obj.gYAxisMax = 10000;
            } else {
                obj.gXAxisMax = 1000;
                obj.gYAxisMax = 1000;
            }
        }

        this.setState(obj);
    }
    componentDidMount() {
        const me = this;

        if (typeof window.EconPlayground.graphType !== 'undefined') {
            let updateObj = {
                gType: window.EconPlayground.graphType
            };

            Object.assign(updateObj, this.defaults);

            // Specific defaults based on graph type.
            if (window.EconPlayground.graphType === 15) {
                updateObj.gA4 = 0.5;
            } else if (window.EconPlayground.graphType === 21) {
                updateObj.gA1 = 5;
                updateObj.gA2 = 10;
                updateObj.gA3 = 2500;
                updateObj.gA4 = 0.5;
                updateObj.gA5 = 0.5;
                updateObj.gXAxisMax = 1000;
                updateObj.gYAxisMax = 1000;
            } else if (window.EconPlayground.graphType === 23) {
                Object.assign(updateObj, {
                    gA1: 1500,
                    gA2: 100,
                    gA3: 0,
                    gLine1Slope: 2,
                    gLine2Slope: 2,
                    gXAxisMax: 1000,
                    gYAxisMax: 2500
                });
            }

            this.setState(updateObj);
        }

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
