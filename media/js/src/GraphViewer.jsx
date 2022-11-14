import React from 'react';
import PropTypes from 'prop-types';
import * as commonmark from 'commonmark';
import Assessment from './Assessment';
import ADASEditor from './editors/ADASEditor';
import CobbDouglasEditor from './editors/CobbDouglasEditor';
import CobbDouglasNLDSEditor from './editors/CobbDouglasNLDSEditor';
import ConsumptionLeisureEditor from './editors/ConsumptionLeisureEditor';
import ConsumptionSavingEditor from './editors/ConsumptionSavingEditor';
import DemandSupplyEditor from './editors/DemandSupplyEditor';
import NonLinearDemandSupplyEditor from './editors/NonLinearDemandSupplyEditor';
import ExportGraphButton from './buttons/ExportGraphButton';
import ResetGraphButton from './buttons/ResetGraphButton';
import SubmitButton from './buttons/SubmitButton';
import JXGBoard from './JXGBoard';
import Feedback from './Feedback';
import {forceFloat, getOrCreateSubmission} from './utils';

const BOARD_WIDTH = 540;
const BOARD_HEIGHT = 300;

/**
 * This component is used to view an econgraph object.
 */
export default class GraphViewer extends React.Component {
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
        let action = '';
        if (window.EconPlayground && window.EconPlayground.LTIPostGrade) {
            action = window.EconPlayground.LTIPostGrade;
        }

        let successUrl = '/';
        if (window.EconPlayground && window.EconPlayground.EmbedSuccess) {
            successUrl = window.EconPlayground.EmbedSuccess;
        }

        let launchUrl = '';
        if (window.EconPlayground && window.EconPlayground.EmbedLaunchUrl) {
            launchUrl = window.EconPlayground.EmbedLaunchUrl;
        }

        let isInstructor = false;
        if (window.EconPlayground && window.EconPlayground.isInstructor) {
            isInstructor = window.EconPlayground.isInstructor;
        }

        const displayLabels = isInstructor ||
              this.props.gAssignmentType === 0 ||
              this.props.gAssignmentType === 1;

        const displaySliders = isInstructor ||
              this.props.gAssignmentType === 0 ||
              this.props.gAssignmentType === 2;

        const token = document.getElementById(
            'csrf-token').getAttribute('content');

        let initialState = this.initialState;

        let key = '';
        for (key in this.props) {
            if (key.endsWith('Initial')) {
                initialState[key.replace(/Initial$/, '')] = this.props[key];
            }
        }

        let titleEl = <h1></h1>;
        let instructionsEl = <p></p>;

        if (!window.EconPlayground.hideTitleAndInstructions) {
            titleEl = <h1>{this.props.gTitle}</h1>;
        }

        if (!window.EconPlayground.hideTitleAndInstructions && this.props.gInstructions) {
            const reader = new commonmark.Parser();
            const writer = new commonmark.HtmlRenderer();
            const parsed = reader.parse(this.props.gInstructions);
            const instructions = writer.render(parsed);

            instructionsEl = <p className="lead text-secondary" dangerouslySetInnerHTML={{__html:instructions}}></p>;
        }

        let leftSide = null;
        let rightSide = null;

        if (this.props.gType === 0 || this.props.gType === 9) {
            // Demand-Supply, possibly AUC (area under curve)
            leftSide = <JXGBoard
                           id={'editing-graph'}
                           width={BOARD_WIDTH}
                           height={BOARD_HEIGHT}
                           shadow={!isInstructor}

                           gType={this.props.gType}
                           gLine1Label={this.props.gLine1Label}
                           gLine2Label={this.props.gLine2Label}
                           gXAxisLabel={this.props.gXAxisLabel}
                           gYAxisLabel={this.props.gYAxisLabel}
                           gLine1Slope={this.props.gLine1Slope}
                           gLine1SlopeInitial={this.props.gLine1SlopeInitial}
                           gLine2Slope={this.props.gLine2Slope}
                           gLine2SlopeInitial={this.props.gLine2SlopeInitial}
                           gLine1OffsetX={this.props.gLine1OffsetX}
                           gLine1OffsetXInitial={this.props.gLine1OffsetXInitial}
                           gLine1OffsetY={this.props.gLine1OffsetY}
                           gLine1OffsetYInitial={this.props.gLine1OffsetYInitial}
                           gLine2OffsetX={this.props.gLine2OffsetX}
                           gLine2OffsetXInitial={this.props.gLine2OffsetXInitial}
                           gLine2OffsetY={this.props.gLine2OffsetY}
                           gLine2OffsetYInitial={this.props.gLine2OffsetYInitial}
                           gNeedsSubmit={this.props.gNeedsSubmit}
                           gShowIntersection={this.props.gShowIntersection}
                           gDisplayShadow={this.props.gDisplayShadow}
                           gIntersectionLabel={this.props.gIntersectionLabel}
                           gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                           gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}

                           gAreaConfiguration={this.props.gAreaConfiguration}
                           gAreaConfigurationInitial={
                               this.props.gAreaConfigurationInitial}
                           gIsAreaDisplayed={this.props.gIsAreaDisplayed}

                           gAreaAName={this.props.gAreaAName}
                           gAreaBName={this.props.gAreaBName}
                           gAreaCName={this.props.gAreaCName}
                       />;

