/* eslint-env jest */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import GraphPicker from './GraphPicker.jsx';

it('renders without crashing', () => {
    TestRenderer.create(
        <GraphPicker
            gType={0}
            showing={true}
            onSelectGraph={function() {}} />);
});

it('can be clicked', () => {
    TestRenderer.create(
        <GraphPicker
            gType={0}
            showing={true}
            onSelectGraph={function() {}} />,
        function() {
            ReactTestUtils.Simulate.click(this.b1.current);
        });
});
