import React from 'react';
import PropTypes from 'prop-types';
import JXGBoard from './JXGBoard.jsx';
import ResetGraphButton from './buttons/ResetGraphButton.jsx';
import {
    BOARD_WIDTH, BOARD_HEIGHT, getGraph
} from './utils';
import { defaultGraph, convertGraph } from './GraphMapping.js';


/**
 * This component is used to view an econgraph object.
 */
export default class GraphPreview extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            currentFeedback: [],
            gId: null,
            graph: defaultGraph,
            score: 0,
        };
        this.state = this.initialState;
        this.updateGraph = this.updateGraph.bind(this);
        const me = this;
        getGraph(props.gId).then(data => {
            if (data) {
                me.setState({graph: convertGraph(data)});
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.gId !== prevProps.gId) {
            const me = this;
            getGraph(this.props.gId).then(data => {
                if (data) {
                    me.setState({graph: convertGraph(data)});
                }
            });
        }
    }

    render() {
        let isInstructor = false;
        if (window.EconPlayground && window.EconPlayground.isInstructor) {
            isInstructor = window.EconPlayground.isInstructor;
        }

        let initialState = this.initialState;

        let key = '';
        for (key in this.props) {
            if (key.endsWith('Initial')) {
                initialState[key.replace(/Initial$/, '')] = this.props[key];
            }
        }

        let graph = (
            <p>No Graph Found.</p>
        );

        if (
            this.state.graph.gId
        ) {
            graph = (
                <JXGBoard
                    className='row'
                    id={'editing-graph'}
                    width={BOARD_WIDTH}
                    height={BOARD_HEIGHT}
                    shadow={!isInstructor}
                    {...this.state.graph}
                />
            );
        }
        return (
            <div className="GraphPreview p-2">
                <h4><strong>{this.state.graph ? this.state.graph.gTitle :
                    'No graph selected'}</strong></h4>
                <p>{this.state.graph && this.state.graph.gInstructions}</p>
                <div className="row bg-white mb-2 overflow-hidden">
                    {graph}
                </div>
                <div className="row justify-content-end">
                    <ResetGraphButton
                        initialState={initialState}
                        updateGraph={this.updateGraph} />
                </div>
            </div>
        );
    }
    // When the submission is loaded by the Viewer, see if
    // this.state.currentFeedback should be updated.
    
    updateGraph(state) {
        this.setState({currentFeedback: state.currentFeedback});
    }
}

GraphPreview.propTypes = {
    gId: PropTypes.number,
};
