import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRules, useRulesDispatch } from './RulesContext.jsx';
import Rule from './Rule.jsx';
import { getQuestion } from '../utils.js';

export default function RuleList({ questionId }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [graphType, setGraphType] = useState(null);
    const [assessmentType, setAssessmentType] = useState(0);

    // The correct multiple choice question, for display purposes.
    const [correctChoice, setCorrectChoice] = useState(null);

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
                        assessmentType={assessmentType}
                        rule={rule} graphType={graphType}
                        correctChoice={correctChoice}
                        setCorrectChoice={setCorrectChoice}
                    />
                ))}
            </div>
        </>
    );
}

RuleList.propTypes = {
    questionId: PropTypes.number
};
