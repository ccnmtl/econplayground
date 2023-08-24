import React from 'react';
import { useRulesDispatch } from './RulesContext.jsx';

let nextId = 1;

export default function AddRule() {
    const dispatch = useRulesDispatch();

    function onClickNewRule() {
        dispatch({
            type: 'added',
            id: nextId++,
            name: 'name',
            value: 'value'
        });
    }

    return (
        <button
            type="button"
            className="btn btn-primary my-2"
            onClick={onClickNewRule}>
            <i className="bi bi-plus-lg"></i>
            Add new rule
        </button>
    );
}
