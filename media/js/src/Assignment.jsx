import React, { Component } from 'react';
import GraphViewer from './GraphViewer';
import { importGraph, defaultGraph } from './GraphMapping';
import {
    authedFetch, getEvaluations
} from './utils';

class Assignment extends Component {
    constructor(props) {
        super(props);

        this.assessmentType = window.ASSIGNMENT_TYPE;
        this.finish = window.FINISH;
        this.graphId = window.GRAPH_ID;
        this.next = window.NEXT;
        this.previous = window.PREVIOUS;
        this.qEvalId = window.Q_EVAL_ID;
        this.qId = window.QUESTION_ID;
        this.state = {
            submission: null
        };

        Object.assign(this.state, defaultGraph);

        this.gv = React.createRef();
        this.ge = React.createRef();

        // Load graph and submission data
        const me = this;
        this.getGraph();
        getEvaluations(this.qId)
            .then(response => response.json())
            .then(data => {
                me.setState({'evaluations': data});
            });
        this.getQuestionEvaluation();
    }

    render() {
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
                updateGraph={this.handleGraphUpdate.bind(this)}
                {...this.state}
            />
            <section id="assignment-nav" className="row d-flex">
                {this.previousQuestion()}
                {this.nextQuestion()}
            </section>
        </React.Fragment>;
        
    }

    nextQuestion() {
        if (this.next) {
            return (
                <button
                    className="btn btn-primary ml-auto" 
                    title="Next Question"
                    onClick={() => {return this.evaluate(this.next);}}
                >
                    Next Question
                </button>
            );
        } else {
            return (
                <button
                    className="btn btn-warning ml-auto" 
                    title="Finish Assignment"
                    onClick={() => {return this.evaluate(this.finish);}}
                >
                    Finish Assignment
                </button>
            );
        }
    }

    previousQuestion() {
        if (this.previous) {
            return (
                <button
                    className="btn btn-primary mr-auto" 
                    title="Previous Question"
                    onClick={() => {return this.evaluate(this.previous);}}
                >
                    Previous Question
                </button>
            );
        }
    }

    componentDidMount() {
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
            this.setState({
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
            this.setState({
                [`gLine${line}OffsetX`]: offset.x,
                [`gLine${line}OffsetY`]: offset.y
            });
        });
        document.addEventListener('l3offset', function(e) {
            const offset = e.detail;
            this.setState({
                gLine3OffsetX: offset.x,
                gLine3OffsetY: offset.y
            });
        });
    }

    convert_label(label) {
        let new_label = 'g';
        for (let word of label.split('_')) {
            new_label += word.charAt(0).toUpperCase() + word.slice(1);
        }
        return new_label;
    }

    evaluate(url) {
        let score = 0;
        console.log('State:', this.state);
        for (let evaluation of this.state.evaluations) {
            let label = this.convert_label(evaluation.field);
            console.log('Label: ', label);
            const offset = this.state[`${label}OffsetX`];
            const initial = this.state[`${label}InitialtX`];
            console.log('Offset:', offset, 'Initial:', initial);
            if (evaluation.comparison == Math.sign(offset - initial)) {
                score += evaluation.score;
            }
        }
        const updated = {...this.state.qEval, 'score': score};
        this.setState(
            {'qEval': updated},
            () => {this.updateQuestionEvaluation(url);}
        );
    }

    getGraph() {
        const me = this;
        return authedFetch(`/api/graphs/${this.graphId}/`)
            .then(function(response) {return response.json();})
            .then(function(json) {importGraph(json, me);});
    }

    getQuestionEvaluation() {
        const me = this;
        return authedFetch(`/api/question_evaluations/${this.qEvalId}/`)
            .then(function(response) {return response.json();})
            .then(data => {me.setState({'qEval': data});});
    }

    updateQuestionEvaluation(url) {
        console.log('Updated Evaluation:', this.state.qEval);
        authedFetch(
            `/api/question_evaluations/${this.qEvalId}/`, 'put', JSON.stringify(this.state.qEval))
            .then(function(response) {return response.json();})
            .then(() => {
                // location.href = url;
            });
    }

    handleGraphUpdate(obj) {
        this.setState(obj);
    }

    updateDisplayIntersection(checked) {
        this.setState({gShowIntersection: checked});
    }
}

export default Assignment;
