import React from 'react';
import RangeEditor from '../form-components/RangeEditor.jsx';
import DefineRange from '../form-components/DefineRange.jsx';
import { handleFormUpdate } from '../utils.js';


export default class TaxRevenueEditor extends React.Component {
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

                {this.props.isInstructor && this.props.gType !== 24 && (
                    <div className="row">
                        {[ // [dataId, label]
                            ['gXAxis', 'X Axis'],
                            ['gYAxis', 'Y Axis'],
                        ].map((i, key) => {
                            return (
                                <DefineRange
                                    key={key}
                                    className="col-6"
                                    id={i[0]}
                                    label={i[1]}
                                    rawLabel={true}
                                    min={this.props[i[0] + 'Min']}
                                    max={this.props[i[0] + 'Max']}
                                    handler={handleFormUpdate.bind(this)}/>
                            );
                        })}
                    </div>
                )}
                {this.props.displaySliders && (
                    <React.Fragment>
                        {[ // [dataId, label]
                            ['gA1', 'Choke Price'],
                            ['gA2', 'Demand Slope'],
                            ['gA3', 'Reservation Price'],
                            ['gA4', 'Supply Slope'],
                        ].map((i, key) => {
                            return (
                                <RangeEditor
                                    key={key}
                                    label={i[1]}
                                    rawLabel={true}
                                    id={i[0]}
                                    value={this.props[i[0]]}
                                    min={this.props[i[0] + 'Min']}
                                    max={this.props[i[0] + 'Max']}
                                    showMinMaxEditor={true}
                                    handler={handleFormUpdate.bind(this)}
                                />
                            );
                        })}
                        {this.props.gType === 24 && (
                            <RangeEditor
                                className="col-6"
                                label={
                                    this.props.gFunctionChoice === 0 ?
                                        'Unit Tax' : 'Ad Valorem Tax'}
                                rawLabel={true}
                                id="gA5"
                                value={this.props['gA5']}
                                min={this.props['gA5Min']}
                                max={this.props['gA5Max']}
                                showMinMaxEditor={true}
                                handler={handleFormUpdate.bind(this)}/>
                        )}
                    </React.Fragment>
                )}
            </div >
        );
    }
}
