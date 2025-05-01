import React from 'react';
import PropTypes from 'prop-types';


export default function RuleOptions({options}) {
    return <ul id='graph-rules-index'>
        {options.map((rules, i) => <li key={i}>
            {rules.value} &rarr; {rules.name}
        </li>)}
    </ul>;
}

RuleOptions.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object).isRequired
};