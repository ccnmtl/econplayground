import React from 'react';
import PropTypes from 'prop-types';
import { MathJax } from 'better-react-mathjax';
import RangeEditor from '../form-components/RangeEditor.js';
import EditableControl from '../form-components/EditableControl.jsx';
import { handleFormUpdate } from '../utils.js';

export default class OptimalChoiceConsumptionEditor extends React.Component {
    constructor(props) {
        super(props);
        //set initial state
        this.props.updateGraph({gA1: 5, gA2: 10, gA3: 10, gA4: 1, gA5: 1});
    }

    render() {
        const prop = this.props;
        const nStar = function(nu, pn) {
            // n_star = (nu/(alpha+beta)) * R/pn
            return (nu/(prop.gA4+prop.gA5) * prop.gA3/pn).toFixed(4);
        };
        const uStar = function() {
            return ((nStar(prop.gA4, prop.gA1) ** prop.gA4) * (nStar(prop.gA5, prop.gA2) ** prop.gA5)).toFixed(4);
        };
        
        const formulae = [
            String.raw`y_1 
                = (R - p_x)x_1 / p_y = (${prop.gA3} - ${prop.gA1}) * x_1 / ${prop.gA2}`,
            String.raw`x^* 
                = \alpha / (\alpha + \beta) * R / p_x 
                = ${prop.gA4} / (${prop.gA4} + ${prop.gA5}) * ${prop.gA3} / ${prop.gA1} 
                = ${nStar(prop.gA4, prop.gA1)}`,
            String.raw`y^* 
                = \beta / (\alpha + \beta) * R / p_y
                = ${prop.gA5} / (${prop.gA4} + ${prop.gA5}) * ${prop.gA3} / ${prop.gA2} 
                = ${nStar(prop.gA5, prop.gA2)}`,
            String.raw`U^* 
                = (x^*)^\alpha(y^*)^\beta = ${nStar(prop.gA4, prop.gA1)}^${prop.gA4} * ${nStar(prop.gA5, prop.gA2)}^${prop.gA5} = ${uStar()}`,
            String.raw`y_2 
                = (U^*/x_2^\alpha)^{1/\beta}
                = (${uStar()} / x_2^{${prop.gA4}})^{1/${prop.gA5}}`,
        ];

        const renderFormula = function(fx, index) {
            return (
                <div className="row" key={index}>
                    <div className="col-auto">
                        <MathJax>{'$$' + fx + '$$'}</MathJax>
                    </div>
                </div>
            );
        };

        return (
            <div>
                {this.props.isInstructor &&
                    <React.Fragment>
                        <h2>Function</h2>
                        {formulae.map(renderFormula)}
                        <hr />
                    </React.Fragment>
                }

                {this.props.displaySliders && (
                    <React.Fragment>
                        <h2>Slope</h2>
                        <RangeEditor
                            label="p_x"
                            id="gA1"
                            dataId="gA1"
                            value={this.props.gA1}
                            min={0}
                            max={25}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="p_y"
                            id="gA2"
                            dataId="gA2"
                            value={this.props.gA2}
                            min={0}
                            max={25}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="R"
                            id="gA3"
                            dataId="gA3"
                            value={this.props.gA3}
                            min={0}
                            max={25}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="\alpha"
                            id="gA4"
                            dataId="gA4"
                            value={this.props.gA4}
                            min={0}
                            max={2}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            label="\beta"
                            id="gA5"
                            dataId="gA5"
                            value={this.props.gA5}
                            min={0}
                            max={2}
                            handler={handleFormUpdate.bind(this)} />
                        <hr />
                    </React.Fragment>
                )}

                {this.props.displayLabels && (
                    <div className="d-flex flex-wrap">
                        <div className="row">
                            <div className="col">
                                <EditableControl
                                    id="gLine1Label"
                                    name={'Budget line label'}
                                    value={this.props.gLine1Label}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gLine2Label"
                                    name={'Optimal point label'}
                                    value={this.props.gLine2Label}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <EditableControl
                                    id="gXAxisLabel"
                                    name="X-axis label"
                                    value={this.props.gXAxisLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gYAxisLabel"
                                    name="Y-axis label"
                                    value={this.props.gYAxisLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionLabel"
                                    name="Intersection label"
                                    value={this.props.gIntersectionLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionHorizLineLabel"
                                    name="Horizontal intersection label"
                                    value={this.props.gIntersectionHorizLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                            <div className="col">
                                <EditableControl
                                    id="gIntersectionVertLineLabel"
                                    name="Vertical intersection label"
                                    value={this.props.gIntersectionVertLineLabel}
                                    valueEditable={true}
                                    isInstructor={this.props.isInstructor}
                                    updateGraph={this.props.updateGraph}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div >
        );
    }
}

OptimalChoiceConsumptionEditor.propTypes = {
    gType: PropTypes.number.isRequired,
    gIntersectionLabel: PropTypes.string.isRequired,
    gIntersectionHorizLineLabel: PropTypes.string.isRequired,
    gIntersectionVertLineLabel: PropTypes.string.isRequired,

    gXAxisLabel: PropTypes.string.isRequired,
    gYAxisLabel: PropTypes.string.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gA4: PropTypes.number.isRequired,
    gA5: PropTypes.number.isRequired,

    gLine1Label: PropTypes.string.isRequired,
    gLine2Label: PropTypes.string.isRequired,

    displayLabels: PropTypes.bool.isRequired,
    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired
};
