import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.js';
import DefineRange from '../form-components/DefineRange.jsx';
import { handleFormUpdate } from '../utils.js';


export default class CostFunctionsUnitEditor extends React.Component {
    render() {
        return (
            <div>
                {this.props.isInstructor && this.props.isEditing && (
                    <div className="row">
                        {[ // [dataId, label, noMin?]
                            ['gXAxis', '\\text{x-axis}', true],
                            ['gYAxis', '\\text{y-axis}', true],
                            ['gA1', 'a', false],
                            ['gA2', 'b', false],
                            ['gA3', 'c', false]
                        ].map((i, key) => {
                            return (
                                <DefineRange
                                    key={key}
                                    className="col-6"
                                    id={i[0]}
                                    itemlabel={i[1]}
                                    dataId={i[0]}
                                    min={i[2] ? this.props[i[0] + 'Min'] : 0}
                                    max={this.props[i[0] + 'Max']}
                                    handler={handleFormUpdate.bind(this)}
                                    noMin={i[2]}/>
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
                                    itemlabel={i[1]}
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
    gYAxisMax: PropTypes.number.isRequired,

    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
};
