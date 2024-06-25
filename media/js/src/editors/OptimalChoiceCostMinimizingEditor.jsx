import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.js';
import { handleFormUpdate } from '../utils.js';

export default class OptimalChoiceCostMinimizingEditor extends React.Component {
    render() {
        return (
            <div>
                {this.props.displaySliders && (
                    <React.Fragment>
                        <RangeEditor
                            itemlabel="w"
                            id="gA1"
                            dataId="gA1"
                            value={this.props.gA1}
                            min={0}
                            max={30}
                            handler={handleFormUpdate.bind(this)} />

                        <RangeEditor
                            itemlabel="r"
                            id="gA2"
                            dataId="gA2"
                            value={this.props.gA2}
                            min={0.01}
                            max={30}
                            handler={handleFormUpdate.bind(this)} />

                        <RangeEditor
                            itemlabel="c"
                            id="gA3"
                            dataId="gA3"
                            value={this.props.gA3}
                            min={0}
                            max={5000}
                            handler={handleFormUpdate.bind(this)} />
                    </React.Fragment>
                )}
            </div >
        );
    }
}

OptimalChoiceCostMinimizingEditor.propTypes = {
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,

    displaySliders: PropTypes.bool.isRequired
};
