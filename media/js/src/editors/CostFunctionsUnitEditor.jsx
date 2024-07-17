import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.js';
import DefineRange from '../form-components/DefineRange.jsx';
import { handleFormUpdate } from '../utils.js';
import { MathJax } from 'better-react-mathjax';
import GridOption from '../form-components/GridOption.jsx';


export default class CostFunctionsUnitEditor extends React.Component {
    render() {
        return (
            <div>
                <h2>Function</h2>
                <div className="col">
                    <MathJax>
                        {`$$Cost=a+bx+cx^2=
                            ${this.props.gA1}+
                            ${this.props.gA2}x+
                            ${this.props.gA3}x^2$$`}
                    </MathJax>
                    <MathJax>
                        {`$$F_{cost}=a=${this.props.gA1}$$`}
                    </MathJax>
                    <MathJax>
                        {'$$V_{cost}=Cost - F_{cost}$$'}
                    </MathJax>
                </div>
                <hr />
                <div className="row">
                    {[
                        ['gMajorGridType', 'major'],
                        ['gMinorGridType', 'minor']
                    ].map((item, key) => {
                        return (
                            <GridOption
                                key={key}
                                id={item[0]}
                                label={item[1]}
                                dataId={item[1]}
                                handler={handleFormUpdate.bind(this)}
                                value={this.props[item[0]]}/>
                        );
                    })}
                </div>
                {this.props.isInstructor && this.props.isEditing && (
                    <div className="row">
                        {[ // [dataId, label]
                            ['gXAxis', '\\text{x-axis}'],
                            ['gYAxis', '\\text{y-axis}'],
                            ['gA1', 'a'],
                            ['gA2', 'b'],
                            ['gA3', 'c']
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
                        {[ // [dataId, label]
                            ['gA1', 'a'],
                            ['gA2', 'b'],
                            ['gA3', 'c'],
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

CostFunctionsUnitEditor.propTypes = {
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
    gXAxisMax: PropTypes.number.isRequired,
    gXAxisMin: PropTypes.number.isRequired,
    gYAxisMax: PropTypes.number.isRequired,
    gYAxisMin: PropTypes.number.isRequired,
    gMajorGridType: PropTypes.number.isRequired,
    gMinorGridType: PropTypes.number.isRequired,

    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
};
