import React from 'react';
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
