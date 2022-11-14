/* eslint-env jest */

import React from 'react';
import { createRoot } from 'react-dom/client';
import GraphPicker from './GraphPicker';
import ReactTestUtils from 'react-dom/test-utils';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
        <GraphPicker
            gType={0}
            showing={true}
            onSelectGraph={function() {}} />);
});

it('can be clicked', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
        <GraphPicker
            gType={0}
            showing={true}
            onSelectGraph={function() {}} />,
        function() {
            ReactTestUtils.Simulate.click(this.b1.current);
        });
});
