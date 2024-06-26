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

        Object.assign(this.state, defaultGraph);

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
        this.setState(obj);
    }
    componentDidMount() {
        const me = this;

        if (typeof window.EconPlayground.graphType !== 'undefined') {
            this.setState({gType: window.EconPlayground.graphType});
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
