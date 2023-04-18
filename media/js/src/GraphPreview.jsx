import React from 'react';
import PropTypes from 'prop-types';
import JXGBoard from './JXGBoard';
import ResetGraphButton from './buttons/ResetGraphButton';
import {
    BOARD_WIDTH, BOARD_HEIGHT
} from './utils';

/**
 * This component is used to view an econgraph object.
 */
export default class GraphPreview extends React.Component {
    constructor(props) {
        super(props);

        this.initialState = {
            currentFeedback: [],
            score: 0
        };
        this.state = this.initialState;
        this.updateGraph = this.updateGraph.bind(this);
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
            <p>Loading...</p>
        );
        if (
            typeof this.props.gType !== 'undefined' &&
                this.props.gType !== null
        ) {
            graph = (
                <JXGBoard
                    id={'editing-graph'}
                    width={BOARD_WIDTH}
                    height={BOARD_HEIGHT}
                    shadow={!isInstructor}
                    {...this.props}
                />
            );
        }
        return (
            <div className="GraphPreview p-2">
                <h4><strong>{this.props.gTitle}</strong></h4>
                <p>{this.props.gInstructions}</p>
                <div className="row bg-white mb-2">
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
    gType: PropTypes.number,
    gTitle: PropTypes.string,
    gInstructions: PropTypes.string,
    gNeedsSubmit: PropTypes.bool,
    // gAssignmentType: PropTypes.number.isRequired,

    // gShowIntersection: PropTypes.bool.isRequired,
    // gDisplayIntersection1: PropTypes.bool.isRequired,
    gDisplayIntersection1Initial: PropTypes.bool,
    // gIntersectionLabel: PropTypes.string.isRequired,
    // gDisplayIntersection2: PropTypes.bool.isRequired,
    gDisplayIntersection2Initial: PropTypes.bool,
    // gIntersection2Label: PropTypes.string.isRequired,
    // gDisplayIntersection3: PropTypes.bool.isRequired,
    gDisplayIntersection3Initial: PropTypes.bool,
    // gIntersection3Label: PropTypes.string.isRequired,
    // gDisplayShadow: PropTypes.bool.isRequired,

    gIntersectionHorizLineLabel: PropTypes.string,
    gIntersectionVertLineLabel: PropTypes.string,
    gIntersection2HorizLineLabel: PropTypes.string,
    gIntersection2VertLineLabel: PropTypes.string,
    gIntersection3HorizLineLabel: PropTypes.string,
    gIntersection3VertLineLabel: PropTypes.string,

    gDisplayFeedback: PropTypes.bool,

    // gLine1Label: PropTypes.string.isRequired,
    // gLine2Label: PropTypes.string.isRequired,
    // gLine3Label: PropTypes.string.isRequired,
    gLine4Label: PropTypes.string,

    gXAxisLabel: PropTypes.string,
    gYAxisLabel: PropTypes.string,
    gXAxis2Label: PropTypes.string,
    gYAxis2Label: PropTypes.string,
    // gLine1Slope: PropTypes.number.isRequired,
    gLine1SlopeInitial: PropTypes.number,
    gLine2Slope: PropTypes.number,
    gLine2SlopeInitial: PropTypes.number,
    gLine3Slope: PropTypes.number,
    gLine3SlopeInitial: PropTypes.number,
    gLine4Slope: PropTypes.number,
    gLine4SlopeInitial: PropTypes.number,

    // gLine1OffsetX: PropTypes.number.isRequired,
    // gLine1OffsetY: PropTypes.number.isRequired,
    gLine1OffsetXInitial: PropTypes.number,
    gLine1OffsetYInitial: PropTypes.number,
    // gLine2OffsetX: PropTypes.number.isRequired,
    // gLine2OffsetY: PropTypes.number.isRequired,
    gLine2OffsetXInitial: PropTypes.number,
    gLine2OffsetYInitial: PropTypes.number,
    // gLine3OffsetX: PropTypes.number.isRequired,
    // gLine3OffsetY: PropTypes.number.isRequired,
    gLine3OffsetXInitial: PropTypes.number,
    gLine3OffsetYInitial: PropTypes.number,
    // gLine4OffsetX: PropTypes.number.isRequired,
    // gLine4OffsetY: PropTypes.number.isRequired,
    gLine4OffsetXInitial: PropTypes.number,
    gLine4OffsetYInitial: PropTypes.number,

    // gLine1Dashed: PropTypes.bool.isRequired,
    // gLine2Dashed: PropTypes.bool.isRequired,
    // gLine3Dashed: PropTypes.bool.isRequired,

    gAlpha: PropTypes.number,

    gA1: PropTypes.number,
    gA1Initial: PropTypes.number,
    gA2: PropTypes.number,
    gA2Initial: PropTypes.number,
    gA3: PropTypes.number,
    gA3Initial: PropTypes.number,
    gA4: PropTypes.number,
    gA4Initial: PropTypes.number,
    gA5: PropTypes.number,
    gA5Initial: PropTypes.number,

    gA: PropTypes.number,
    gK: PropTypes.number,
    gR: PropTypes.number,
    gY1: PropTypes.number,
    gY2: PropTypes.number,

    gCobbDouglasA: PropTypes.number,
    gCobbDouglasAInitial: PropTypes.number,
    gCobbDouglasAName: PropTypes.string,
    gCobbDouglasL: PropTypes.number,
    gCobbDouglasLInitial: PropTypes.number,
    gCobbDouglasLName: PropTypes.string,
    gCobbDouglasK: PropTypes.number,
    gCobbDouglasKInitial: PropTypes.number,
    gCobbDouglasKName: PropTypes.string,
    gCobbDouglasAlpha: PropTypes.number,
    gCobbDouglasAlphaInitial: PropTypes.number,
    gCobbDouglasYName: PropTypes.string,

    gNName: PropTypes.string,

    gFunctionChoice: PropTypes.number,

    assessment: PropTypes.array,
    submission: PropTypes.object,
    // updateGraph: PropTypes.func.isRequired
};
