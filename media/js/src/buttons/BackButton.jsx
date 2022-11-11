import React from 'react';
import PropTypes from 'prop-types';

export default class BackButton extends React.Component {
    render() {
        if (!this.props.showing) {
            return null;
        }
        return (
            <button className="btn btn-default btn-sm"
                    onClick={this.onClick.bind(this)}>
                <svg className="octicon octicon-arrow-left octicon-before" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fillRule="evenodd" d="M6 3L0 8l6 5v-3h4V6H6z"></path></svg>
                Back</button>
        );
    }
    onClick() {
        this.props.onClick();
    }
}

BackButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    showing: PropTypes.bool.isRequired
};
