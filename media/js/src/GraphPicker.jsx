import React from 'react';
import PropTypes from 'prop-types';
import { displayGraphType } from './utils.js';

export default class GraphPicker extends React.Component {
    constructor(props) {
        super(props);
        this.mediaPrefix = 'https://ccnmtl-econplayground-static-prod.s3.' +
            'amazonaws.com/media/img/';

        this.renderGraphOption = this.renderGraphOption.bind(this);
        this.b1 = React.createRef();
    }

    renderGraphOption(n, imgname, isBeta, idx) {
        return (
            <div className="col" key={idx}>
                <div
                    className="card"
                    title={displayGraphType(n)}
                    onClick={() => this.props.onSelectGraph(n)}>
                    <div className="card-img-top">
                        <a href="#" onClick={() => this.props.onSelectGraph(n)}>
                            <img className="img-fluid" alt="" src={this.mediaPrefix + imgname} />
                        </a>
                    </div>
                    <div className="card-body">
                        <h2 className="card-title">
                            {isBeta && (
                                <span className="badge text-bg-warning me-2">
                                    Beta
                                </span>
                            )}
                            <a href="#" onClick={() => this.props.onSelectGraph(n)}>
                                {displayGraphType(n)}
                            </a>
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (!this.props.showing) {
            return null;
        }

        const me = this;
        const graphs = [
            [8, 'ADAS.png', false],
            [9, 'linear_demand_supply_area.png', true],
            [13, 'linear_demand_supply_2.png', true],

            [3, 'cobb_douglas.png', false],
            [1, 'non-linear_demand_supply.png', false],
            [10, 'non-linear_demand_supply_area.png', true],
            [14, 'non-linear_demand_supply.png', true],

            [12, 'cobb_douglas.png', true],

            [5, 'consumption_leisure.png', false],
            [15, 'consumption_leisure_optimal.png', true],

            [7, 'consumption_saving.png', false],
            [11, 'consumption_saving_optimal.png', true],
        ];

        return (
            <div className="GraphPicker container">
                <h1>Create a Graph</h1>
                <p className="lead mb-4">Build illustrations or assignments for EconPractice assessment (local) or CourseWorks assessment (LTI).</p>
                <div className="row row-cols-3 g-4">
                    <div className="col">
                        <div
                            className="card"
                            title="Linear Demand and Supply"
                            ref={this.b1}>
                            <div className="card-img-top">
                                <a href="#" onClick={() => this.props.onSelectGraph(0)}>
                                    <img alt="" className="img-fluid" src={this.mediaPrefix + 'linear_demand_supply.png'} />
                                </a>
                            </div>
                            <div className="card-body">
                                <h2 className="card-title">
                                    <a href="#" onClick={() => this.props.onSelectGraph(0)}>
                                        {displayGraphType(0)}
                                    </a>
                                </h2>
                            </div>
                        </div>
                    </div>

                    {
                        graphs.map(function (g, idx) {
                            return me.renderGraphOption(
                                g[0], g[1], g[2], idx);
                        })
                    }
                </div>
            </div>
        );
    }
}

GraphPicker.propTypes = {
    onSelectGraph: PropTypes.func.isRequired,
    showing: PropTypes.bool.isRequired
};
