import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getMultipleChoice } from './utils';

export default function MultipleChoice({questionId}) {
    const [mcSet, setMcSet] = useState([]);

    useEffect(() => {
        if (questionId) {
            getMultipleChoice(questionId).then(data => {
                if (data) {
                    setMcSet(data);
                }});
        }
    }, []);

    const handleAddMC = function(e) {
        e.preventDefault();
        setMcSet([...mcSet, {
            'question': questionId,
            'choices': [''],
            'correct': 0,
            'text': '',
        }]);
    };

    const handleAddChoice = function(e) {
        e.preventDefault();
        const target = e.target.id.split('-')[2];
        setMcSet(mcSet.map((mc, i) => {
            if (i === Number(target)) {
                mc.choices = [...mc.choices, ''];
            }
            return mc;
        }));
    };

    const handleRemoveChoice = function(e) {
        e.preventDefault();
        const [target, choice] = e.target.id.split('-').slice(2,4);
        const newSet = mcSet.map((mc, i) =>
            i === Number(target) ? {...mc, choices:
                mc.choices.filter((text, i) =>
                    i !== Number(choice))} : mc);
        setMcSet(newSet);
    };

    const handleRemoveMC = function(e) {
        e.preventDefault();
        const target = e.target.id.split('-')[2];
        const newSet = mcSet.filter((mc, i) =>
            i !== Number(target));
        setMcSet(newSet);
    };

    const handleCorrectChoice = function(e) {
        const [target, choice] = e.target.id.split('-').slice(1,3);
        const newChoice = mcSet.map((mc, i) =>
            i === Number(target) ? {...mc, correct: Number(choice)} : mc);
        setMcSet(newChoice);
    };

    const handleChoiceText = function(e) {
        const [target, choice] = e.target.id.split('-').slice(2,4);
        const newSet = mcSet.map((mc, i) => {
            if (i === Number(target)) {
                const newChoices = mc.choices.map((text, i) => {
                    if (i === Number(choice)) {
                        return e.target.value;
                    }
                    return text;
                });
                return {...mc, choices: newChoices};
            }
            return mc;
        });
        setMcSet(newSet);
    };

    const handleQuestionText = function(e) {
        const target = e.target.id.split('-')[2];
        const newSet = mcSet.map((mc, i) =>
            i === Number(target) ? {...mc, text: e.target.value} : mc);
        setMcSet(newSet);
    };

    return (
        <div>
            <h3>Multiple Choice</h3>
            <div id="multiple-choice" className="mb-2 accordion">
                {mcSet.map((set, i) => {
                    if (i >= 10) {
                        return null;
                    }
                    return (
                        <div
                            className='accordion-item' key={i}
                            id={`multiple-choice-${i}`}>
                            <div className='accordion-header'>
                                <div
                                    className="accordion-button py-2"
                                    role="button" type="button" data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${i}`}
                                    aria-expanded="true" aria-controls={`collapse${i}`}>
                                    <label htmlFor={`text-${i}`} className='accordion-header'>
                                        Multiple Choice Question {i+1}
                                    </label>
                                </div>
                            </div>
                            <div
                                id={`collapse${i}`}
                                className="container accordion-collapse collapse show mb-2"
                                aria-labelledby={`heading${i}`}
                                data-bs-parent="#multiple-choice">


                                <div className="d-flex align-items-center">
                                    <div className="p-1 flex-fill">
                                        <input
                                            id={`mc-text-${i}`} type="text"
                                            className="form-control my-2 p-2"
                                            placeholder={`Question ${i+1}`} value={set.text}
                                            onChange={handleQuestionText}
                                            name={`mc-text-${i}`} />
                                    </div>
                                    <div className="p-1">
                                        {mcSet.length > 0 && (
                                            <button
                                                className="btn btn-sm btn-danger float-end"
                                                id={`remove-mc-${i}`}
                                                title="Remove multiple choice question"
                                                onClick={handleRemoveMC}>
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>


                                {set.choices.map((choice, j) =>
                                    <div className='row mb-2 mx-2' key={j}>
                                        <div
                                            className='form-check col-11'
                                            id={`choice-${i}-${j}`}>
                                            <input
                                                type='radio'
                                                id={`select-${i}-${j}`}
                                                name={`select-${i}-${j}`}
                                                onChange={handleCorrectChoice}
                                                className='form-check-input col-1'
                                                checked={set.correct === j} />
                                            <input
                                                type='text'
                                                id={`choice-text-${i}-${j}`}
                                                name={`choice-text-${i}-${j}`}
                                                onChange={handleChoiceText}
                                                className='form-control col-10'
                                                placeholder={`Choice ${j+1}`}
                                                value={choice} />
                                        </div>
                                        <button
                                            className='btn btn-danger col-1'
                                            id={`remove-choice-${i}-${j}`}
                                            title="Remove choice"
                                            onClick={handleRemoveChoice}>
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                )}
                                {set.choices.length < 10 && (
                                    <button
                                        className='btn btn-primary mx-1'
                                        id={`add-choice-${i}`}
                                        onClick={handleAddChoice}>
                                        Add choice
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {mcSet.length < 10 && (
                    <button
                        className="btn btn-primary mt-2"
                        onClick={handleAddMC}>
                        <i className="bi bi-plus-lg"></i>
                        Add multiple choice
                    </button>
                )}
            </div>
        </div>
    );
}

MultipleChoice.propTypes = {
    // This is required for updating an existing question, but not
    // present when making a new question.
    questionId: PropTypes.number
};
