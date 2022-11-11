/* eslint-env jest */

import React from 'react';
import { createRoot } from 'react-dom/client';
import AreaDisplay from './AreaDisplay';

it('renders with null values', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
        <AreaDisplay areaA={null} areaB={null} areaC={null} />);
});

it('renders with real values', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
        <AreaDisplay areaA={1.23} areaB={1.23} areaC={1.23} />);
});
