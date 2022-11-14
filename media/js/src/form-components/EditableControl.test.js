/* eslint-env jest */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import EditableControl from './EditableControl';

it('renders without crashing', () => {
    const el = TestRenderer.create(
        <EditableControl
            id="gIntersectionHorizLineLabel"
            name="Endowment point&apos;s horizontal line label"
            value="a"
            valueEditable={true}
            isInstructor={true}
            updateGraph={function() {}} />
    );
    if (!el){ console.error('el does not exist'); }
});

it('Displays control when valueEditable is true', () => {
    const el = TestRenderer.create(
        <EditableControl
            id="gIntersectionHorizLineLabel"
            name="Endowment point&apos;s horizontal line label"
            value="a"
            valueEditable={true}
            isInstructor={true}
            updateGraph={function() {}} />
    ).root;
    el.findByProps({id: 'gIntersectionHorizLineLabel'});
});

it('Hides control when valueEditable is false', () => {
    const el = TestRenderer.create(
        <EditableControl
            id="gIntersectionHorizLineLabel"
            name="Endowment point&apos;s horizontal line label"
            value="a"
            valueEditable={false}
            isInstructor={false}
            updateGraph={function() {}} />
    ).root;
    expect(() => {
        el.findByProps({className: 'form-control'});
    }).toThrow('No instances found with props: {"className":"form-control"}');
});
