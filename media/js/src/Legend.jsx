import React, { Component } from 'react';
import PropTypes from 'prop-types';

const displayColor = function(label, color, idx) {
    return (
        <span className="me-2" key={idx}>
            {label}: <i style={{color: color}} className="bi bi-circle-fill"></i>
        </span>
    );
};

export default class Legend extends Component {
    static propTypes = {
        gLine1Label: PropTypes.string,
        line1Color: PropTypes.string,

        gLine2Label: PropTypes.string,
        line2Color: PropTypes.string,

        gLine3Label: PropTypes.string,
        line3Color: PropTypes.string,

        gLine4Label: PropTypes.string,
        line4Color: PropTypes.string
    };

    render() {
        const elements = [];

        if (this.props.gLine1Label && this.props.line1Color) {
            elements.push(
                displayColor(this.props.gLine1Label, this.props.line1Color, 1)
            );
        }

        if (this.props.gLine2Label && this.props.line2Color) {
            elements.push(
                displayColor(this.props.gLine2Label, this.props.line2Color, 2)
            );
        }

        if (this.props.gLine3Label && this.props.line3Color) {
            elements.push(
                displayColor(this.props.gLine3Label, this.props.line3Color, 3)
            );
        }

        if (this.props.gLine4Label && this.props.line4Color) {
            elements.push(
                displayColor(this.props.gLine4Label, this.props.line4Color, 4)
            );
        }

        return elements;
    }
}
