/* eslint-env jest */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import JXGBoard from './JXGBoard.jsx';

it('renders without crashing', () => {
    TestRenderer.create(
        <JXGBoard
            id={'id-test'}
            gType={0}
            gShowIntersection={true} />);
});