            rightSide = <DemandSupplyEditor
                            isInstructor={isInstructor}
                            displayLabels={displayLabels}
                            displaySliders={displaySliders}
                            gLine1Label={this.props.gLine1Label}
                            gLine2Label={this.props.gLine2Label}
                            gLine1Slope={this.props.gLine1Slope}
                            gLine2Slope={this.props.gLine2Slope}
                            gLine1OffsetX={this.props.gLine1OffsetX}
                            gLine1OffsetY={this.props.gLine1OffsetY}
                            gLine2OffsetX={this.props.gLine2OffsetX}
                            gLine2OffsetY={this.props.gLine2OffsetY}
                            gXAxisLabel={this.props.gXAxisLabel}
                            gYAxisLabel={this.props.gYAxisLabel}
                            gIntersectionLabel={this.props.gIntersectionLabel}
                            gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                            gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                            gAreaConfiguration={this.props.gAreaConfiguration}
                            gIsAreaDisplayed={this.props.gIsAreaDisplayed}
                            gAreaAName={this.props.gAreaAName}
                            gAreaBName={this.props.gAreaBName}
                            gAreaCName={this.props.gAreaCName}

                            showAUC={this.props.gType === 9}
                            updateGraph={this.updateGraph}
                        />;
        } else if (this.props.gType === 1 || this.props.gType === 10) {
            // Non-Linear Demand Supply, possibly AUC (area under curve)
            leftSide = <JXGBoard
                           id={'editing-graph'}
                           width={BOARD_WIDTH}
                           height={BOARD_HEIGHT}
                           submission={this.props.submission}
                           shadow={!isInstructor}

                           gType={this.props.gType}
                           gLine1Label={this.props.gLine1Label}
                           gLine2Label={this.props.gLine2Label}
                           gXAxisLabel={this.props.gXAxisLabel}
                           gYAxisLabel={this.props.gYAxisLabel}
                           gLine1Slope={this.props.gLine1Slope}
                           gLine1SlopeInitial={this.props.gLine1SlopeInitial}
                           gLine2Slope={this.props.gLine2Slope}
                           gLine2SlopeInitial={this.props.gLine2SlopeInitial}
                           gLine1OffsetX={this.props.gLine1OffsetX}
                           gLine1OffsetXInitial={this.props.gLine1OffsetXInitial}
                           gLine1OffsetY={this.props.gLine1OffsetY}
                           gLine1OffsetYInitial={this.props.gLine1OffsetYInitial}
                           gLine2OffsetX={this.props.gLine2OffsetX}
                           gLine2OffsetXInitial={this.props.gLine2OffsetXInitial}
                           gLine2OffsetY={this.props.gLine2OffsetY}
                           gLine2OffsetYInitial={this.props.gLine2OffsetYInitial}
                           gNeedsSubmit={this.props.gNeedsSubmit}
                           gShowIntersection={this.props.gShowIntersection}
                           gDisplayShadow={this.props.gDisplayShadow}
                           gIntersectionLabel={this.props.gIntersectionLabel}
                           gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                           gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}

                           gCobbDouglasA={this.props.gCobbDouglasA}
                           gCobbDouglasAInitial={this.props.gCobbDouglasAInitial}
                           gCobbDouglasAName={this.props.gCobbDouglasAName}
                           gCobbDouglasL={this.props.gCobbDouglasL}
                           gCobbDouglasLInitial={this.props.gCobbDouglasLInitial}
                           gCobbDouglasLName={this.props.gCobbDouglasLName}
                           gCobbDouglasK={this.props.gCobbDouglasK}
                           gCobbDouglasKInitial={this.props.gCobbDouglasKInitial}
                           gCobbDouglasKName={this.props.gCobbDouglasKName}
                           gCobbDouglasAlpha={this.props.gCobbDouglasAlpha}
                           gCobbDouglasAlphaInitial={this.props.gCobbDouglasAlphaInitial}
                           gCobbDouglasYName={this.props.gCobbDouglasYName}

                           gNName={this.props.gNName}
                           gFunctionChoice={this.props.gFunctionChoice}

                           gAreaConfiguration={this.props.gAreaConfiguration}
                           gAreaConfigurationInitial={
                               this.props.gAreaConfigurationInitial}
                           gIsAreaDisplayed={this.props.gIsAreaDisplayed}

                           gAreaAName={this.props.gAreaAName}
                           gAreaBName={this.props.gAreaBName}
                           gAreaCName={this.props.gAreaCName}
                       />;
            rightSide = <NonLinearDemandSupplyEditor
                            isInstructor={isInstructor}
                            displayLabels={displayLabels}
                            displaySliders={displaySliders}
                            gLine1Label={this.props.gLine1Label}
                            gLine2Label={this.props.gLine2Label}
                            gCobbDouglasA={this.props.gCobbDouglasA}
                            gCobbDouglasAInitial={this.props.gCobbDouglasAInitial}
                            gCobbDouglasAName={this.props.gCobbDouglasAName}
                            gCobbDouglasK={this.props.gCobbDouglasK}
                            gCobbDouglasKInitial={this.props.gCobbDouglasKInitial}
                            gCobbDouglasKName={this.props.gCobbDouglasKName}
                            gNName={this.props.gNName}
                            gLine1Slope={this.props.gLine1Slope}
                            gLine1OffsetX={this.props.gLine1OffsetX}
                            gLine1OffsetY={this.props.gLine1OffsetY}
                            gLine2OffsetX={this.props.gLine2OffsetX}
                            gLine2OffsetY={this.props.gLine2OffsetY}
                            gIntersectionLabel={this.props.gIntersectionLabel}
                            gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                            gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                            gFunctionChoice={this.props.gFunctionChoice}
                            gAreaConfiguration={this.props.gAreaConfiguration}
                            gIsAreaDisplayed={this.props.gIsAreaDisplayed}
                            gAreaAName={this.props.gAreaAName}
                            gAreaBName={this.props.gAreaBName}
                            gAreaCName={this.props.gAreaCName}
                            showAUC={this.props.gType === 10}
                            updateGraph={this.updateGraph}
                        />;
        } else if (this.props.gType === 3 || this.props.gType === 12) {
            leftSide = <JXGBoard
                           id={'editing-graph'}
                           width={BOARD_WIDTH}
                           height={BOARD_HEIGHT}
                           submission={this.props.submission}
                           shadow={!isInstructor}

                           gType={this.props.gType}
                           gLine1Label={this.props.gLine1Label}
                           gLine2Label={this.props.gLine2Label}
                           gXAxisLabel={this.props.gCobbDouglasLName}
                           gYAxisLabel={this.props.gCobbDouglasYName}
                           gLine1Slope={this.props.gLine1Slope}
                           gLine2Slope={this.props.gLine2Slope}
                           gLine1OffsetX={this.props.gLine1OffsetX}
                           gLine1OffsetY={this.props.gLine1OffsetY}
                           gLine2OffsetX={this.props.gLine2OffsetX}
                           gLine2OffsetY={this.props.gLine2OffsetY}
                           gNeedsSubmit={this.props.gNeedsSubmit}
                           gShowIntersection={this.props.gShowIntersection}
                           gDisplayShadow={this.props.gDisplayShadow}
                           gIntersectionLabel={this.props.gIntersectionLabel}
                           gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                           gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}

                           gFunctionChoice={this.props.gFunctionChoice}

                           gCobbDouglasA={this.props.gCobbDouglasA}
                           gCobbDouglasAInitial={this.props.gCobbDouglasAInitial}
                           gCobbDouglasAName={this.props.gCobbDouglasAName}
                           gCobbDouglasL={this.props.gCobbDouglasL}
                           gCobbDouglasLInitial={this.props.gCobbDouglasLInitial}
                           gCobbDouglasLName={this.props.gCobbDouglasLName}
                           gCobbDouglasK={this.props.gCobbDouglasK}
                           gCobbDouglasKInitial={this.props.gCobbDouglasKInitial}
                           gCobbDouglasKName={this.props.gCobbDouglasKName}
                           gCobbDouglasAlpha={this.props.gCobbDouglasAlpha}
                           gCobbDouglasAlphaInitial={this.props.gCobbDouglasAlphaInitial}
                           gCobbDouglasYName={this.props.gCobbDouglasYName}
                           gNName={this.props.gNName}
                       />;
            if (this.props.gType === 3) {
                rightSide = <CobbDouglasEditor
                    isInstructor={isInstructor}
                    displayLabels={displayLabels}
                    displaySliders={displaySliders}
                    gCobbDouglasA={this.props.gCobbDouglasA}
                    gCobbDouglasAName={this.props.gCobbDouglasAName}
                    gCobbDouglasL={this.props.gCobbDouglasL}
                    gCobbDouglasLName={this.props.gCobbDouglasLName}
                    gCobbDouglasK={this.props.gCobbDouglasK}
                    gCobbDouglasKName={this.props.gCobbDouglasKName}
                    gCobbDouglasAlpha={this.props.gCobbDouglasAlpha}
                    gCobbDouglasYName={this.props.gCobbDouglasYName}
                    gIntersectionLabel={this.props.gIntersectionLabel}
                    updateGraph={this.updateGraph}
                            />;
            } else if (this.props.gType === 12) {
                rightSide = <CobbDouglasNLDSEditor
                                displayLabels={displayLabels}
                                displaySliders={displaySliders}
                                isInstructor={isInstructor}
                                gLine1Label={this.props.gLine1Label}
                                gLine2Label={this.props.gLine2Label}
                                gCobbDouglasA={this.props.gCobbDouglasA}
                                gCobbDouglasAName={this.props.gCobbDouglasAName}
                                gCobbDouglasK={this.props.gCobbDouglasK}
                                gCobbDouglasKName={this.props.gCobbDouglasKName}
                                gCobbDouglasL={this.props.gCobbDouglasL}
                                gCobbDouglasLName={this.props.gCobbDouglasLName}
                                gCobbDouglasAlpha={this.props.gCobbDouglasAlpha}
                                gCobbDouglasYName={this.props.gCobbDouglasYName}
                                gNName={this.props.gNName}
                                gLine1Slope={this.props.gLine1Slope}
                                gLine1OffsetX={this.props.gLine1OffsetX}
                                gLine1OffsetY={this.props.gLine1OffsetY}
                                gLine2OffsetX={this.props.gLine2OffsetX}
                                gLine2OffsetY={this.props.gLine2OffsetY}
                                gIntersectionLabel={this.props.gIntersectionLabel}
                                gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                                gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                                gFunctionChoice={this.props.gFunctionChoice}

                                gAreaConfiguration={this.props.gAreaConfiguration}
                                gIsAreaDisplayed={this.props.gIsAreaDisplayed}
                                showAUC={false}

                                updateGraph={this.updateGraph}
                            />;
            }
        } else if (this.props.gType === 5 || this.props.gType === 15) {
            // Consumption Leisure: Contraint and Optimal Choice
            leftSide = <JXGBoard
                           id={'editing-graph'}
                           width={BOARD_WIDTH}
                           height={BOARD_HEIGHT}
                           submission={this.props.submission}
                           shadow={!isInstructor}

                           gType={this.props.gType}
                           gA1={this.props.gA1}
                           gA1Initial={this.props.gA1Initial}
                           gA2={this.props.gA2}
                           gA2Initial={this.props.gA2Initial}
                           gA3={this.props.gA3}
                           gA3Initial={this.props.gA3Initial}
                           gA4={this.props.gA4}
                           gA4Initial={this.props.gA4Initial}
                           gLine1Label={this.props.gLine1Label}
                           gLine2Label={this.props.gLine2Label}
                           gXAxisLabel={this.props.gXAxisLabel}
                           gYAxisLabel={this.props.gYAxisLabel}
                           gLine1Slope={this.props.gLine1Slope}
                           gLine2Slope={this.props.gLine2Slope}
                           gLine1OffsetX={this.props.gLine1OffsetX}
                           gLine1OffsetY={this.props.gLine1OffsetY}
                           gLine2OffsetX={this.props.gLine2OffsetX}
                           gLine2OffsetY={this.props.gLine2OffsetY}
                           gNeedsSubmit={this.props.gNeedsSubmit}
                           gShowIntersection={this.props.gShowIntersection}
                           gDisplayShadow={this.props.gDisplayShadow}
                           gIntersectionLabel={this.props.gIntersectionLabel}
                           gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                           gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                           gIntersection2HorizLineLabel={this.props.gIntersection2HorizLineLabel}
                           gIntersection2VertLineLabel={this.props.gIntersection2VertLineLabel}
                       />;
            rightSide = <ConsumptionLeisureEditor
                            gType={this.props.gType}
                            isInstructor={isInstructor}
                            displayLabels={displayLabels}
                            displaySliders={displaySliders}
                            gA1={this.props.gA1}
                            gA2={this.props.gA2}
                            gA3={this.props.gA3}
                            gA4={this.props.gA4}
                            gLine1Label={this.props.gLine1Label}
                            gIntersectionLabel={this.props.gIntersectionLabel}
                            gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                            gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}

                            gIntersection2HorizLineLabel={this.props.gIntersection2HorizLineLabel}
                            gIntersection2VertLineLabel={this.props.gIntersection2VertLineLabel}

                            gXAxisLabel={this.props.gXAxisLabel}
                            gYAxisLabel={this.props.gYAxisLabel}

                            updateGraph={this.updateGraph}
                        />;
        } else if (this.props.gType === 7 || this.props.gType === 11) {
            // Consumption-Saving
            leftSide = <JXGBoard
                           id={'editing-graph'}
                           width={BOARD_WIDTH}
                           height={BOARD_HEIGHT}
                           submission={this.props.submission}
                           shadow={!isInstructor}

                           gType={this.props.gType}
                           gA1={this.props.gA1}
                           gA1Initial={this.props.gA1Initial}
                           gA2={this.props.gA2}
                           gA2Initial={this.props.gA2Initial}
                           gA3={this.props.gA3}
                           gA3Initial={this.props.gA3Initial}
                           gA4={this.props.gA4}
                           gA4Initial={this.props.gA4Initial}
                           gA5={this.props.gA5}
                           gA5Initial={this.props.gA5Initial}
                           gLine1Label={this.props.gLine1Label}
                           gLine2Label={this.props.gLine2Label}
                           gXAxisLabel={this.props.gXAxisLabel}
                           gYAxisLabel={this.props.gYAxisLabel}
                           gLine1Slope={this.props.gLine1Slope}
                           gLine2Slope={this.props.gLine2Slope}
                           gLine1OffsetX={this.props.gLine1OffsetX}
                           gLine1OffsetY={this.props.gLine1OffsetY}
                           gLine2OffsetX={this.props.gLine2OffsetX}
                           gLine2OffsetY={this.props.gLine2OffsetY}
                           gNeedsSubmit={this.props.gNeedsSubmit}
                           gShowIntersection={this.props.gShowIntersection}
                           gDisplayShadow={this.props.gDisplayShadow}
                           gIntersectionLabel={this.props.gIntersectionLabel}
                           gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                           gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                           gIntersection2Label={this.props.gIntersection2Label}
                           gIntersection2HorizLineLabel={this.props.gIntersection2HorizLineLabel}
                           gIntersection2VertLineLabel={this.props.gIntersection2VertLineLabel}
                           gIntersection3HorizLineLabel={this.props.gIntersection3HorizLineLabel}
                           gIntersection3VertLineLabel={this.props.gIntersection3VertLineLabel}
                       />;
            rightSide = <ConsumptionSavingEditor
                            gType={this.props.gType}
                            isInstructor={isInstructor}
                            displayLabels={displayLabels}
                            displaySliders={displaySliders}
                            gA1={this.props.gA1}
                            gA2={this.props.gA2}
                            gA3={this.props.gA3}
                            gA4={this.props.gA4}
                            gA5={this.props.gA5}
                            gLine1Label={this.props.gLine1Label}
                            gShowIntersection={this.props.gShowIntersection}
                            gIntersectionLabel={this.props.gIntersectionLabel}
                            gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                            gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                            gIntersection2Label={this.props.gIntersection2Label}
                            gIntersection2HorizLineLabel={this.props.gIntersection2HorizLineLabel}
                            gIntersection2VertLineLabel={this.props.gIntersection2VertLineLabel}
                            gIntersection3HorizLineLabel={this.props.gIntersection3HorizLineLabel}
                            gIntersection3VertLineLabel={this.props.gIntersection3VertLineLabel}

                            updateGraph={this.updateGraph}
                        />;
        } else if (this.props.gType === 8) {
            // Aggregate Demand - Aggregate Supply
            leftSide = <JXGBoard
                           id={'editing-graph'}
                           shadow={!isInstructor}
                           width={BOARD_WIDTH}
                           height={BOARD_HEIGHT}
                           gType={this.props.gType}
                           gA1={this.props.gA1}
                           gA2={this.props.gA2}
                           gA3={this.props.gA3}
                           gA4={this.props.gA4}
                           gLine1Label={this.props.gLine1Label}
                           gLine2Label={this.props.gLine2Label}
                           gLine3Label={this.props.gLine3Label}
                           gLine1Dashed={this.props.gLine1Dashed}
                           gLine2Dashed={this.props.gLine2Dashed}
                           gLine3Dashed={this.props.gLine3Dashed}
                           gXAxisLabel={this.props.gXAxisLabel}
                           gYAxisLabel={this.props.gYAxisLabel}
                           gLine1Slope={this.props.gLine1Slope}
                           gLine1SlopeInitial={this.props.gLine1SlopeInitial}
                           gLine2Slope={this.props.gLine2Slope}
                           gLine2SlopeInitial={this.props.gLine2SlopeInitial}
                           gLine3Slope={this.props.gLine3Slope}
                           gLine3SlopeInitial={this.props.gLine3SlopeInitial}
                           gLine1OffsetX={this.props.gLine1OffsetX}
                           gLine1OffsetY={this.props.gLine1OffsetY}
                           gLine1OffsetXInitial={this.props.gLine1OffsetXInitial}
                           gLine1OffsetYInitial={this.props.gLine1OffsetYInitial}
                           gLine2OffsetX={this.props.gLine2OffsetX}
                           gLine2OffsetY={this.props.gLine2OffsetY}
                           gLine2OffsetXInitial={this.props.gLine2OffsetXInitial}
                           gLine2OffsetYInitial={this.props.gLine2OffsetYInitial}
                           gLine3OffsetX={this.props.gLine3OffsetX}
                           gLine3OffsetY={this.props.gLine3OffsetY}
                           gLine3OffsetXInitial={this.props.gLine3OffsetXInitial}
                           gLine3OffsetYInitial={this.props.gLine3OffsetYInitial}
                           gDisplayIntersection1={this.props.gDisplayIntersection1}
                           gDisplayIntersection1Initial={this.props.gDisplayIntersection1Initial}
                           gIntersectionLabel={this.props.gIntersectionLabel}
                           gDisplayIntersection2={this.props.gDisplayIntersection2}
                           gDisplayIntersection2Initial={this.props.gDisplayIntersection2Initial}
                           gIntersection2Label={this.props.gIntersection2Label}
                           gDisplayIntersection3={this.props.gDisplayIntersection3}
                           gDisplayIntersection3Initial={this.props.gDisplayIntersection3Initial}
                           gIntersection3Label={this.props.gIntersection3Label}

                           gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                           gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                           gIntersection2HorizLineLabel={this.props.gIntersection2HorizLineLabel}
                           gIntersection2VertLineLabel={this.props.gIntersection2VertLineLabel}
                           gIntersection3HorizLineLabel={this.props.gIntersection3HorizLineLabel}
                           gIntersection3VertLineLabel={this.props.gIntersection3VertLineLabel}

                           gShowIntersection={this.props.gShowIntersection}
                       />;
            rightSide = <ADASEditor
                            gXAxisLabel={this.props.gXAxisLabel}
                            gYAxisLabel={this.props.gYAxisLabel}
                            gA1={this.props.gA1}
                            gA2={this.props.gA2}
                            gA3={this.props.gA3}
                            gA4={this.props.gA4}
                            gLine1Slope={this.props.gLine1Slope}
                            gLine1Label={this.props.gLine1Label}
                            gLine2Slope={this.props.gLine2Slope}
                            gLine2Label={this.props.gLine2Label}
                            gLine3Slope={this.props.gLine3Slope}
                            gLine3Label={this.props.gLine3Label}
                            gShowIntersection={this.props.gShowIntersection}
                            gDisplayIntersection1={this.props.gDisplayIntersection1}
                            gIntersectionLabel={this.props.gIntersectionLabel}
                            gDisplayIntersection2={this.props.gDisplayIntersection2}
                            gIntersection2Label={this.props.gIntersection2Label}
                            gDisplayIntersection3={this.props.gDisplayIntersection3}
                            gIntersection3Label={this.props.gIntersection3Label}
                            gLine1Dashed={this.props.gLine1Dashed}
                            gLine2Dashed={this.props.gLine2Dashed}
                            gLine3Dashed={this.props.gLine3Dashed}

                            gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                            gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                            gIntersection2HorizLineLabel={this.props.gIntersection2HorizLineLabel}
                            gIntersection2VertLineLabel={this.props.gIntersection2VertLineLabel}
                            gIntersection3HorizLineLabel={this.props.gIntersection3HorizLineLabel}
                            gIntersection3VertLineLabel={this.props.gIntersection3VertLineLabel}

                            displayLabels={displayLabels}
                            displaySliders={displaySliders}
                            isInstructor={isInstructor}
                            updateGraph={this.updateGraph}
                        />;
        } else if (this.props.gType === 13 || this.props.gType === 14) {
            if (this.props.gType === 13) {
                leftSide = <JXGBoard
                               id={'editing-graph'}
                               width={BOARD_WIDTH}
                               height={BOARD_HEIGHT}
                               shadow={!isInstructor}

                               gType={this.props.gType}
                               gLine1Label={this.props.gLine1Label}
                               gLine2Label={this.props.gLine2Label}
                               gLine3Label={this.props.gLine3Label}
                               gLine4Label={this.props.gLine4Label}
                               gXAxisLabel={this.props.gXAxisLabel}
                               gYAxisLabel={this.props.gYAxisLabel}
                               gXAxis2Label={this.props.gXAxis2Label}
                               gYAxis2Label={this.props.gYAxis2Label}
                               gLine1Slope={this.props.gLine1Slope}
                               gLine1SlopeInitial={this.props.gLine1SlopeInitial}
                               gLine2Slope={this.props.gLine2Slope}
                               gLine2SlopeInitial={this.props.gLine2SlopeInitial}
                               gLine3Slope={this.props.gLine3Slope}
                               gLine3SlopeInitial={this.props.gLine3SlopeInitial}
                               gLine4Slope={this.props.gLine4Slope}
                               gLine4SlopeInitial={this.props.gLine4SlopeInitial}
                               gLine1OffsetX={this.props.gLine1OffsetX}
                               gLine1OffsetXInitial={this.props.gLine1OffsetXInitial}
                               gLine1OffsetY={this.props.gLine1OffsetY}
                               gLine1OffsetYInitial={this.props.gLine1OffsetYInitial}
                               gLine2OffsetX={this.props.gLine2OffsetX}
                               gLine2OffsetXInitial={this.props.gLine2OffsetXInitial}
                               gLine2OffsetY={this.props.gLine2OffsetY}
                               gLine2OffsetYInitial={this.props.gLine2OffsetYInitial}
                               gLine3OffsetX={this.props.gLine3OffsetX}
                               gLine3OffsetXInitial={this.props.gLine3OffsetXInitial}
                               gLine3OffsetY={this.props.gLine3OffsetY}
                               gLine3OffsetYInitial={this.props.gLine3OffsetYInitial}
                               gLine4OffsetX={this.props.gLine4OffsetX}
                               gLine4OffsetXInitial={this.props.gLine4OffsetXInitial}
                               gLine4OffsetY={this.props.gLine4OffsetY}
                               gLine4OffsetYInitial={this.props.gLine4OffsetYInitial}
                               gNeedsSubmit={this.props.gNeedsSubmit}
                               gShowIntersection={this.props.gShowIntersection}
                               gDisplayShadow={this.props.gDisplayShadow}
                               gIntersectionLabel={this.props.gIntersectionLabel}
                               gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                               gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}

                               gIntersection2Label={this.props.gIntersection2Label}
                               gIntersection2HorizLineLabel={this.props.gIntersection2HorizLineLabel}
                               gIntersection2VertLineLabel={this.props.gIntersection2VertLineLabel}

                               gAreaConfiguration={this.props.gAreaConfiguration}
                               gAreaConfigurationInitial={
                                   this.props.gAreaConfigurationInitial}
                               gIsAreaDisplayed={this.props.gIsAreaDisplayed}

                               gAreaAName={this.props.gAreaAName}
                               gAreaBName={this.props.gAreaBName}
                               gAreaCName={this.props.gAreaCName}
                           />;

                rightSide = <DemandSupplyEditor
                               isInstructor={isInstructor}
                               displayLabels={displayLabels}
                               displaySliders={displaySliders}
                               gLine1Label={this.props.gLine1Label}
                               gLine2Label={this.props.gLine2Label}
                               gLine3Label={this.props.gLine3Label}
                               gLine4Label={this.props.gLine4Label}
                               gLine1Slope={this.props.gLine1Slope}
                               gLine2Slope={this.props.gLine2Slope}
                               gLine3Slope={this.props.gLine3Slope}
                               gLine4Slope={this.props.gLine4Slope}
                               gLine1OffsetX={this.props.gLine1OffsetX}
                               gLine1OffsetY={this.props.gLine1OffsetY}
                               gLine2OffsetX={this.props.gLine2OffsetX}
                               gLine2OffsetY={this.props.gLine2OffsetY}
                               gLine3OffsetX={this.props.gLine3OffsetX}
                               gLine3OffsetY={this.props.gLine3OffsetY}
                               gLine4OffsetX={this.props.gLine4OffsetX}
                               gLine4OffsetY={this.props.gLine4OffsetY}
                               gXAxisLabel={this.props.gXAxisLabel}
                               gYAxisLabel={this.props.gYAxisLabel}
                               gXAxis2Label={this.props.gXAxis2Label}
                               gYAxis2Label={this.props.gYAxis2Label}
                               gIntersectionLabel={this.props.gIntersectionLabel}
                               gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                               gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                               gIntersection2Label={this.props.gIntersection2Label}
                               gIntersection2HorizLineLabel={this.props.gIntersection2HorizLineLabel}
                               gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                               gAreaConfiguration={this.props.gAreaConfiguration}
                               gIsAreaDisplayed={this.props.gIsAreaDisplayed}
                               gAreaAName={this.props.gAreaAName}
                               gAreaBName={this.props.gAreaBName}
                               gAreaCName={this.props.gAreaCName}

                               showAUC={this.props.gType === 9}
                               updateGraph={this.updateGraph}
                                                          />;
            } else if (this.props.gType === 14) {
            // Non-Linear Demand Supply horiz. joint graph
            leftSide = <JXGBoard
                           id={'editing-graph'}
                           width={540}
                           height={288}
                           submission={this.props.submission}
                           shadow={!isInstructor}

                           gType={this.props.gType}
                           gLine1Label={this.props.gLine1Label}
                           gLine2Label={this.props.gLine2Label}
                           gXAxisLabel={this.props.gXAxisLabel}
                           gYAxisLabel={this.props.gYAxisLabel}
                           gLine1Slope={this.props.gLine1Slope}
                           gLine1SlopeInitial={this.props.gLine1SlopeInitial}
                           gLine2Slope={this.props.gLine2Slope}
                           gLine2SlopeInitial={this.props.gLine2SlopeInitial}
                           gLine1OffsetX={this.props.gLine1OffsetX}
                           gLine1OffsetXInitial={this.props.gLine1OffsetXInitial}
                           gLine1OffsetY={this.props.gLine1OffsetY}
                           gLine1OffsetYInitial={this.props.gLine1OffsetYInitial}
                           gLine2OffsetX={this.props.gLine2OffsetX}
                           gLine2OffsetXInitial={this.props.gLine2OffsetXInitial}
                           gLine2OffsetY={this.props.gLine2OffsetY}
                           gLine2OffsetYInitial={this.props.gLine2OffsetYInitial}
                           gNeedsSubmit={this.props.gNeedsSubmit}
                           gShowIntersection={this.props.gShowIntersection}
                           gDisplayShadow={this.props.gDisplayShadow}
                           gIntersectionLabel={this.props.gIntersectionLabel}
                           gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                           gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}

                           gCobbDouglasA={this.props.gCobbDouglasA}
                           gCobbDouglasAInitial={this.props.gCobbDouglasAInitial}
                           gCobbDouglasAName={this.props.gCobbDouglasAName}
                           gCobbDouglasL={this.props.gCobbDouglasL}
                           gCobbDouglasLInitial={this.props.gCobbDouglasLInitial}
                           gCobbDouglasLName={this.props.gCobbDouglasLName}
                           gCobbDouglasK={this.props.gCobbDouglasK}
                           gCobbDouglasKInitial={this.props.gCobbDouglasKInitial}
                           gCobbDouglasKName={this.props.gCobbDouglasKName}
                           gCobbDouglasAlpha={this.props.gCobbDouglasAlpha}
                           gCobbDouglasAlphaInitial={this.props.gCobbDouglasAlphaInitial}
                           gCobbDouglasYName={this.props.gCobbDouglasYName}
                           gNName={this.props.gNName}
                           gFunctionChoice={this.props.gFunctionChoice}

                           gAreaConfiguration={this.props.gAreaConfiguration}
                           gAreaConfigurationInitial={
                               this.props.gAreaConfigurationInitial}
                           gIsAreaDisplayed={this.props.gIsAreaDisplayed}

                           gAreaAName={this.props.gAreaAName}
                           gAreaBName={this.props.gAreaBName}
                           gAreaCName={this.props.gAreaCName}
                       />;
            rightSide = <NonLinearDemandSupplyEditor
                            isInstructor={isInstructor}
                            displayLabels={displayLabels}
                            displaySliders={displaySliders}
                            gLine1Label={this.props.gLine1Label}
                            gLine2Label={this.props.gLine2Label}
                            gCobbDouglasA={this.props.gCobbDouglasA}
                            gCobbDouglasAInitial={this.props.gCobbDouglasAInitial}
                            gCobbDouglasAName={this.props.gCobbDouglasAName}
                            gCobbDouglasK={this.props.gCobbDouglasK}
                            gCobbDouglasKInitial={this.props.gCobbDouglasKInitial}
                            gCobbDouglasKName={this.props.gCobbDouglasKName}
                            gNName={this.props.gNName}
                            gLine1Slope={this.props.gLine1Slope}
                            gLine1OffsetX={this.props.gLine1OffsetX}
                            gLine1OffsetY={this.props.gLine1OffsetY}
                            gLine2OffsetX={this.props.gLine2OffsetX}
                            gLine2OffsetY={this.props.gLine2OffsetY}
                            gIntersectionLabel={this.props.gIntersectionLabel}
                            gIntersectionHorizLineLabel={this.props.gIntersectionHorizLineLabel}
                            gIntersectionVertLineLabel={this.props.gIntersectionVertLineLabel}
                            gFunctionChoice={this.props.gFunctionChoice}
                            gAreaConfiguration={this.props.gAreaConfiguration}
                            gIsAreaDisplayed={this.props.gIsAreaDisplayed}
                            gAreaAName={this.props.gAreaAName}
                            gAreaBName={this.props.gAreaBName}
                            gAreaCName={this.props.gAreaCName}
                            showAUC={this.props.gType === 10}
                            updateGraph={this.updateGraph}
                        />;
            }

            // Show side-by-side view here.
            return (
                <div className="GraphViewer">
                    {titleEl}
                    {instructionsEl}
                    <form onSubmit={this.handleSubmit.bind(this)} action={action} method="post">
                        <input type="hidden" name="csrfmiddlewaretoken" value={token} />
                        <input type="hidden" name="score" value={this.state.score} />
                        <input type="hidden" name="next" value={successUrl} />
                        <input type="hidden" name="launchUrl" value={launchUrl} />

                        <div className="row">
                            {leftSide}
                        </div>

                        <Feedback feedback={this.state.currentFeedback} />

                        {rightSide}

                        <ResetGraphButton
                            initialState={initialState}
                            updateGraph={this.updateGraph} />

                        <ExportGraphButton />

                        <SubmitButton
                            assessment={this.props.assessment}
                            gNeedsSubmit={this.props.gNeedsSubmit}
                            submission={this.props.submission}
                            isInstructor={isInstructor} />
                    </form>
                </div>
            );
        }

        return (
            <div className="GraphViewer">
                {titleEl}
                {instructionsEl}
                <form onSubmit={this.handleSubmit.bind(this)} action={action} method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value={token} />
                    <input type="hidden" name="score" value={this.state.score} />
                    <input type="hidden" name="next" value={successUrl} />
                    <input type="hidden" name="launchUrl" value={launchUrl} />

                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            <div className="sticky-top">
                                {leftSide}

                                <Feedback feedback={this.state.currentFeedback} />
                            </div>
                        </div>

                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            {rightSide}

                            <ResetGraphButton
                                initialState={initialState}
                                updateGraph={this.updateGraph} />

                            <ExportGraphButton />

                            <SubmitButton
                                assessment={this.props.assessment}
                                gNeedsSubmit={this.props.gNeedsSubmit}
                                submission={this.props.submission}
                                isInstructor={isInstructor} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
    // When the submission is loaded by the Viewer, see if
    // this.state.currentFeedback should be updated.
    componentDidUpdate(prevProps) {
        if (prevProps.submission !== this.props.submission) {
            this.loadFeedback(
                this.props.submission.feedback_unfulfilled,
                this.props.submission.feedback_fulfilled);
        }
    }
    loadFeedback(unfulfilledFeedback, fulfilledFeedback) {
        const currentFeedback = [];

        unfulfilledFeedback = unfulfilledFeedback.split(';;');
        fulfilledFeedback = fulfilledFeedback.split(';;');

        unfulfilledFeedback.forEach(e => {
            if (e) {
                currentFeedback.push({
                    feedback: e,
                    fulfilled: false
                });
            }
        });
        fulfilledFeedback.forEach(e => {
            if (e) {
                currentFeedback.push({
                    feedback: e,
                    fulfilled: true
                });
            }
        });

        this.setState({currentFeedback: currentFeedback});
    }
    handleSubmit(event) {
        event.preventDefault();
        const assessment = new Assessment(this.props.assessment);
        const responses = assessment.evalState(this.props);

        if (this.props.gNeedsSubmit) {
            // LTI Assessment graph submitted. Create a Submission
            // object and submit to Canvas with LTI.
            const form = event.target;

            // Sum up the scores for all fulfilled rules.
            const scores = responses.map(x => forceFloat(x.score));
            const score = scores.reduce((a, b) => a + b, 0);

            this.setState({score: score});

            // Save the user's feedback on their Submission object to
            // make it persistent.
            const fulfilledFeedback = responses
                  .filter(x => x.fulfilled)
                  .map(x => x.feedback)
                  .join(';;');
            const unfulfilledFeedback = responses
                  .filter(x => !x.fulfilled)
                  .map(x => x.feedback)
                  .join(';;');

            getOrCreateSubmission({
                graph: this.props.gId,
                feedback_fulfilled: fulfilledFeedback,
                feedback_unfulfilled: unfulfilledFeedback,
                score: score
            }).then(function() {
                form.submit();
            });
        } else {
            // Practice Assessment submitted. Show feedback
            // immediately.
            this.setState({currentFeedback: responses});
        }
    }
    updateGraph(state) {
        this.setState({currentFeedback: state.currentFeedback});
        return this.props.updateGraph(state);
    }
}

