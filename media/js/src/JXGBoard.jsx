/* eslint-env node */

import React from 'react';
import PropTypes from 'prop-types';
import {MathComponent} from 'mathjax-react';
import JXG from 'jsxgraph';
import {graphTypes, mkDemandSupply, mkNonLinearDemandSupply} from './Graph';
import AreaDisplay from './AreaDisplay';
import {getL1SubmissionOffset, getL2SubmissionOffset} from './utils';

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
            // The defaults provided here are used by the GraphPicker
            width: this.props.width || 450,
            height: this.props.height || 240
        };

        this.handleAreaUpdate = this.handleAreaUpdate.bind(this);
    }

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
        if (typeof process !== 'undefined' &&
            process.env.NODE_ENV === 'test'
           ) {
            return;
        }

        if (this.board) {
            // Remove all the current objects from the board so we can
            // re-render.
            // https://jsxgraph.uni-bayreuth.de/docs/symbols/JXG.Board.html#removeObjec
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

            // If this is a joint graph, alter the graph ID constructor
            // to be that of the top graph we're rendering.
            let graphId = options.gType;
            if (options.gType == 12) {
                // Render a Cobb-Douglas graph
                graphId = 3;
            } else if (options.gType === 13) {
                // Render a Linear Demand-Supply graph
                graphId = 0;
            } else if (options.gType === 14) {
                // Render a Non-Linear Demand-Supply graph
                graphId = 1;
            }

            graphTypes[graphId](this.board, graphParams);

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
            }
        }
    }

    componentDidUpdate(prevProps) {
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
            'gLine1Dashed', 'gLine2Dashed', 'gLine3Dashed', 'gAlpha', 'gA1',
            'gA1Initial', 'gA2', 'gA2Initial', 'gA3', 'gA3Initial', 'gA4',
            'gA4Initial', 'gA5', 'gA5Initial', 'gA', 'gK', 'gR', 'gY1', 'gY2',
            'gCobbDouglasA', 'gCobbDouglasAInitial', 'gCobbDouglasAName',
            'gCobbDouglasL', 'gCobbDouglasLInitial', 'gCobbDouglasLName',
            'gCobbDouglasK', 'gCobbDouglasKInitial', 'gCobbDouglasKName',
            'gCobbDouglasAlpha', 'gCobbDouglasAlphaInitial', 'gNName',
            'gFunctionChoice', 'gAreaConfiguration',
            'gAreaConfigurationInitial', 'gIsAreaDisplayed', 'gAreaAName',
            'gAreaBName', 'gAreaCName', 'gNeedsSubmit', 'submission',
            'shadow'
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

        if (this.props.gType === 13) {
            if (this.board2 &&
                prevProps.gXAxis2Label !== this.props.gXAxis2Label
               ) {
                this.board2.defaultAxes.x.name = this.props.gXAxis2Label;
                this.board2.update();
            }
            if (this.board2 &&
                prevProps.gYAxis2Label !== this.props.gYAxis2Label
               ) {
                this.board2.defaultAxes.y.name = this.props.gYAxis2Label;
                this.board2.update();
            }
        }

        if (
            (this.props.gType === 1 ||
             this.props.gType === 10 ||
             this.props.gType === 12 ||
             this.props.gType === 14
            ) && (
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

            if (this.board2 && (
                this.props.gType === 12 || this.props.gType === 14
            )) {
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
        if (typeof process !== 'undefined' &&
            process.env.NODE_ENV === 'test'
           ) {
            return;
        }

        const options = this.props;

        let xAxisLabel = '';
        let yAxisLabel = '';
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
            default:
                xAxisLabel = options.gXAxisLabel ? options.gXAxisLabel : 'x';
                yAxisLabel = options.gYAxisLabel ? options.gYAxisLabel : 'y';
                break;
        }

        this.board = JXG.JSXGraph.initBoard(
            this.id, {
                axis: true,
                defaultAxes: {
                    x: {
                        name: xAxisLabel,
                        label: {
                            offset: [400, -12]
                        },
                        withLabel: xAxisLabel ? true : false,
                        ticks: {
                            visible: false
                        },
                        layer: 9
                    },
                    y: {
                        name: yAxisLabel,
                        label: {
                            offset: [(options.gType === 1) ? 0 : -5, 260]
                        },
                        withLabel: yAxisLabel ? true : false,
                        ticks: {
                            visible: false
                        },
                        layer: 9
                    }
                },
                keepaspectratio: false,
                showCopyright: false,
                showZoom: false,
                showReload: false,
                showNavigation: false,
                boundingbox: [-0.4, 5, 5, -0.4]
            });
        this.board1InitObjects = this.board.numObjects;

        window.board = this.board;

        this.board2 = null;
        if (options.gType >= 12 && options.gType <= 14) {
            let yLabel = yAxisLabel;
            let xLabel = xAxisLabel;
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

            this.board2 = JXG.JSXGraph.initBoard(
                this.id + '-2', {
                    axis: true,
                    defaultAxes: {
                        x: {
                            name: xLabel,
                            label: {
                                offset: [400, -12]
                            },
                            withLabel: xLabel ? true : false,
                            ticks: {
                                visible: false
                            },
                            layer: 9
                        },
                        y: {
                            name: yLabel,
                            label: {
                                offset: [8, 260]
                            },
                            withLabel: yLabel ? true : false,
                            ticks: {
                                visible: false
                            },
                            layer: 9
                        }
                    },
                    keepaspectratio: false,
                    showCopyright: false,
                    showZoom: false,
                    showReload: false,
                    showNavigation: false,
                    boundingbox: [-0.4, 5, 5, -0.4]
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

    // called only if shouldComponentUpdate returns true
    // for rendering the JSXGraph board div and any child elements
    render() {
        if (this.props.gType === 13) {
            return (
                <>
                    <div className="col-6">
                        <figure aria-label="The EconPractice graph."
                                id={this.id} className="jxgbox" style={this.style}>
                        </figure>
                    </div>

                    <div className="col-6">
                        <figure aria-label="The EconPractice graph."
                                id={this.id + '-2'}
                                className="jxgbox"
                                style={this.style}>
                        </figure>
                    </div>
                </>
            );
        } else if (this.props.gType === 14) {
            const func1 = String.raw`MP_${this.props.gNName} = (1 - \alpha)${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^\alpha ${this.props.gNName}^{-\alpha}`;
            const func2 = String.raw`MP_${this.props.gCobbDouglasKName} = \alpha ${this.props.gCobbDouglasAName}${this.props.gCobbDouglasKName}^{\alpha - 1} ${this.props.gNName}^{1 - \alpha}`;
            return (
                <>
                    <div className="col-6">
                        <figure aria-label="The EconPractice graph."
                                id={this.id} className="jxgbox" style={this.style}>
                        </figure>
                        <MathComponent tex={func1} />
                    </div>

                    <div className="col-6">
                        <figure aria-label="The EconPractice graph."
                                id={this.id + '-2'}
                                className="jxgbox"
                                style={this.style}>
                        </figure>
                        <MathComponent tex={func2} />
                    </div>
                </>
            );
        }

        return (
            <>
                <figure aria-label="The EconPractice graph."
                        id={this.id} className="jxgbox" style={this.style}>
                </figure>

                {(this.props.gType === 12) && (
                    <figure aria-label="The EconPractice graph."
                            id={this.id + '-2'}
                            className="jxgbox"
                            style={this.style}>
                    </figure>
                )}

                {(this.props.gType === 9 || this.props.gType === 10) && (
                    <AreaDisplay
                        areaConf={this.props.gAreaConfiguration}
                        areaA={this.state.areaA}
                        areaB={this.state.areaB}
                        areaC={this.state.areaC} />
                )}
            </>
        );
    }
}

JXGBoard.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    submission: PropTypes.object,
    shadow: PropTypes.bool,

    gShowIntersection: PropTypes.bool,
    gDisplayIntersection1: PropTypes.bool,
    gDisplayIntersection1Initial: PropTypes.bool,
    gIntersectionLabel: PropTypes.string,
    gDisplayIntersection2: PropTypes.bool,
    gDisplayIntersection2Initial: PropTypes.bool,
    gIntersection2Label: PropTypes.string,
    gDisplayIntersection3: PropTypes.bool,
    gDisplayIntersection3Initial: PropTypes.bool,
    gIntersection3Label: PropTypes.string,

    gDisplayShadow: PropTypes.bool,
    gIntersectionHorizLineLabel: PropTypes.string,
    gIntersectionVertLineLabel: PropTypes.string,
    gIntersection2HorizLineLabel: PropTypes.string,
    gIntersection2VertLineLabel: PropTypes.string,
    gIntersection3HorizLineLabel: PropTypes.string,
    gIntersection3VertLineLabel: PropTypes.string,
    gLine1Label: PropTypes.string,
    gLine2Label: PropTypes.string,
    gLine3Label: PropTypes.string,
    gLine4Label: PropTypes.string,
    gXAxisLabel: PropTypes.string,
    gYAxisLabel: PropTypes.string,
    gXAxis2Label: PropTypes.string,
    gYAxis2Label: PropTypes.string,
    gLine1Slope: PropTypes.number,
    gLine1SlopeInitial: PropTypes.number,
    gLine2Slope: PropTypes.number,
    gLine2SlopeInitial: PropTypes.number,
    gLine3Slope: PropTypes.number,
    gLine3SlopeInitial: PropTypes.number,
    gLine4Slope: PropTypes.number,
    gLine4SlopeInitial: PropTypes.number,
    gLine1OffsetX: PropTypes.number,
    gLine1OffsetY: PropTypes.number,
    gLine1OffsetXInitial: PropTypes.number,
    gLine1OffsetYInitial: PropTypes.number,
    gLine2OffsetX: PropTypes.number,
    gLine2OffsetY: PropTypes.number,
    gLine2OffsetXInitial: PropTypes.number,
    gLine2OffsetYInitial: PropTypes.number,
    gLine3OffsetX: PropTypes.number,
    gLine3OffsetY: PropTypes.number,
    gLine3OffsetXInitial: PropTypes.number,
    gLine3OffsetYInitial: PropTypes.number,
    gLine4OffsetX: PropTypes.number,
    gLine4OffsetY: PropTypes.number,
    gLine4OffsetXInitial: PropTypes.number,
    gLine4OffsetYInitial: PropTypes.number,
    gLine1Dashed: PropTypes.bool,
    gLine2Dashed: PropTypes.bool,
    gLine3Dashed: PropTypes.bool,

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
    gNeedsSubmit: PropTypes.bool,
    gType: PropTypes.number,

    gCobbDouglasA: PropTypes.number,
    gCobbDouglasAInitial: PropTypes.number,
    gCobbDouglasAName: PropTypes.string,
    gCobbDouglasL: PropTypes.number,
    gCobbDouglasLInitial: PropTypes.number,
    gCobbDouglasLName: PropTypes.string,
    gCobbDouglasK: PropTypes.number,
    gCobbDouglasKInitial: PropTypes.number,
    gCobbDouglasKName: PropTypes.string,
    gCobbDouglasYName: PropTypes.string,
    gCobbDouglasAlpha: PropTypes.number,
    gCobbDouglasAlphaInitial: PropTypes.number,

    gNName: PropTypes.string,

    gFunctionChoice: PropTypes.number,

    gAreaConfiguration: PropTypes.number,
    gAreaConfigurationInitial: PropTypes.number,
    gIsAreaDisplayed: PropTypes.bool,
    gAreaAName: PropTypes.string,
    gAreaBName: PropTypes.string,
    gAreaCName: PropTypes.string,

    id: PropTypes.string.isRequired,
    locked: PropTypes.bool
};
