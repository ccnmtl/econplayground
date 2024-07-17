import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.js';
import DefineRange from '../form-components/DefineRange.jsx';
import { handleFormUpdate } from '../utils.js';
import { MathJax } from 'better-react-mathjax';


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
                <h2>Function</h2>
                <ul className="col">
                    {[
                        [
                            '$$Unit\\ Tax$$'
                        ],
                        [
                            '$$Ad\\ Valorem\\ Tax$$'
                        ]
                    ].map((formula, key) => {
                        return (
                            <li key={key} className='form-check'>
                                <label htmlFor={`formula-${key}`}
                                    className='form-check-label'
                                >
                                    {formula.map((i, key) => {
                                        return (
                                            <MathJax key={key}>
                                                {i}
                                            </MathJax>
                                        );
                                    })}
                                </label>
                                <input type="radio" id={`formula-${key}`}
                                    className='form-check-input'
                                    value={key} name="gFunctionChoice"
                                    checked={this.props.gFunctionChoice === key} 
                                    onChange={handleFormUpdate.bind(this)} />
                            </li>
                        );
                    })}
                </ul>
                <hr />
                {this.props.isInstructor && (
                    <div className="row">
                        {[ // [dataId, label]
                            ['gXAxis', 'X\\ Axis'],
                            ['gYAxis', 'Y\\ Axis'],
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
                            ['gA1', 'Reservation\\ Price'],
                            ['gA2', 'Demand\\ Slope'],
                            ['gA3', 'Choke\\ Price'],
                            ['gA4', 'Supply\\ Slope'],
                        ].map((i, key) => {
                            return (
                                <RangeEditor
                                    key={key}
                                    label={i[1]}
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
