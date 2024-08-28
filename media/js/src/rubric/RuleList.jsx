import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRules, useRulesDispatch } from './RulesContext.jsx';
import { getRuleOptions } from './ruleOptions.js';
import { getQuestion } from '../utils.js';

export default function RuleList({ questionId, assessmentType }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [graphType, setGraphType] = useState(null);

    const rules = useRules();
    const dispatch = useRulesDispatch();

    useEffect(() => {
        document.addEventListener('graphTypeUpdated', (e) => {
            const graphType = window.parseInt(e.detail);
            setGraphType(graphType);
        });

        if (questionId) {
            getQuestion(questionId).then((d) => {
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
        <div className="accordion">
            {rules.map(rule => (
                <Rule
                    key={rule.id}
                    rule={rule} graphType={graphType} assessmentType={assessmentType}
                />
            ))}
        </div>
    );
}

RuleList.propTypes = {
    questionId: PropTypes.number,
    assessmentType: PropTypes.number.isRequired
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

function renderSelectField(name, id, defaultValue, label, options) {
    return (
        <>
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <select
                className="form-select ep-question-assessment-name"
                name={name} id={id} defaultValue={defaultValue}>
                {options}
            </select>
        </>
    );
}

function renderInputField(name, id, defaultValue, label) {
    return (
        <>
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <input
                type="text" className="form-control"
                name={name} id={id} defaultValue={defaultValue} />
        </>
    );
}

function renderRadioInputField(name, id, label) {
    return (
        <div className="form-check">
            <label htmlFor={id} className="form-check-label">
                {label}
            </label>
            <input
                type="radio" className="form-check-input"
                name={name} id={id} />
        </div>
    );
}

function Rule({ rule, graphType, assessmentType }) {
    const dispatch = useRulesDispatch();

    const [fulfilledMedia, setFulfilledMedia] = useState('');
    const [unfulfilledMedia, setUnfulfilledMedia] = useState('');

    function onClickRemoveRule() {
        dispatch({
            type: 'deleted',
            id: rule.id
        });
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
        let name = 'Select an assessment name';

        if (assessmentType === 1) {
            name = 'Create a choice';
        }

        if (rule.name) {
            name = rule.name;
        }

        let value = 'Select a value';

        if (rule.value) {
            value = rule.value;
        }

        if (assessmentType === 0) {
            return `${name} - ${value}`;
        } else {
            return name;
        }
    };

    return (
        <fieldset className="accordion-item">
            <div className="accordion-header">
                <div
                    className="accordion-button py-2" type="button" data-bs-toggle="collapse"
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
                                rule.name,
                                'Assessment name',
                                renderedNames
                            )
                        )}
                        {assessmentType === 1 && (
                            renderInputField(
                                `rule_assessment_name_${rule.id}`,
                                `questionAssessmentName-${rule.id}`,
                                rule.name,
                                'Choice name'
                            )
                        )}
                    </div>

                    <div className="col">
                        {assessmentType === 0 && (
                            renderInputField(
                                `rule_assessment_value_${rule.id}`,
                                `questionAssessmentValue-${rule.id}`,
                                rule.value,
                                'Assessment value'
                            )
                        )}
                        {assessmentType === 1 && (
                            renderRadioInputField(
                                `rule_assessment_value_${rule.id}`,
                                `questionAssessmentValue-${rule.id}`,
                                'Correct'
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
