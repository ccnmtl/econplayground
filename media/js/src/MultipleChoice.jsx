import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getMultipleChoice } from './utils';

export default function MultipleChoice({qId}) {
    const [mcSet, setMcSet] = useState([]);
    
    useEffect(() => {
        getMultipleChoice(qId).then(data => {
            if (data) {
                setMcSet(data);
            }});
    }, []);

    const handleAddMC = function(e) {
        e.preventDefault();
        setMcSet([...mcSet, {
            'question': qId,
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
        <div className='mb-3'>
            <label htmlFor='multiple-choice'
                className='form-label'
            >
                Multiple Choice
            </label>
            <div id='multiple-choice' className='container mb-2'>
                {mcSet.map((set, i) => { if (i < 10) return (
                    <div className='container form-control mb-2' key={i} id={`multiple-choice-${i}`}>
                        <label htmlFor={`text-${i}`} className='mb-2'>Multiple Choice Question {i+1}</label>
                        {mcSet.length > 0 ?
                            <button className='btn btn-danger float-end mb-2 py-1'
                                id={`remove-mc-${i}`}
                                onClick={handleRemoveMC}
                            >
                                X
                            </button> : null}
                        <input id={`mc-text-${i}`} type='text' className='form-control mb-2 col-1'
                            value={set.text} onChange={handleQuestionText} name={`mc-text-${i}`}/>
                        {set.choices.map((choice, j) =>
                            <div className='row mb-2 mx-2' key={j}>
                                <div className='form-check container col-10'
                                    id={`choice-${i}-${j}`}
                                >
                                    <input type='radio'
                                        id={`select-${i}-${j}`}
                                        name={`select-${i}-${j}`}
                                        onChange={handleCorrectChoice}
                                        className='form-check-input col-1'
                                        checked={set.correct === j} />
                                    <input type='text'
                                        id={`choice-text-${i}-${j}`}
                                        name={`choice-text-${i}-${j}`}
                                        onChange={handleChoiceText}
                                        className='form-control col-10'
                                        placeholder={`Choice ${j+1}`}
                                        value={choice} />
                                </div>
                                <button className='btn btn-danger col-1'
                                    id={`remove-choice-${i}-${j}`}
                                    onClick={handleRemoveChoice}>
                                    X
                                </button>
                            </div>
                        )}
                        {set.choices.length < 10 && <button className='btn btn-primary mx-1'
                            id={`add-choice-${i}`}
                            onClick={handleAddChoice}>
                            Add choice
                        </button>}
                    </div>);}
                )}
                {mcSet.length < 10 && <button className='btn btn-primary mx-1' onClick={handleAddMC}>
                    Add multiple choice
                </button>}
            </div>
        </div>
    );
}

MultipleChoice.propTypes = {
    qId: PropTypes.number
};