import React from 'react';
import PropTypes from 'prop-types';
import { useRulesDispatch } from './RulesContext.jsx';

export default function AddRule({ assessmentType }) {
    const dispatch = useRulesDispatch();

    function onClickNewRule() {
        dispatch({
            type: 'added',
            name: '',
            value: '',
            feedback_fulfilled: '',
            media_fulfilled: '',
            feedback_unfulfilled: '',
            media_unfulfilled: ''
        });
    }

    let label = 'Add new rule';
    if (assessmentType === 1) {
        label = 'Add new choice';
    }

    return (
        <button
            type="button"
            className="btn btn-sm btn-primary my-2"
            onClick={onClickNewRule}>
            <i className="bi bi-plus-lg"></i>
            {label}
        </button>
    );
}

AddRule.propTypes = {
    assessmentType: PropTypes.number.isRequired
};
