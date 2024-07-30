import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.jsx';
import DefineRange from '../form-components/DefineRange.jsx';
import { handleFormUpdate } from '../utils.js';


export default class TaxRevenueEditor extends React.Component {
    componentDidMount() {
        if (!this.props.gId) {
            this.default1 = {
                gA1: 100,
                gA1Max: 10000,
                gA1Min: 0,
                gA2: 2,
                gA2Max: 35,
                gA2Min: 0.1,
                gA3: 1500,
                gA3Max: 10000,
                gA3Min: 0,
                gA4: 2,
                gA4Max: 35,
                gA4Min: 0.1,
                gXAxisMax: 1500,
                gXAxisMin: 0,
                gYAxisMax: 500000,
                gYAxisMin: 0
            };
            this.default2 = {
                gA12: 100,
                gA1Max2: 10000,
                gA1Min2: 0,
                gA22: 2,
                gA2Max2: 35,
                gA2Min2: 0.1,
                gA32: 650,
                gA3Max2: 10000,
                gA3Min2: 0,
                gA42: 6,
                gA4Max2: 35,
                gA4Min2: 0.1,
                gXAxisMax2: 6,
                gXAxisMin2: 0,
                gYAxisMax2: 25000,
                gYAxisMin2: 0,
            };
            this.props.updateGraph({
                ...this.props,
                ...this.default1,
                ...this.default2
            });
        }
    }

    handleReset = (e) => {
        e.preventDefault();
        if (this.props.gFunctionChoice === 0) {
            this.props.updateGraph({
                ...this.props,
                ...this.default1
            });
        } else {
            this.props.updateGraph({
                ...this.props,
                ...this.default2
            });
        }
    };

    render() {
        const eqNum = this.props.gFunctionChoice > 0
            ? this.props.gFunctionChoice + 1
            : '';
        return (
            <div>

                <div className="form-check form-check-inline">
                    <input
                        type="radio" id="functionChoice-0"
                        className="form-check-input"
                        value={0}
                        name="gFunctionChoice"
                        checked={this.props.gFunctionChoice === 0}
                        onChange={handleFormUpdate.bind(this)} />
                    <label className="form-check-label" htmlFor="functionChoice-0">
                        Unit Tax
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="radio" id="functionChoice-1"
                        className="form-check-input"
                        value={1}
                        name="gFunctionChoice"
                        checked={this.props.gFunctionChoice === 1}
                        onChange={handleFormUpdate.bind(this)} />
                    <label className="form-check-label" htmlFor="functionChoice-1">
                        Ad Valorem Tax
                    </label>
                </div>
                {this.default1 && (
                    <button
                        id="resetFunctionValues"
                        className="btn btn-primary mb-2"
                        onClick={this.handleReset}>
                            Reset
                    </button>
                )}

                {this.props.isInstructor && (
                    <div className="row">
                        {[ // [dataId, label]
                            ['gXAxis', 'X Axis'],
                            ['gYAxis', 'Y Axis'],
                            ['gA1', 'Reserv.'],
                            ['gA2', 'Demand'],
                            ['gA3', 'Choke'],
                            ['gA4', 'Supply']
                        ].map((i, key) => {
                            return (
                                <DefineRange
                                    key={key}
                                    className="col-6"
                                    eqNum={eqNum}
                                    id={i[0]}
                                    label={i[1]}
                                    rawLabel={true}
                                    dataId={i[0]}
                                    min={this.props[i[0] + 'Min' + eqNum]}
                                    max={this.props[i[0] + 'Max' + eqNum]}
                                    handler={handleFormUpdate.bind(this)}/>
                            );
                        })}
                    </div>
                )}
                {this.props.displaySliders && (
                    <React.Fragment>
                        {[ // [dataId, label]
                            ['gA1', 'Reservation Price'],
                            ['gA2', 'Demand Slope'],
                            ['gA3', 'Choke Price'],
                            ['gA4', 'Supply Slope'],
                        ].map((i, key) => {
                            return (
                                <RangeEditor
                                    key={key}
                                    label={i[1]}
                                    rawLabel={true}
                                    id={i[0] + eqNum}
                                    dataId={i[0] + eqNum}
                                    value={this.props[i[0]+ eqNum]}
                                    min={this.props[i[0] + 'Min' + eqNum]}
                                    max={this.props[i[0] + 'Max' + eqNum]}
                                    handler={handleFormUpdate.bind(this)}
                                />
                            );
                        })}
                    </React.Fragment>
                )}
            </div >
        );
    }
}

TaxRevenueEditor.propTypes = {
    gId: PropTypes.number,
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number,
    gA1Max: PropTypes.number,
    gA1Min: PropTypes.number,
    gA2: PropTypes.number,
    gA2Max: PropTypes.number,
    gA2Min: PropTypes.number,
    gA3: PropTypes.number,
    gA3Max: PropTypes.number,
    gA3Min: PropTypes.number,
    gA4: PropTypes.number,
    gA4Max: PropTypes.number,
    gA4Min: PropTypes.number,
    gDisplayShadow: PropTypes.bool.isRequired,
    gXAxisMax: PropTypes.number,
    gXAxisMin: PropTypes.number,
    gYAxisMax: PropTypes.number,
    gYAxisMin: PropTypes.number,

    gA12: PropTypes.number,
    gA1Max2: PropTypes.number,
    gA1Min2: PropTypes.number,
    gA22: PropTypes.number,
    gA2Max2: PropTypes.number,
    gA2Min2: PropTypes.number,
    gA32: PropTypes.number,
    gA3Max2: PropTypes.number,
    gA3Min2: PropTypes.number,
    gA42: PropTypes.number,
    gA4Max2: PropTypes.number,
    gA4Min2: PropTypes.number,
    gXAxisMax2: PropTypes.number,
    gXAxisMin2: PropTypes.number,
    gYAxisMax2: PropTypes.number,
    gYAxisMin2: PropTypes.number,
    
    gFunctionChoice: PropTypes.number.isRequired,

    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired,
};
