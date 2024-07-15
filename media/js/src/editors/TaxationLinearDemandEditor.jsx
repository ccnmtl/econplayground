import React from 'react';
import PropTypes from 'prop-types';
import RangeEditor from '../form-components/RangeEditor.js';
import { handleFormUpdate } from '../utils.js';

export default class TaxationLinearDemandEditor extends React.Component {
    render() {
        return (
            <>
                <RangeEditor
                    itemlabel="Choke Price"
                    rawItemLabel={true}
                    id="gA1"
                    dataId="gA1"
                    value={this.props.gA1}
                    min={0}
                    max={10000}
                    handler={handleFormUpdate.bind(this)} />

                <RangeEditor
                    itemlabel="Demand Slope"
                    rawItemLabel={true}
                    id="gLine1Slope"
                    dataId="gLine1Slope"
                    value={this.props.gLine1Slope}
                    min={0.01}
                    max={35}
                    handler={handleFormUpdate.bind(this)} />

                <RangeEditor
                    itemlabel="Reservation Price"
                    rawItemLabel={true}
                    id="gA2"
                    dataId="gA2"
                    value={this.props.gA2}
                    min={0}
                    max={10000}
                    handler={handleFormUpdate.bind(this)} />

                <RangeEditor
                    itemlabel="Supply Slope"
                    rawItemLabel={true}
                    id="gLine2Slope"
                    dataId="gLine2Slope"
                    value={this.props.gLine2Slope}
                    min={-35}
                    max={-0.01}
                    handler={handleFormUpdate.bind(this)} />
                <RangeEditor
                    itemlabel="Unit Tax"
                    rawItemLabel={true}
                    id="gA3"
                    dataId="gA3"
                    value={this.props.gA3}
                    min={0}
                    max={1500}
                    handler={handleFormUpdate.bind(this)} />
            </>
        );
    }
}

TaxationLinearDemandEditor.propTypes = {
    gType: PropTypes.number.isRequired,

    gA1: PropTypes.number.isRequired,
    gA2: PropTypes.number.isRequired,
    gA3: PropTypes.number.isRequired,
    gLine1Slope: PropTypes.number.isRequired,
    gLine2Slope: PropTypes.number.isRequired
};
