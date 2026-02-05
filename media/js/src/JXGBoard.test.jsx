import React from 'react';
import {render} from '@testing-library/react';
import JXGBoard from './JXGBoard.jsx';

test('renders without crashing', () => {
    render(
        <JXGBoard
            id={'id-test'}
            gType={0}
            gShowIntersection={true} />
    );
});
