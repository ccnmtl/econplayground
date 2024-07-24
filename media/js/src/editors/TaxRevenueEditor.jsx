import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.jsx';
import DefineRange from '../form-components/DefineRange.jsx';
import { handleFormUpdate } from '../utils.js';


export default class TaxRevenueEditor extends React.Component {
    componentDidMount() {
        if (!this.props.gId) {
            this.props.updateGraph({
                ...this.props,
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
                gYAxisMin: 0,
            });
        }
    }

    render() {
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
                                    id={i[0]}
                                    label={i[1]}
                                    rawLabel={true}
                                    dataId={i[0]}
                                    min={this.props[i[0] + 'Min']}
                                    max={this.props[i[0] + 'Max']}
                                    handler={handleFormUpdate.bind(this)}/>
                            );
                        })}
                    </div>
                )}
                {this.props.displaySliders && (
                    <React.Fragment>
                        {[
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
                                    id={i[0]}
                                    dataId={i[0]}
                                    value={this.props[i[0]]}
                                    min={this.props[i[0] + 'Min']}
                                    max={this.props[i[0] + 'Max']}
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
    gFunctionChoice: PropTypes.number.isRequired,

    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired,
};
