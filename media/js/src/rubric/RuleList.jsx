import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useRules, useRulesDispatch } from './RulesContext.jsx';
import { getRuleOptions } from './ruleOptions.js';

export default function RuleList() {
    const rules = useRules();

    return (
        <>
            {rules.map(rule => (
                <Rule key={rule.id} rule={rule} />
            ))}
        </>
    );
}

function Rule({ rule }) {
    const [names, setNames] = useState([]);

    const dispatch = useRulesDispatch();

    const options = getRuleOptions();

    function onClickRemoveRule() {
        dispatch({
            type: 'deleted',
            id: rule.id
        });
    }

    function onTypeChange(e) {
        const selectedType = options.find(x => x.value === e.target.value);
        setNames(selectedType.names);
    }

    const renderedTypes = options.map((x) => {
        return (
            <option key={x.value} value={x.value}>
                {x.name}
            </option>
        );
    });

    const renderedNames = names.map((x) => {
        return (
            <option key={x.value} value={x.value}>
                {x.name}
            </option>
        );
    });

    return (
        <section className="border px-2 mb-1">
            <button
                type="button"
                className="btn btn-sm btn-danger float-end my-2"
                title="Remove rule"
                onClick={onClickRemoveRule}>
                <i className="bi bi-x-lg"></i>
            </button>

            <div className="mb-3">
                <label
                    htmlFor={`questionAssessmentType-${rule.id}`}
                    className="form-label">
                    Assessment type
                </label>
                <select
                    className="form-select ep-question-assessment-type"
                    name="assessment_type"
                    id={`questionAssessmentType-${rule.id}`}
                    onChange={onTypeChange}>
                    <option>Select:</option>
                    {renderedTypes}
                </select>
            </div>

            <div className="row mb-3">
                <div className="col">
                    <label
                        htmlFor={`questionAssessmentName-${rule.id}`}
                        className="form-label">
                        Assessment name
                    </label>
                    <select
                        className="form-select ep-question-assessment-name"
                        name="assessment_name"
                        id={`questionAssessmentName-${rule.id}`}>
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
                        name="assessment_value"
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
                    name="feedback_fulfilled"
                    id={`feedbackFulfilled-${rule.id}`}
                    defaultValue="feedback_fulfilled" />
            </div>

            <div className="mb-3">
                <label
                    htmlFor={`mediaFulfilled-${rule.id}`}
                    className="form-label">
                    Media (fulfilled)
                </label>
                <input className="form-control" type="file" />
            </div>

            <div className="mb-3">
                <label
                    htmlFor={`feedbackUnfulfilled-${rule.id}`}
                    className="form-label">
                    Feedback (unfulfilled)
                </label>
                <textarea
                    className="form-control"
                    name="feedback_unfulfilled"
                    id={`feedbackUnfulfilled-${rule.id}`}
                    defaultValue="feedback_unfulfilled" />
            </div>

            <div className="mb-3">
                <label
                    htmlFor={`mediaUnfulfilled-${rule.id}`}
                    className="form-label">
                    Media (unfulfilled)
                </label>
                <input className="form-control" type="file" />
            </div>
        </section>
    );
}

Rule.propTypes = {
    rule: PropTypes.object.isRequired
};
