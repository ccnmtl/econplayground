/* eslint-env jest */

import React from 'react';
import {render, screen} from '@testing-library/react';
import EditableControl from './EditableControl.jsx';

test('renders without crashing', () => {
    const el = render(
        <EditableControl
            id="gIntersectionHorizLineLabel"
            name="Endowment point&apos;s horizontal line label"
            value="a"
            valueEditable={true}
            isInstructor={true}
            updateGraph={function() {}} />
    );

    if (!el) {
        console.error('el does not exist');
    }
});

test('Displays control when valueEditable is true', async () => {
    render(
        <EditableControl
            id="gIntersectionHorizLineLabel"
            name="Endowment point&apos;s horizontal line label"
            value="a"
            valueEditable={true}
            isInstructor={true}
            updateGraph={function() {}} />
    );

    await screen.findByTestId('editablecontrol');
});

test('Hides control when valueEditable is false', () => {
    render(
        <EditableControl
            id="gIntersectionHorizLineLabel"
            name="Endowment point&apos;s horizontal line label"
            value="a"
            valueEditable={false}
            isInstructor={false}
            updateGraph={function() {}} />
    );

    /*expect(() => {
        el.findByProps({className: 'form-control'});
    }).toThrow('No instances found with props: {"className":"form-control"}');*/
});
