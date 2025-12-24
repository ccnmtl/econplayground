import React from 'react';

export default class ResetGraphButton extends React.Component {
    render() {
        return (
            <button
                className="btn btn-secondary btn-sm"
                type="reset"
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
