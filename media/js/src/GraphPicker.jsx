import React from 'react';
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
                <a
                    className="card"
                    href={location.pathname + n}
                    title={displayGraphType(n)}>
                    <div className="card-img-top">
                        <img className="img-fluid" alt="" src={this.mediaPrefix + imgname} />
                    </div>
                    <div className="card-body">
                        <h2 className="card-title">
                            {isBeta && (
                                <span className="badge text-bg-warning me-2">
                                    Beta
                                </span>
                            )}
                            {displayGraphType(n)}
                        </h2>
                    </div>
                </a>
            </div>
        );
    }

    render() {
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

            [16, 'template_graph.png', true],
            [17, 'consumption_leisure_optimal.png', true],
            [18, 'cost_functions_total.png', true],
            [19, 'cost_functions_total.png', true],
        ];

        return (
            <div className="GraphPicker container">
                <h1>Create a Graph</h1>
                <p className="lead mb-4">Build illustrations or assignments for EconPractice assessment (local) or CourseWorks assessment (LTI).</p>
                <div className="row row-cols-3 g-4">
                    <div className="col">
                        <a
                            className="card"
                            href={location.pathname + '0'}
                            title="Linear Demand and Supply">
                            <div className="card-img-top">
                                <img className="img-fluid" alt="" src={this.mediaPrefix + 'linear_demand_supply.png'} />
                            </div>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {displayGraphType(0)}
                                </h2>
                            </div>
                        </a>
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
