import React from 'react';
import JXGBoard from './JXGBoard.jsx';
import { BOARD_WIDTH, BOARD_HEIGHT, getGraph } from './utils';
import { importGraph } from './GraphMapping.js';

/**
 * This component is used to view an econgraph object.
 */
export default class GraphPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const me = this;

        if (this.props.graphId) {
            getGraph(this.props.graphId).then(json => {
                if (json) {
                    importGraph(json, me);
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.graphId && this.props.graphId !== prevProps.graphId) {
            const me = this;

            getGraph(this.props.graphId).then(json => {
                if (json) {
                    importGraph(json, me);
                }
            });
        }
    }

    render() {
        let isInstructor = false;
        if (window.EconPlayground && window.EconPlayground.isInstructor) {
            isInstructor = window.EconPlayground.isInstructor;
        }

        let graph = <p>No Graph Found.</p>;
        let title = null;

        if (this.props.graphId && typeof this.state.gType !== 'undefined') {
            title = this.state.gTitle;
            graph = (
                <JXGBoard
                    className='row'
                    id={'editing-graph'}
                    width={BOARD_WIDTH * 0.75}
                    height={BOARD_HEIGHT * 0.75}
                    shadow={!isInstructor}
                    {...this.state}
                />
            );
        } else if (!this.props.graphId) {
            // No graph selected.
            title = 'No graph selected';
            graph = null;
        } else {
            graph = <p>Loading...</p>;
        }

        return (
            <div className="GraphPreview p-2">
                <h6>{title}</h6>
                <p>{this.state.gInstructions}</p>
                <div className="row bg-white mb-2 overflow-hidden">
                    {graph}
                </div>
            </div>
        );
    }
}
