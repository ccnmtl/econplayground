import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRules, useRulesDispatch } from './RulesContext.jsx';
import { getRuleOptions } from './ruleOptions.js';
import { getQuestion } from '../utils.js';

export default function RuleList({ questionId }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [graphType, setGraphType] = useState(null);
    const [assessmentType, setAssessmentType] = useState(0);

    const rules = useRules();
    const dispatch = useRulesDispatch();

    function handleAssessmentTypeChange(e) {
        const value = Number(e.target.value);
        setAssessmentType(value);
    }

    useEffect(() => {
        document.addEventListener('graphTypeUpdated', (e) => {
            const graphType = window.parseInt(e.detail);
            setGraphType(graphType);
        });

        if (questionId) {
            getQuestion(questionId).then((d) => {
                setAssessmentType(d.assessment_type);

                const rules = d.assessmentrule_set;

                if (d.graph) {
                    setGraphType(d.graph.graph_type);
                } else {
                    // Just use first graph type to make the form
                    // work, in case there is no graph connected to
                    // this question yet.
                    setGraphType(1);
                }

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
        } else {
            if (
                window.EconPlayground &&
                    typeof window.EconPlayground.initialGraphType !==
                    'undefined'
            ) {
                setGraphType(window.EconPlayground.initialGraphType);
            }

            setIsLoaded(true);
        }

    }, []);

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="radio" name="assessment_type"
                    id="inlineRadio1" value="0"
                    onChange={handleAssessmentTypeChange}
                    checked={assessmentType === 0} />
                <label className="form-check-label" htmlFor="inlineRadio1">
                    Graph Assessment
                </label>
            </div>

            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="radio" name="assessment_type"
                    id="inlineRadio2" value="1"
                    onChange={handleAssessmentTypeChange}
                    checked={assessmentType === 1} />
                <label className="form-check-label" htmlFor="inlineRadio2">
                    Multiple Choice
                </label>
            </div>

            <div className="accordion">
                {rules.map(rule => (
                    <Rule
                        key={rule.id}
                        rule={rule} graphType={graphType} assessmentType={assessmentType}
                    />
                ))}
            </div>
        </>
    );
}

RuleList.propTypes = {
    questionId: PropTypes.number
};

function s3Upload(inputEl, onFinish) {
    return new window.S3Upload({
        file_dom_el: inputEl,
        s3_sign_put_url: '/sign_s3/', // change this if you route differently
        s3_object_name: inputEl.value,
        onProgress: function(percent, message) {
            console.log('progress', percent, message);
        },
        onFinishS3Put: onFinish,
        onError: function(status) {
            console.log('onError', status);
        }
    });
}

/**
 * Given a url, get its path without the domain.
 */
function getPath(url) {
    if (url) {
        return new window.URL(url).pathname;
    }

    return '';
}

function renderSelectField(name, id, value, label, options, onChange) {
    return (
        <>
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <select
                className="form-select ep-question-assessment-name"
                name={name} id={id} value={value} onChange={onChange}>
                {options}
            </select>
        </>
    );
}

function renderInputField(name, id, value, label, onChange) {
    return (
        <>
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <input
                type="text" className="form-control"
                name={name} id={id}
                value={value}
                onChange={onChange} />
        </>
    );
}

function renderRadioInputField(name, ruleId, label, checked) {
    const id = `questionAssessmentValue-${ruleId}`;
    return (
        <div className="form-check">
            <label htmlFor={id} className="form-check-label">
                {label}
            </label>
            <input
                type="radio" className="form-check-input"
                data-rule-id={ruleId}
                name={name} id={id}
                value={ruleId}
                defaultChecked={checked}
            />
        </div>
    );
}

function Rule({ rule, graphType, assessmentType }) {
    const dispatch = useRulesDispatch();

    const [fulfilledMedia, setFulfilledMedia] = useState('');
    const [unfulfilledMedia, setUnfulfilledMedia] = useState('');
    const [ruleName, setRuleName] = useState(rule.name);
    const [ruleValue, setRuleValue] = useState(rule.value);

    function onClickRemoveRule() {
        dispatch({
            type: 'deleted',
            id: rule.id
        });
    }

    function onChangeRuleName(e) {
        setRuleName(e.target.value);
    }

    function onChangeRuleValue(e) {
        setRuleValue(e.target.value);
    }

    function handleFulfilledMediaChange(e) {
        s3Upload(
            e.target,
            function(url) {
                setFulfilledMedia(url);
            });
    }

    function handleUnfulfilledMediaChange(e) {
        s3Upload(
            e.target,
            function(url) {
                setUnfulfilledMedia(url);
            });
    }

    // Get graph type
    const names = getRuleOptions(graphType);

    const renderedNames = names.map((x) => {
        return (
            <option key={x.value} value={x.value}>
                {x.name}
            </option>
        );
    });

    const accordionItemLabel = function() {
        let labelName = 'Select an assessment name';

        if (assessmentType === 1) {
            labelName = 'Create a choice';
        }

        if (ruleName) {
            labelName = ruleName;
        }

        let labelValue = 'Select a value';

        if (ruleValue) {
            labelValue = ruleValue;
        }

        return `${labelName} - ${labelValue}`;
    };

    return (
        <fieldset className="accordion-item">
            <div className="accordion-header">
                <div
                    className="accordion-button py-2" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#rule-${rule.id}`}>
                    <label>{accordionItemLabel()}</label>
                </div>
            </div>
            <div id={`rule-${rule.id}`} className="accordion-collapse collapse show p-2">
                <button
                    type="button"
                    className="btn btn-sm btn-danger float-end"
                    title="Remove rule"
                    onClick={onClickRemoveRule}>
                    <i className="bi bi-x-lg"></i>
                </button>
                <div className="row mb-3">
                    <div className="col">
                        {assessmentType === 0 && (
                            renderSelectField(
                                `rule_assessment_name_${rule.id}`,
                                `questionAssessmentName-${rule.id}`,
                                ruleName,
                                'Assessment name',
                                renderedNames,
                                onChangeRuleName
                            )
                        )}
                        {assessmentType === 1 && (
                            renderInputField(
                                `rule_assessment_name_${rule.id}`,
                                `questionAssessmentName-${rule.id}`,
                                ruleName,
                                'Choice name',
                                onChangeRuleName
                            )
                        )}
                    </div>

                    <div className="col">
                        {assessmentType === 0 && (
                            renderInputField(
                                `rule_assessment_value_${rule.id}`,
                                `questionAssessmentValue-${rule.id}`,
                                ruleValue,
                                'Assessment value',
                                onChangeRuleValue
                            )
                        )}
                        {assessmentType === 1 && (
                            renderRadioInputField(
                                'rule_assessment_value',
                                rule.id,
                                'Correct',
                                rule.value === 'true'
                            )
                        )}
                    </div>
                </div>

                {assessmentType === 0 && (
                    <div className="row">
                        <div className="col bg-success-subtle">
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
                                    name={`rule_media_file_fulfilled_${rule.id}`}
                                    onChange={handleFulfilledMediaChange.bind(this)}
                                    type="file" />
                                <input
                                    name={`rule_media_fulfilled_${rule.id}`}
                                    value={getPath(fulfilledMedia) || getPath(rule.media_fulfilled) || ''}
                                    type="hidden" />

                                {(fulfilledMedia || rule.media_fulfilled) && (
                                    <img
                                        src={fulfilledMedia || rule.media_fulfilled}
                                        style={{maxHeight: '200px'}}
                                        className="img-thumbnail mt-1"
                                        alt="Fulfilled media" />
                                )}
                            </div>
                        </div>

                        <div className="col bg-danger-subtle">
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
                                    name={`rule_media_file_unfulfilled_${rule.id}`}
                                    onChange={handleUnfulfilledMediaChange.bind(this)}
                                    type="file" />
                                <input
                                    name={`rule_media_unfulfilled_${rule.id}`}
                                    value={getPath(unfulfilledMedia) || getPath(rule.media_unfulfilled) || ''}
                                    type="hidden" />

                                {(unfulfilledMedia || rule.media_unfulfilled) && (
                                    <img
                                        src={unfulfilledMedia || rule.media_unfulfilled}
                                        style={{maxHeight: '200px'}}
                                        className="img-thumbnail mt-1"
                                        alt="Unfulfilled media" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </fieldset>
    );
}

Rule.propTypes = {
    rule: PropTypes.object.isRequired,
    graphType: PropTypes.number.isRequired,
    assessmentType: PropTypes.number.isRequired
};
