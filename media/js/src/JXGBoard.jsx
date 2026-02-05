/* global process */

import React from 'react';

import JXG from 'jsxgraph';
import { getKatexEl } from './katexUtils.jsx';
import {
    LINE_1_COLOR, LINE_2_COLOR, LINE_3_COLOR, LINE_4_COLOR
} from './graphs/Graph.js';
import { graphTypes, isJointGraph } from './graphs/graphTypes.js';
import { mkNonLinearDemandSupply } from './graphs/NonLinearDemandSupplyGraph.js';
import { mkDemandSupply } from './graphs/DemandSupplyGraph.js';
import { mkTaxationLinearDemandSupply } from './graphs/TaxationLinearDemandSupplyGraph.js';
import {
    mkInternationalTradeLargeEconomyGlobal
} from './graphs/InternationalTradeLargeEconomyGraph.js';
import AreaDisplay from './AreaDisplay.jsx';
import GraphPane from './GraphPane.jsx';
import Legend from './Legend.jsx';
import {
    getL1SubmissionOffset, getL2SubmissionOffset, GRID_MAJOR, GRID_MINOR
} from './utils.js';

const getNLDSYLabel = function(functionChoice, kName, nName) {
    let label = `MP<sub>${nName}</sub>, w`;

    if (functionChoice === 1) {
        label = `MP<sub>${kName}</sub>, r<sub>${kName}</sub>`;
    }

    return label;
};

const getNLDSXLabel = function(functionChoice, kName, nName) {
    let label = nName;

    if (functionChoice === 1) {
        label = kName;
    }

    return label;
};

const calculateBoundingBox = function(xAxisMin, yAxisMin, xAxisMax, yAxisMax) {
    return [
        // Margins depend on graph scale
        xAxisMin - (xAxisMax * 0.014),
        yAxisMax,
        xAxisMax,
        yAxisMin - (yAxisMax * 0.022)
    ];
};

/**
 * The JXGBoard component manages JSXGraph's Board class, which
 * is used to create the graph scene.
 *
 * https://jsxgraph.org/docs/symbols/JXG.Board.html
 */
