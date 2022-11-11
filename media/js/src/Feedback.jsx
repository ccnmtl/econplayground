import React from 'react';
import PropTypes from 'prop-types';

export default class Feedback extends React.Component {
    render() {
        if (this.props.feedback && this.props.feedback.length > 0) {
            let n = 0;
            return (
                <React.Fragment>
                    {this.props.feedback.map(e => (
                        <div key={n++}
                             className={'alert ' + (e.fulfilled ? 'alert-primary' : 'alert-danger')}
                             role="alert">
                            {e.feedback}
                        </div>
                    ))}
                </React.Fragment>
            );
        }

        return null;
    }
}

Feedback.propTypes = {
    feedback: PropTypes.array.isRequired
};