GraphViewer.propTypes = {
    gId: PropTypes.number,
    gType: PropTypes.number,
    gTitle: PropTypes.string,
    gInstructions: PropTypes.string,
    gNeedsSubmit: PropTypes.bool,
    gAssignmentType: PropTypes.number.isRequired,

    gShowIntersection: PropTypes.bool.isRequired,
    gDisplayIntersection1: PropTypes.bool.isRequired,
    gDisplayIntersection1Initial: PropTypes.bool,
    gIntersectionLabel: PropTypes.string.isRequired,
    gDisplayIntersection2: PropTypes.bool.isRequired,
    gDisplayIntersection2Initial: PropTypes.bool,
    gIntersection2Label: PropTypes.string.isRequired,
    gDisplayIntersection3: PropTypes.bool.isRequired,
    gDisplayIntersection3Initial: PropTypes.bool,
    gIntersection3Label: PropTypes.string.isRequired,
    gDisplayShadow: PropTypes.bool.isRequired,

    gIntersectionHorizLineLabel: PropTypes.string,
    gIntersectionVertLineLabel: PropTypes.string,
    gIntersection2HorizLineLabel: PropTypes.string,
    gIntersection2VertLineLabel: PropTypes.string,
    gIntersection3HorizLineLabel: PropTypes.string,
    gIntersection3VertLineLabel: PropTypes.string,

    gDisplayFeedback: PropTypes.bool,

    gLine1Label: PropTypes.string.isRequired,
    gLine2Label: PropTypes.string.isRequired,
    gLine3Label: PropTypes.string.isRequired,
    gLine4Label: PropTypes.string,

    gXAxisLabel: PropTypes.string,
    gYAxisLabel: PropTypes.string,
    gXAxis2Label: PropTypes.string,
    gYAxis2Label: PropTypes.string,
    gLine1Slope: PropTypes.number.isRequired,
    gLine1SlopeInitial: PropTypes.number,
    gLine2Slope: PropTypes.number,
    gLine2SlopeInitial: PropTypes.number,
    gLine3Slope: PropTypes.number,
    gLine3SlopeInitial: PropTypes.number,
    gLine4Slope: PropTypes.number,
    gLine4SlopeInitial: PropTypes.number,

    gLine1OffsetX: PropTypes.number.isRequired,
    gLine1OffsetY: PropTypes.number.isRequired,
    gLine1OffsetXInitial: PropTypes.number,
    gLine1OffsetYInitial: PropTypes.number,
    gLine2OffsetX: PropTypes.number.isRequired,
    gLine2OffsetY: PropTypes.number.isRequired,
    gLine2OffsetXInitial: PropTypes.number,
    gLine2OffsetYInitial: PropTypes.number,
    gLine3OffsetX: PropTypes.number.isRequired,
    gLine3OffsetY: PropTypes.number.isRequired,
    gLine3OffsetXInitial: PropTypes.number,
    gLine3OffsetYInitial: PropTypes.number,

    gLine1Dashed: PropTypes.bool.isRequired,
    gLine2Dashed: PropTypes.bool.isRequired,
    gLine3Dashed: PropTypes.bool.isRequired,

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
    updateGraph: PropTypes.func.isRequired
};
