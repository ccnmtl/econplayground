import React from 'react';
import PropTypes from 'prop-types';
import { createContext, useContext, useReducer } from 'react';

const RulesContext = createContext(null);
const RulesDispatchContext = createContext(null);

export function RulesProvider({ children }) {
    const [rules, dispatch] = useReducer(
        rulesReducer,
        initialRules
    );

    return (
        <RulesContext.Provider value={rules}>
            <RulesDispatchContext.Provider
                value={dispatch}
            >
                {children}
            </RulesDispatchContext.Provider>
        </RulesContext.Provider>
    );
}

RulesProvider.propTypes = {
    children: PropTypes.array.isRequired
};

export function useRules() {
    return useContext(RulesContext);
}

export function useRulesDispatch() {
    return useContext(RulesDispatchContext);
}

/**
 * Based on the list of rules, and a base case for an id
 * (generally the length of the rules list), find a unique id.
 */
const getNextId = function(rules, id) {
    if (rules && rules.some(r => r.id === id)) {
        return getNextId(rules, id + 1);
    }

    return id;
};

function rulesReducer(rules, action) {
    switch (action.type) {
        case 'added': {
            return [...rules, {
                id: getNextId(rules, rules.length),
                name: action.name,
                value: action.value,
                feedback_fulfilled: action.feedback_fulfilled,
                media_fulfilled: action.media_fulfilled,
                feedback_unfulfilled: action.feedback_unfulfilled,
                media_unfulfilled: action.media_unfulfilled
            }];
        }
        case 'changed': {
            return rules.map(t => {
                if (t.id === action.rule.id) {
                    return action.rule;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return rules.filter(t => t.id !== action.id);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const initialRules = [];
