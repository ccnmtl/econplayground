import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.js';
import { handleFormUpdate } from '../utils.js';
import { MathJax } from 'better-react-mathjax';

export default class CostFunctionsTotalEditor extends React.Component {
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
                {this.props.displaySliders && (
                    <React.Fragment>
                        <RangeEditor
                            itemlabel="a"
                            id="gA1"
                            dataId="gA1"
                            value={this.props.gA1}
                            min={0}
                            max={4000}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            itemlabel="b"
                            id="gA2"
                            dataId="gA2"
                            value={this.props.gA2}
                            min={0}
                            max={1}
                            handler={handleFormUpdate.bind(this)} />
                        <RangeEditor
                            itemlabel="c"
                            id="gA3"
                            dataId="gA3"
                            value={this.props.gA3}
                            min={0}
                            max={1}
                            handler={handleFormUpdate.bind(this)} />

                    </React.Fragment>
                )}
            </div >
        );
    }
}

CostFunctionsTotalEditor.propTypes = {
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,

    displaySliders: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,

    updateGraph: PropTypes.func.isRequired
};
