import React from 'react';
import PropTypes from 'prop-types';
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

        getGraph(this.props.gId).then(json => {
            console.log('loaded', json);
            if (json) {
                importGraph(json, me);
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.gId !== prevProps.gId) {
            const me = this;

            getGraph(this.props.gId).then(json => {
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

        if (this.props.gId) {
            graph = (
                <JXGBoard
                    className='row'
                    id={'editing-graph'}
                    width={BOARD_WIDTH}
                    height={BOARD_HEIGHT}
                    shadow={!isInstructor}
                    {...this.state}
                />
            );
        }
        return (
            <div className="GraphPreview p-2">
                <h4><strong>{
                    this.state.gTitle ? this.state.gTitle : 'No graph selected'
                }</strong></h4>
                <p>{this.state.gInstructions}</p>
                <div className="row bg-white mb-2 overflow-hidden">
                    {graph}
                </div>
            </div>
        );
    }
}

GraphPreview.propTypes = {
    gId: PropTypes.number
};
