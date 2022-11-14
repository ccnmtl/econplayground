/* eslint-env jest */

import React from 'react';
import { createRoot } from 'react-dom/client';
import JXGBoard from './JXGBoard';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
        <JXGBoard
            id={'id-test'}
            gType={0}
            gShowIntersection={true} />);
});
