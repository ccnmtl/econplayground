/* eslint-env jest */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import AreaDisplay from './AreaDisplay.jsx';

it('renders with null values', () => {
    TestRenderer.create(
        <AreaDisplay areaA={null} areaB={null} areaC={null} />);
});

it('renders with real values', () => {
    TestRenderer.create(
        <AreaDisplay areaA={1.23} areaB={1.23} areaC={1.23} />);
});
