import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.jsx';
import DefineRange from '../form-components/DefineRange.jsx';
import { handleFormUpdate } from '../utils.js';
import { getKatexEl } from '../katexUtils.jsx';


export default class RevenueElasticityEditor extends React.Component {
    render() {
        let paramList = [
            ['gA1', 'b'],
            ['gA2', 'c'],
            ['gA3', 'p'],
        ];
        if (this.props.gFunctionChoice === 2) {
            paramList = [
                ['gA1', 'a'],
                ['gA2', 'p'],
            ];
        }
        return (
            <div>
                <h3>Function</h3>
                <ul className="col">
                    {[ 
                        `y_1
                            =(-1/b)x+c
                            =-x / ${this.props.gA1} +
                            ${this.props.gA2}`,
                        `y_2
                            =cx-x^2/b
                            =${this.props.gA2}x-x^2/${this.props.gA1}`,
                        `y_3
                            =x / a
                            =x / ${this.props.gA1}`
                    ].map((i, key) => {
                        return (
                            <li key={key} className='form-check'>
                                <label htmlFor={`formula-${key}`}
                                    className='form-check-label'
                                >
                                    {getKatexEl(i)}
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

                {this.props.isInstructor && (
                    <div className="row">
                        {[ // [dataId, label]
                            ['gXAxis', '\\text{x-axis}'],
                            ['gYAxis', '\\text{y-axis}'],
                            ['gA1', 'b'],
                            ['gA2', 'c'],
                            ['gA3', 'p'],
                            ['gA4', 'q']
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
                        { paramList.map((i, key) => {
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

RevenueElasticityEditor.propTypes = {
    gType: PropTypes.number.isRequired,
    
    gA1: PropTypes.number.isRequired,
    gA1Max: PropTypes.number.isRequired,
    gA1Min: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA2Max: PropTypes.number.isRequired,
    gA2Min: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gA3Max: PropTypes.number.isRequired,
    gA3Min: PropTypes.number.isRequired,
    gDisplayShadow: PropTypes.bool.isRequired,
    gXAxisMax: PropTypes.number.isRequired,
    gXAxisMin: PropTypes.number.isRequired,
    gYAxisMax: PropTypes.number.isRequired,
    gYAxisMin: PropTypes.number.isRequired,
    gFunctionChoice: PropTypes.number.isRequired,

    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired,
};
