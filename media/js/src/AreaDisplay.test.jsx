/* eslint-env jest */

import React from 'react';
import {render} from '@testing-library/react';
import AreaDisplay from './AreaDisplay.jsx';

test('renders with null values', () => {
    render(
        <AreaDisplay areaA={null} areaB={null} areaC={null} />);
});

test('renders with real values', () => {
    render(
        <AreaDisplay areaA={1.23} areaB={1.23} areaC={1.23} />);
});
