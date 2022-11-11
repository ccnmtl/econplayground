import React from 'react';
import PropTypes from 'prop-types';

export default class ResetGraphButton extends React.Component {
    render() {
        return (
            <button className="btn btn-secondary btn-sm"
                    onClick={this.onClick.bind(this)}>
                Reset Graph
            </button>
        );
    }
    onClick(evt) {
        evt.preventDefault();
        this.props.updateGraph(this.props.initialState);
    }
}

ResetGraphButton.propTypes = {
    initialState: PropTypes.object.isRequired,
    updateGraph: PropTypes.func.isRequired
};
