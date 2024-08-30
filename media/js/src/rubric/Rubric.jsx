import React from 'react';
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
    return (
        <div>
            <h3>Rubric</h3>

            <RulesProvider>
                <RuleList questionId={questionId} />
                <AddRule />
            </RulesProvider>
        </div>
    );
}

Rubric.propTypes = {
    // This is required for updating an existing question, but not
    // present when making a new question.
    questionId: PropTypes.number
};
