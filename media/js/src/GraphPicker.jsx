import React from 'react';
import PropTypes from 'prop-types';
import { displayGraphType } from './utils';

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
            <a href="#" className="card" key={idx}
                title={displayGraphType(n)}
                onClick={() => this.props.onSelectGraph(n)}>
                <div className="card-img-top">
                    <img className="img-fluid" alt="" src={this.mediaPrefix + imgname} />
                </div>
                <h2 className="card-title ml-4 mb-4 mr-4">
                    {isBeta && (
                        <span className="badge badge-warning mr-2">
                            Beta
                        </span>
                    )}
                    {displayGraphType(n)}
                </h2>
            </a>
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
                <div className="card-deck">
                    <a href="#" className="card"
                        title="Linear Demand and Supply"
                        ref={this.b1}
                        onClick={() => this.props.onSelectGraph(0)}>
                        <div className="card-img-top">
                            <img alt="" className="img-fluid" src={this.mediaPrefix + 'linear_demand_supply.png'} />
                        </div>
                        <h2 className="card-title ml-4 mb-4 mr-4">
                            {displayGraphType(0)}
                        </h2>
                    </a>

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
