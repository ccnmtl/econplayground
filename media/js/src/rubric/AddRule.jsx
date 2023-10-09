import React from 'react';
import { useRulesDispatch } from './RulesContext.jsx';

export default function AddRule() {
    const dispatch = useRulesDispatch();

    function onClickNewRule() {
        dispatch({
            type: 'added',
            name: '',
            value: '',
            feedback_fulfilled: '',
            media_fulfilled: '',
            feedback_unfulfilled: '',
            media_unfulfilled: '',
            graph_type: null
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
