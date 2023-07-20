import React, { Component } from 'react';
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

    componentDidMount() {
        this.getGraph();

        const me = this;
        document.addEventListener('l1offset', function(e) {
            const offset = e.detail;
            let line = 1;
            if (e.detail.line) {
                line = e.detail.line;
            }

            let actions = [...me.state.actions, {
                key: Date.now(),
                name: 'line1',
                value: 'change'
            }];

            me.setState({
                [`gLine${line}OffsetX`]: offset.x,
                [`gLine${line}OffsetY`]: offset.y,
                actions: actions
            });
        });

        document.addEventListener('l2offset', function(e) {
            const offset = e.detail;
            let line = 2;
            if (e.detail.line) {
                line = e.detail.line;
            }

            let actions = [...me.state.actions, {
                key: Date.now(),
                name: 'line2',
                value: 'change'
            }];

            me.setState({
                [`gLine${line}OffsetX`]: offset.x,
                [`gLine${line}OffsetY`]: offset.y,
                actions: actions
            });
        });

        document.addEventListener('l3offset', function(e) {
            const offset = e.detail;

            let actions = [...me.state.actions, {
                key: Date.now(),
                name: 'line3',
                value: 'change'
            }];

            me.setState({
                gLine3OffsetX: offset.x,
                gLine3OffsetY: offset.y,
                actions: actions
            });
        });
    }

    render() {
        let leftSide = (
            <p>Loading...</p>
        );
        if (
            typeof this.state.gType !== 'undefined' &&
                this.state.gType !== null
        ) {
            leftSide = (
                <JXGBoard
                    id={'editing-graph'}
                    width={BOARD_WIDTH}
                    height={BOARD_HEIGHT}
                    shadow={true}
                    {...this.state}
                />
            );
        }

        const rightSide = <p>rightSide</p>;

        return (
            <div className="GraphViewer">
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
                    <input
                        type="hidden"
                        key={action.key}
                        name={action.name} value={action.value} />
                ))}
            </div>
        );
    }
}
