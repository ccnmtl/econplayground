/* eslint-env jest */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import { MathJaxContext } from 'better-react-mathjax';
import JXGBoard from './JXGBoard.jsx';

it('renders without crashing', () => {
    TestRenderer.create(
        <MathJaxContext>
            <JXGBoard
                id={'id-test'}
                gType={0}
                gShowIntersection={true} />
        </MathJaxContext>
    );
});
