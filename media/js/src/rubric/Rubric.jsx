import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import RuleList from './RuleList.jsx';
import AddRule from './AddRule.jsx';
import { RulesProvider } from './RulesContext.jsx';

/**
 * Rubric
 *
 * AssessmentRule manager component for assignment builder.
 */
export default function Rubric({ questionId }) {
    const [assessmentType, setAssessmentType] = useState(0);

    function handleChange(e) {
        const value = Number(e.target.value);
        setAssessmentType(value);
    }

    return (
        <div>
            <h3>Rubric</h3>

            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="radio" name="assessmentType"
                    id="inlineRadio1" value="0"
                    onChange={handleChange}
                    checked={assessmentType === 0} />
                <label className="form-check-label" htmlFor="inlineRadio1">
                    Graph Assessment
                </label>
            </div>

            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="radio" name="assessmentType"
                    id="inlineRadio2" value="1"
                    onChange={handleChange}
                    checked={assessmentType === 1} />
                <label className="form-check-label" htmlFor="inlineRadio2">
                    Multiple Choice
                </label>
            </div>

            <RulesProvider>
                <RuleList
                    questionId={questionId} assessmentType={assessmentType} />
                <AddRule assessmentType={assessmentType} />
            </RulesProvider>
        </div>
    );
}

Rubric.propTypes = {
    // This is required for updating an existing question, but not
    // present when making a new question.
    questionId: PropTypes.number
};
