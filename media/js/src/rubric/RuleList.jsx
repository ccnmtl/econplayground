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
                    media_unfulfilled: rule.media_unfulfilled,
                    graph_type: d.graph.graph_type
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

function Rule({ rule }) {
    const dispatch = useRulesDispatch();
    const [graphType, setGraphType] = useState(rule.graph_type);

    const [fulfilledMedia, setFulfilledMedia] = useState('');
    const [unfulfilledMedia, setUnfulfilledMedia] = useState('');

    useEffect(() => {
        document.addEventListener('graphTypeUpdated', (e) => {
            const graphType = window.parseInt(e.detail);
            setGraphType(graphType);
        });
    });

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
        </fieldset>
    );
}

Rule.propTypes = {
    rule: PropTypes.object.isRequired
};
