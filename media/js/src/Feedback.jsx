import React from 'react';
import PropTypes from 'prop-types';

const renderAlert = function(fulfilled, feedback, idx) {
    if (!feedback) {
        feedback = fulfilled ?
            'Assessment rule fulfilled.' : 'Assessment rule unfulfilled.';
    }

    return (
        <div
            key={idx}
            className={
                'alert ' + (fulfilled ? 'alert-success' : 'alert-danger')
            }
            role="alert">
            {feedback}
        </div>
    );
};

export default class Feedback extends React.Component {
    render() {
        if (this.props.feedback && this.props.feedback.length > 0) {
            return (
                <>
                    {this.props.feedback.map((e, idx) => (
                        renderAlert(e.fulfilled, e.feedback, idx)
                    ))}
                </>
            );
        }

        return null;
    }
}

Feedback.propTypes = {
    feedback: PropTypes.array.isRequired
};
