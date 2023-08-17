import React from 'react';
import RuleList from './RuleList.jsx';
import AddRule from './AddRule.jsx';
import { RulesProvider } from './RulesContext.jsx';

/**
 * Rubric
 *
 * AssessmentRule manager component for assignment builder.
 */
export default function Rubric() {
    // const assessmentTypes = JSON.parse(
    //     document.getElementById('assessment_types').textContent);

    return (
        <div className="border mb-2 px-2">
            <h3>Rubric</h3>

            <RulesProvider>
                <RuleList />
                <AddRule />
            </RulesProvider>
        </div>
    );
}
