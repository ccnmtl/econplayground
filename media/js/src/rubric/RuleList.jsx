import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRules, useRulesDispatch } from './RulesContext.jsx';
import { getRuleOptions } from './ruleOptions.js';
import { getQuestion } from '../utils.js';

export default function RuleList({ questionId }) {
    const [isLoaded, setIsLoaded] = useState(false);

    const rules = useRules();
    const dispatch = useRulesDispatch();

    useEffect(() => {
        getQuestion(questionId).then((d) => {
            const rules = d.assessmentrule_set;
            rules.forEach((rule) => {
                dispatch({
                    type: 'added',
                    name: rule.assessment_name,
                    value: rule.assessment_value,
                    feedback_fulfilled: rule.feedback_fulfilled,
                    media_fulfilled: rule.media_fulfilled,
                    feedback_unfulfilled: rule.feedback_unfulfilled,
                    media_unfulfilled: rule.media_unfulfilled
                });
            });

            setIsLoaded(true);
        });
    }, []);

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {rules.map(rule => (
                <Rule key={rule.id} rule={rule} />
            ))}
        </>
    );
}

RuleList.propTypes = {
    questionId: PropTypes.number.isRequired
};

function Rule({ rule }) {
    const dispatch = useRulesDispatch();

    function onClickRemoveRule() {
        dispatch({
            type: 'deleted',
            id: rule.id
        });
    }

    const names = getRuleOptions().map((x) => {
        return x.names;
    }).flat();

    const renderedNames = names.map((x) => {
        return (
            <option key={x.value} value={x.value}>
                {x.name}
            </option>
        );
    });

    return (
        <fieldset className="border px-2 mb-1">
            <button
                type="button"
                className="btn btn-sm btn-danger float-end my-2"
                title="Remove rule"
                onClick={onClickRemoveRule}>
                <i className="bi bi-x-lg"></i>
            </button>

            <div className="row mb-3">
                <div className="col">
                    <label
                        htmlFor={`questionAssessmentName-${rule.id}`}
                        className="form-label">
                        Assessment name
                    </label>
                    <select
                        className="form-select ep-question-assessment-name"
                        name={`rule_assessment_name_${rule.id}`}
                        id={`questionAssessmentName-${rule.id}`}
                        defaultValue={rule.name}>
                        {renderedNames}
                    </select>
                </div>

                <div className="col">
                    <label
                        htmlFor={`questionAssessmentValue-${rule.id}`}
                        className="form-label">
                        Assessment value
                    </label>
                    <input
                        type="text" className="form-control"
                        name={`rule_assessment_value_${rule.id}`}
                        id={`questionAssessmentValue-${rule.id}`}
                        defaultValue={rule.value} />
                </div>
            </div>

            <div className="mb-3">
                <label
                    htmlFor={`feedbackFulfilled-${rule.id}`}
                    className="form-label">
                    Feedback (fulfilled)
                </label>
                <textarea
                    className="form-control"
                    name={`rule_feedback_fulfilled_${rule.id}`}
                    id={`feedbackFulfilled-${rule.id}`}
                    defaultValue={rule.feedback_fulfilled} />
            </div>

            <div className="mb-3">
                <label
                    htmlFor={`mediaFulfilled-${rule.id}`}
                    className="form-label">
                    Media (fulfilled)
                </label>
                <input
                    className="form-control"
                    name={`rule_media_fulfilled_${rule.id}`}
                    defaultValue={rule.media_fulfilled}
                    type="file" />
            </div>

            <div className="mb-3">
                <label
                    htmlFor={`feedbackUnfulfilled-${rule.id}`}
                    className="form-label">
                    Feedback (unfulfilled)
                </label>
                <textarea
                    className="form-control"
                    name={`rule_feedback_unfulfilled_${rule.id}`}
                    id={`feedbackUnfulfilled-${rule.id}`}
                    defaultValue={rule.feedback_unfulfilled} />
            </div>

            <div className="mb-3">
                <label
                    htmlFor={`mediaUnfulfilled-${rule.id}`}
                    className="form-label">
                    Media (unfulfilled)
                </label>
                <input
                    className="form-control"
                    name={`rule_media_unfulfilled_${rule.id}`}
                    defaultValue={rule.media_unfulfilled}
                    type="file" />
            </div>
        </fieldset>
    );
}

Rule.propTypes = {
    rule: PropTypes.object.isRequired
};