export default class JXGBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            areaA: 0,
            areaB: 0,
            areaC: 0,
        };

        this.id = this.props.id;
        this.style = {
            // The defaults provided here are used by GraphSelect
            width: this.props.width || 450,
            height: this.props.height || 240
        };

        this.handleAreaUpdate = this.handleAreaUpdate.bind(this);
    }

    visibleTicks = {
        drawLabels: true,
        includeBoundaries: true,
        label: {
            anchorX: 'left',
            anchorY: 'btm',
            offset: [2, 2],
            strokeColor: '#afafaf',
        },
        minorTicks: 1,
        majorHeight: 25,
        minorHeight: 10,
        strokeWidth: 1,
        ticksDistance: 2,
        tickEndings: [1, 1],
    };

    handleAreaUpdate(areaA, areaB, areaC) {
        // Handles area updates for all types of AUC graphs
        this.setState({
            areaA: areaA,
            areaB: areaB,
            areaC: areaC
        });
    }

    renderJXBoard(options) {
        // Don't render JSXGraph in jest. This should be possible since I'm
        // using jsdom, but jsxgraph can't find the element when I try and
        // initialize it like this:
        //
        // const div = document.createElement('div');
        // div.setAttribute('id', 'id-test');
        // ReactDOM.render(
        //     <JXGBoard
        //          id={'id-test'}
        //          gType={0}
        //          gShowIntersection={true} />,
        //     div);
        //
        if (
            typeof process !== 'undefined' &&
                process.env.NODE_ENV === 'test'
        ) {
            return;
        }

        if (this.board) {
            // Remove all the current objects from the board so we can
            // re-render.
            // https://jsxgraph.uni-bayreuth.de/docs/symbols/JXG.Board.html#removeObject
            this.board.suspendUpdate();

            let i;
            for (
                i = this.board.objectsList.length - 1;
                i >= this.board1InitObjects;
                i--
            ) {
                let o = this.board.objectsList[i];
                if (o && o.id) {
                    this.board.removeObject(o.id);
                }
            }

            this.board.unsuspendUpdate();
        }

        if (this.board2) {
            this.board2.suspendUpdate();

            let j;
            for (
                j = this.board2.objectsList.length - 1;
                j >= this.board2InitObjects;
                j--
            ) {
                let o = this.board2.objectsList[j];
                if (o && o.id) {
                    this.board2.removeObject(o.id);
                }
            }

            this.board2.unsuspendUpdate();
        }

        if (typeof options.gType === 'number') {
            let graphParams = {
                gFunctionChoice: options.gType === 14 ?
                    0 : options.gFunctionChoice,
                l1SubmissionOffset: getL1SubmissionOffset(options.submission),
                l2SubmissionOffset: getL2SubmissionOffset(options.submission),
                locked: this.props.locked,
                shadow: this.props.shadow,
                handleAreaUpdate: this.handleAreaUpdate,
                ...options
            };

            if (options.gType !== 1) {
                graphParams = {
                    gCobbDouglasAlpha: options.gCobbDouglasAlpha,
                    gCobbDouglasAlphaInitial: options.gCobbDouglasAlphaInitial,
                    ...graphParams
                };
            }

            // If this is a joint graph, alter the graph type
            // constructor to be that of the top graph we're
            // rendering.
            let graphType = options.gType;
            if (options.gType === 12) {
                // Render a Cobb-Douglas graph
                graphType = 3;
            } else if (options.gType === 13) {
                // Render a Linear Demand-Supply graph
                graphType = 0;
            } else if (options.gType === 14) {
                // Render a Non-Linear Demand-Supply graph
                graphType = 1;
            } else if (options.gType === 24) {
                // Render a Tax Revenue graph
                graphType = 22;
            }

            graphTypes[graphType](this.board, graphParams);

            // On the Cobb-Douglas NLDS joint graph type, also
            // initialize the second board to be a NLDS graph.
            if (options.gType === 12) {
                mkNonLinearDemandSupply(this.board2, {
                    gLine2OffsetX: 0,
                    gLine2OffsetY: 0,
                    gLine2OffsetXInitial: 0,
                    gLine2OffsetYInitial: 0,
                    l1SubmissionOffset: getL1SubmissionOffset(options.submission),
                    l2SubmissionOffset: getL2SubmissionOffset(options.submission),
                    locked: this.props.locked,
                    shadow: this.props.shadow,
                    ...options
                });
            } else if (options.gType === 13) {
                // LDS Horizontal Joint graph, right-side graph
                // Can't handle the spread operator for some reason
                mkDemandSupply(this.board2, {
                    isBoard2: true,
                    gType: options.gType,
                    gShowIntersection: options.gShowIntersection,
                    gDisplayIntersection1: options.gDisplayIntersection1,
                    gDisplayIntersection1Initial: options.gDisplayIntersection1Initial,

                    gDisplayShadow: options.gDisplayShadow,

                    gIntersectionLabel: options.gIntersection2Label,
                    gIntersectionHorizLineLabel: options.gIntersection2HorizLineLabel,
                    gIntersectionVertLineLabel: options.gIntersection2VertLineLabel,

                    gXAxisLabel: options.gXAxis2Label,
                    gYAxisLabel: options.gYAxis2Label,
                    gLine1Label: options.gLine3Label,
                    gLine2Label: options.gLine4Label,
                    gLine1Slope: options.gLine3Slope,
                    gLine1SlopeInitial: options.gLine3SlopeInitial,
                    gLine2Slope: options.gLine4Slope,
                    gLine2SlopeInitial: options.gLine4SlopeInitial,

                    gLine1OffsetX: options.gLine3OffsetX,
                    gLine1OffsetY: options.gLine3OffsetY,
                    gLine1OffsetXInitial: options.gLine3OffsetXInitial,
                    gLine1OffsetYInitial: options.gLine3OffsetYInitial,

                    gLine2OffsetX: options.gLine4OffsetX,
                    gLine2OffsetY: options.gLine4OffsetY,
                    gLine2OffsetXInitial: options.gLine4OffsetXInitial,
                    gLine2OffsetYInitial: options.gLine4OffsetYInitial,

                    gNeedsSubmit: options.gNeedsSubmit,
                    l1SubmissionOffset: getL1SubmissionOffset(options.submission),
                    l2SubmissionOffset: getL2SubmissionOffset(options.submission),
                    submission: options.submission,
                    isSubmitted: options.isSubmitted,
                    locked: this.props.locked,
                    shadow: this.props.shadow,
                });
            } else if (options.gType === 14) {
                mkNonLinearDemandSupply(this.board2, {
                    gLine2OffsetX: 0,
                    gLine2OffsetY: 0,
                    gLine2OffsetXInitial: 0,
                    gLine2OffsetYInitial: 0,
                    gFunctionChoice: 1,
                    l1SubmissionOffset: getL1SubmissionOffset(options.submission),
                    l2SubmissionOffset: getL2SubmissionOffset(options.submission),
                    locked: this.props.locked,
                    shadow: this.props.shadow,
                    ...options
                });
            } else if (options.gType === 24) {
                mkTaxationLinearDemandSupply(this.board2, {
                    ...options,
                    gXAxisMax: 1000,
                    gYAxisMax: 2500,
                    gLine1Slope: options.gA2,
                    gLine2Slope: options.gA4,
                    isBoard2: true,
                    l1SubmissionOffset: getL1SubmissionOffset(options.submission),
                    l2SubmissionOffset: getL2SubmissionOffset(options.submission),
                    locked: this.props.locked,
                    shadow: this.props.shadow,
                });
            } else if (options.gType === 32) {
                // International Trade - Large Economy second graph:
                mkInternationalTradeLargeEconomyGlobal(this.board2, {
                    ...options,
                    gXAxisMax: 1000,
                    gYAxisMax: 2500,
                    isBoard2: true,
                    l1SubmissionOffset: getL1SubmissionOffset(options.submission),
                    l2SubmissionOffset: getL2SubmissionOffset(options.submission),
                    locked: this.props.locked,
                    shadow: this.props.shadow,
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        // This is the list of properties that will be available to
        // the graph code within the jsxgraph context, in the graphs/
        // directory. The jsxgraph scene will be re-rendered and
        // therefore up to date whenever any of these properties
        // change.
        const updateProps = [
            'gType', 'gShowIntersection', 'gDisplayIntersection1',
            'gDisplayIntersection1Initial', 'gIntersectionLabel',
            'gDisplayIntersection2', 'gDisplayIntersection2Initial',
            'gIntersection2Label', 'gDisplayIntersection3',
            'gDisplayIntersection3Initial', 'gIntersection3Label',
            'gDisplayShadow', 'gIntersectionHorizLineLabel',
            'gIntersectionVertLineLabel', 'gIntersection2HorizLineLabel',
            'gIntersection2VertLineLabel', 'gIntersection3HorizLineLabel',
            'gIntersection3VertLineLabel', 'gLine1Label', 'gLine2Label',
            'gLine3Label', 'gLine4Label', 'gLine1Slope', 'gLine1Slopeinitial',
            'gLine2Slope', 'gLine3Slope', 'gLine4Slope', 'gLine1OffsetX',
            'gLine1OffsetY', 'gLine1OffsetXInitial', 'gLine1OffsetYInitial',
            'gLine2OffsetX', 'gLine2OffsetY', 'gLine2OffsetXInitial',
            'gLine2OffsetYInitial', 'gLine3OffsetX', 'gLine3OffsetY',
            'gLine3OffsetXInitial', 'gLine3OffsetYInitial', 'gLine4OffsetX',
            'gLine4OffsetY', 'gLine4OffsetXInitial', 'gLine4OffsetYInitial',
            'gLine1Dashed', 'gLine2Dashed', 'gLine3Dashed',

            'gA1', 'gA1Initial', 'gA1Name',
            'gA2', 'gA2Initial', 'gA2Name',
            'gA3', 'gA3Initial', 'gA3Name',
            'gA4', 'gA4Initial', 'gA4Name',
            'gA5', 'gA5Initial', 'gA5Name',
            'gA6', 'gA7', 'gA8',

            'gA', 'gK', 'gR', 'gY1', 'gY2',
            'gCobbDouglasA', 'gCobbDouglasAInitial', 'gCobbDouglasAName',
            'gCobbDouglasL', 'gCobbDouglasLInitial', 'gCobbDouglasLName',
            'gCobbDouglasK', 'gCobbDouglasKInitial', 'gCobbDouglasKName',
            'gCobbDouglasAlpha', 'gCobbDouglasAlphaInitial', 'gNName',
            'gFunctionChoice', 'gToggle', 'gAreaConfiguration',
            'gAreaConfigurationInitial', 'gIsAreaDisplayed', 'gAreaAName',
            'gAreaBName', 'gAreaCName',
            'gExpression',
            'gExpression2',
            'gExpression3',
            'gNeedsSubmit', 'submission',
            'shadow',
            'gXAxisMax', 'gXAxisMin', 'gYAxisMax', 'gYAxisMin',
            'gMajorGridType', 'gMinorGridType'
        ];
        let needsUpdate = false;
        for (let i = 0; i < updateProps.length; i++) {
            let prop = updateProps[i];
            if (this.props[prop] !== prevProps[prop]) {
                needsUpdate = true;
                break;
            }
        }

        if (needsUpdate) {
            let boundingBox = calculateBoundingBox(
                this.props.gXAxisMin, this.props.gYAxisMin,
                this.props.gXAxisMax, this.props.gYAxisMax);
            this.board.setBoundingBox(boundingBox);

            if (this.board2) {
                this.board2.update();
            }

            this.renderJXBoard({
                l1SubmissionOffset: getL1SubmissionOffset(this.props.submission),
                l2SubmissionOffset: getL2SubmissionOffset(this.props.submission),
                isSubmitted: !!this.props.submission,
                ...this.props
            });
        }

        if (prevProps.gXAxisLabel !== this.props.gXAxisLabel) {
            if (this.board && this.board.defaultAxes) {
                this.board.defaultAxes.x.name = this.props.gXAxisLabel;
                this.board.update();
            }
            if (
                this.board2 && this.board2.defaultAxes
                    && this.props.gType !== 13
            ) {
                this.board2.defaultAxes.x.name = this.props.gXAxisLabel;
                this.board2.update();
            }
        }

        if (prevProps.gYAxisLabel !== this.props.gYAxisLabel) {
            if (this.board && this.board.defaultAxes) {
                this.board.defaultAxes.y.name = this.props.gYAxisLabel;
                this.board.update();
            }
        }

        if (this.board && (prevProps.gMajorGridType !== this.props.gMajorGridType ||
            prevProps.gMinorGridType !== this.props.gMinorGridType)) {
            this.board.removeGrids();
            this.board.create('grid', [],
                {
                    major: GRID_MAJOR[this.props.gMajorGridType],
                    minor: GRID_MINOR[this.props.gMinorGridType],
                    minorElements: 1,
                });
            this.board.fullUpdate();
        }

        if (this.props.gType === 13) {
            if (
                this.board2 &&
                    prevProps.gXAxis2Label !== this.props.gXAxis2Label
            ) {
                this.board2.defaultAxes.x.name = this.props.gXAxis2Label;
                this.board2.update();
            }
            if (
                this.board2 &&
                    prevProps.gYAxis2Label !== this.props.gYAxis2Label
            ) {
                this.board2.defaultAxes.y.name = this.props.gYAxis2Label;
                this.board2.update();
            }
        }

        if ([1, 10, 12, 14, 24].includes(this.props.gType) && (
            prevProps.gFunctionChoice !== this.props.gFunctionChoice ||
            prevProps.gCobbDouglasKName !== this.props.gCobbDouglasKName ||
            prevProps.gNName !== this.props.gNName
        )
        ) {
            const yLabel = getNLDSYLabel(
                this.props.gType === 14 ? 1 : this.props.gFunctionChoice,
                this.props.gCobbDouglasKName,
                this.props.gNName
            );
            const xLabel = getNLDSXLabel(
                this.props.gType === 14 ? 1 : this.props.gFunctionChoice,
                this.props.gCobbDouglasKName,
                this.props.gNName
            );

            let board;
            if (this.board) {
                board = this.board;
            }

            if (this.board2 && isJointGraph(this.props.gType)) {
                board = this.board2;
            }

            if (board.defaultAxes) {
                board.defaultAxes.y.name = yLabel;
                board.defaultAxes.x.name = xLabel;
                board.update();
            }
        }
    }

    componentDidMount() {
        // Don't render JSXGraph in jest. This should be possible since I'm
        // using jsdom, but jsxgraph can't find the element when I try and
        // initialize it like this:
        //
        // const div = document.createElement('div');
        // div.setAttribute('id', 'id-test');
        // ReactDOM.render(
        //     <JXGBoard
        //          id={'id-test'}
        //          gType={0}
        //          gShowIntersection={true} />,
        //     div);
        //
        if (
            typeof process !== 'undefined' &&
                process.env.NODE_ENV === 'test'
        ) {
            return;
        }

        const options = this.props;

        let xAxisLabel = '';
        let yAxisLabel = '';
        let xTicks = {visible: false};
        let yTicks = {visible: false};
        switch (options.gType) {
            case 1:
            case 10:
                // Non-linear demand-supply
                xAxisLabel = getNLDSXLabel(
                    options.gFunctionChoice,
                    options.gCobbDouglasKName,
                    options.gNName
                );
                yAxisLabel = getNLDSYLabel(
                    options.gFunctionChoice,
                    options.gCobbDouglasKName,
                    options.gNName);

                if (this.props.locked) {
                    options.gCobbDouglasA = 3.4;
                    options.gCobbDouglasK = 2.3;
                    options.gLine2OffsetX = 0.5;
                    options.gLine2OffsetY = -0.8;
                }
                break;
            case 3:
                xAxisLabel = options.gCobbDouglasLName;
                yAxisLabel = options.gYAxisLabel || options.gCobbDouglasYName;
                break;
            case 5:
            case 15:
                // Consumption-Leisure graphs (optimal choice and
                // otherwise)
                if (this.props.locked) {
                    options.gA1 = 4;
                    options.gA2 = 1;
                }
                xAxisLabel = options.gXAxisLabel ? options.gXAxisLabel : 'f';
                yAxisLabel = options.gYAxisLabel ? options.gYAxisLabel : 'c';
                break;
            case 7:
            case 11:
                // Consumption-Saving
                xAxisLabel = 'c_1';
                yAxisLabel = 'c_2';
                if (this.props.locked) {
                    options.gA1 = 4;
                    options.gA2 = 1;
                }
                break;
            case 14:
                // Horizontal NLDS joint graph. Left graph is function
                // choice 0.
                xAxisLabel = getNLDSXLabel(
                    0, options.gCobbDouglasKName, options.gNName);
                yAxisLabel = getNLDSYLabel(
                    0, options.gCobbDouglasKName, options.gNName);
                break;
            case 17:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                break;
            case 18:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                xAxisLabel = options.gXAxisLabel;
                yAxisLabel = options.gYAxisLabel;
                break;
            case 19:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                break;
            case 20:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                xAxisLabel = 'Quantity';
                yAxisLabel = 'Price';
                break;
            case 21:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                xAxisLabel = 'Labor';
                yAxisLabel = 'Capital';
                break;
            case 22:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                xAxisLabel = options.gFunctionChoice === 0 ? 'Unit Tax' : 'Ad Valorem Tax';
                yAxisLabel = 'Tax Revenue';
                break;
            case 23:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                break;
            case 24:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                xAxisLabel = options.gFunctionChoice === 0 ? 'Unit Tax' : 'Ad Valorem Tax';
                yAxisLabel = 'Tax Revenue';
                break;
            case 25:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                break;
            case 26:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                xAxisLabel = 'Firm Output, q';
                break;
            case 28:
            case 27:
            case 29:
            case 30:
            case 31:
            case 32:
                xTicks = this.visibleTicks;
                yTicks = xTicks;
                break;
            default:
                xAxisLabel = options.gXAxisLabel ? options.gXAxisLabel : 'x';
                yAxisLabel = options.gYAxisLabel ? options.gYAxisLabel : 'y';
                break;
        }

        if (!xAxisLabel) {
            xAxisLabel = options.gXAxisLabel ? options.gXAxisLabel : 'x';
        }
        if (!yAxisLabel) {
            yAxisLabel = options.gYAxisLabel ? options.gYAxisLabel : 'y';
        }

        let boundingBox = calculateBoundingBox(
            options.gXAxisMin, options.gYAxisMin,
            options.gXAxisMax, options.gYAxisMax);

        let grid = false;
        if (
            typeof this.props.gMajorGridType !== 'undefined' &&
                typeof this.props.gMinorGridType !== 'undefined'
        ) {
            grid = {
                major: GRID_MAJOR[this.props.gMajorGridType],
                minor: GRID_MINOR[this.props.gMinorGridType],
                minorElements: 1,
                visible: true
            };
        }

        this.board = JXG.JSXGraph.initBoard(
            this.id, {
                axis: true,
                defaultAxes: {
                    x: {
                        name: xAxisLabel,
                        label: {
                            offset: [400, 0]
                        },
                        withLabel: xAxisLabel ? true : false,
                        ticks: xTicks,
                        layer: 9
                    },
                    y: {
                        name: yAxisLabel,
                        label: {
                            offset: [0, 260]
                        },
                        withLabel: yAxisLabel ? true : false,
                        ticks: yTicks,
                        layer: 9
                    }
                },
                grid: grid,
                keepAspectRatio: false,
                showCopyright: false,
                showZoom: false,
                showReload: false,
                showNavigation: false,
                boundingBox: boundingBox
            });
        this.board1InitObjects = this.board.numObjects;

        window.board = this.board;

        let xLabel = '';
        let yLabel = '';

        if (options.gType >= 12 && options.gType <= 14) {
            yLabel = yAxisLabel;
            xLabel = xAxisLabel;
            if (options.gType === 12 || options.gType === 14) {
                yLabel = getNLDSYLabel(
                    options.gType === 14 ? 1 : options.gFunctionChoice,
                    options.gCobbDouglasKName,
                    options.gNName
                );
                xLabel = getNLDSXLabel(
                    options.gType === 14 ? 1 : options.gFunctionChoice,
                    options.gCobbDouglasKName,
                    options.gNName
                );
            } else if (options.gType === 13) {
                xLabel = options.gXAxis2Label;
                yLabel = options.gYAxis2Label;
            }
        }

        if (this.props.gType === 24) {
            boundingBox = calculateBoundingBox(0, 0, 1000, 2500);
        }

        if (isJointGraph(this.props.gType)) {
            this.board2 = JXG.JSXGraph.initBoard(
                this.id + '-2', {
                    axis: true,
                    defaultAxes: {
                        x: {
                            name: xLabel,
                            label: {
                                offset: [400, 0]
                            },
                            withLabel: xLabel ? true : false,
                            ticks: xTicks,
                            layer: 9
                        },
                        y: {
                            name: yLabel,
                            label: {
                                offset: [0, 260]
                            },
                            withLabel: yLabel ? true : false,
                            ticks: yTicks,
                            layer: 9
                        }
                    },
                    keepAspectRatio: false,
                    showCopyright: false,
                    showZoom: false,
                    showReload: false,
                    showNavigation: false,
                    boundingBox: boundingBox
                });

            this.board2InitObjects = this.board2.numObjects;
        }

        this.renderJXBoard({
            l1SubmissionOffset: getL1SubmissionOffset(this.props.submission),
            l2SubmissionOffset: getL2SubmissionOffset(this.props.submission),
            isSubmitted: !!this.props.submission,
            ...this.props
        });
    }

    // The primary HTML structure for JSXGraph
    makeFigure(id, math) {
        return (
            <>
                <figure
                    aria-label="The EconPractice graph."
                    id={id}
                    className="jxgbox"
                    style={this.style}>
                </figure>
                {math}
            </>
        );
    }

    // called only if shouldComponentUpdate returns true
    // for rendering the JSXGraph board div and any child elements
    render() {
        let math1 = null;
        let math2 = null;
        let area = null;

        if (this.props.gType === 9 || this.props.gType === 10) {
            area = <AreaDisplay
                areaConf={this.props.gAreaConfiguration}
                areaA={this.state.areaA}
                areaB={this.state.areaB}
                areaC={this.state.areaC} />;
        } else if ([12, 13, 14, 24, 32].includes(this.props.gType)) {
            if (this.props.gType === 14) {
                const func1 = String.raw`MP_${this.props.gNName} = (1 - \alpha)${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^\alpha ${this.props.gNName}^{-\alpha}`;
                const func2 = String.raw`MP_${this.props.gCobbDouglasKName} = \alpha ${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^{\alpha - 1} ${this.props.gNName}^{1 - \alpha}`;

                math1 = getKatexEl(func1);
                math2 = getKatexEl(func2);
            }
        }

        let legend = null;
        if (this.props.gType === 18) {
            legend = (
                <Legend
                    gLine1Label={this.props.gLine1Label}
                    line1Color={LINE_1_COLOR}
                    gLine2Label={this.props.gLine2Label}
                    line2Color={LINE_2_COLOR}
                    gLine3Label={this.props.gLine3Label}
                    line3Color={LINE_3_COLOR}
                    gLine4Label={this.props.gLine4Label}
                    line4Color={LINE_4_COLOR}
                />
            );
        }

        return (
            <>
                <div className="col-xl-6">
                    {this.makeFigure(this.id, math1)}
                    {isJointGraph(this.props.gType) && (
                        <GraphPane {...this.props} />
                    )}
                    {isJointGraph(this.props.gType) && (
                        this.makeFigure(this.id + '-2', math2)
                    )}
                </div>
                {legend}
                {area}
            </>
        );
    }
}
