import React from 'react';
import PropTypes from 'prop-types';

export default class SubmitButton extends React.Component {
    render() {
        const hasAssessment = !!this.props.assessment &&
              this.props.assessment.length !== 0;

        if (!hasAssessment) {
            return null;
        }

        if (!!this.props.submission) {
            const submittedAt = new Date(this.props.submission.created_at);
            return <React.Fragment>
                <hr />
                <small>
                You submitted an answer to this graph at {submittedAt.toLocaleString()}.
                </small>
                </React.Fragment>;
        }

        return <React.Fragment>
            <hr />
            <button className="btn btn-primary btn-sm mt-1" type="submit">
                Submit
            </button>
        </React.Fragment>;
    }
}

SubmitButton.propTypes = {
    onClick: PropTypes.func,
    gNeedsSubmit: PropTypes.bool.isRequired,
    isInstructor: PropTypes.bool.isRequired,
    submission: PropTypes.object,
    assessment: PropTypes.array.isRequired
};
