import React, { Component } from 'react';
import GraphForm from './GraphForm.jsx';
import { defaultGraph, importGraph } from './GraphMapping.js';
import ResetGraphButton from './buttons/ResetGraphButton.jsx';
import JXGBoard from './JXGBoard.jsx';
import {
    authedFetch, BOARD_WIDTH, BOARD_HEIGHT
} from './utils.js';

/**
 * StepGraphViewer
 *
 * This component is intended to be used in an Assignment Step. Basically,
 * just render the graph with no surrounding assessment stuff - let all
 * that be handled in Django.
 *
 * TODO: migrate to function component.
 * https://react.dev/reference/react/Component#alternatives
 */
export default class StepGraphViewer extends Component {
    constructor(props) {
        super(props);

        if (window.GRAPH_ID) {
            this.graphId = window.GRAPH_ID;
        }

        this.state = {
            initialState: {},
            actions: []
        };
        this.state = Object.assign(this.state, defaultGraph);
    }

    getGraph() {
        const me = this;
        return authedFetch(`/api/graphs/${this.graphId}/`)
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                importGraph(json, me, function() {
                    let initialState = me.state.initialState;

                    // Handle initialState weirdness so the reset
                    // button works properly.
                    let key = '';
                    for (key in me.state) {
                        if (key.endsWith('Initial')) {
                            initialState[key.replace(/Initial$/, '')] =
                                me.state[key];
                        }
                    }
                    me.setState({initialState: initialState});
                });
            });
    }

    /**
     * Initialize handlers for all custom events for the given line.
     *
     * See the postMake() step of Graph.js for how these events get
     * set up.
     */
    setupLineEventHandlers(line) {
        const me = this;

        // This is annoyingly required for the Reset button to work
        // properly. Can this be re-organized to be handled
        // automatically by the graph system?
        document.addEventListener(`l${line}offset`, function(e) {
            const offset = e.detail;

            me.setState({
                [`gLine${line}OffsetX`]: offset.x,
                [`gLine${line}OffsetY`]: offset.y
            });
        });

        document.addEventListener(`l${line}up`, function(e) {
            let actions = [...me.state.actions, {
                key: window.crypto.randomUUID(),
                name: 'line_' + line,
                value: 'up'
            }];

            me.setState({
                actions: actions
            });
        });

        document.addEventListener(`l${line}down`, function(e) {
            let actions = [...me.state.actions, {
                key: window.crypto.randomUUID(),
                name: 'line_' + line,
                value: 'down'
            }];

            me.setState({
                actions: actions
            });
        });
    }

    componentDidMount() {
        this.getGraph();

        this.setupLineEventHandlers(1);
        this.setupLineEventHandlers(2);

        // TODO: Only if we have line 3
        this.setupLineEventHandlers(3);
    }

    render() {
        let leftSide = <p>Loading...</p>;
        let rightSide = <p>Loading...</p>;

        if (
            typeof this.state.gType !== 'undefined' &&
                this.state.gType !== null
        ) {
            leftSide =
                <JXGBoard
                    id={'editing-graph'}
                    width={BOARD_WIDTH}
                    height={BOARD_HEIGHT}
                    shadow={true}
                    {...this.state}
                />;

            rightSide =
                <GraphForm
                    gType={this.state.gType}
                    updateGraph={this.setState.bind(this)}
                    props={this.state}
                />;
        }

        return (
            <div className="GraphViewer mb-1">
                <div className="row">
                    <div className="col">
                        <div className="sticky-top">
                            {leftSide}
                        </div>
                    </div>

                    <div className="col">
                        {rightSide}

                        <ResetGraphButton
                            initialState={this.state.initialState}
                            updateGraph={this.setState.bind(this)} />
                    </div>
                </div>
                {this.state.actions.map((action) => (
                    <div key={action.key}>
                        <input
                            type="hidden"
                            name="action_name" value={action.name} />
                        <input
                            type="hidden"
                            name="action_value" value={action.value} />
                    </div>
                ))}
            </div>
        );
    }
}
