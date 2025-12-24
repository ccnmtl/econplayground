/* eslint-env jest */

import React from 'react';
import {render} from '@testing-library/react';
import RangeEditor from './RangeEditor.jsx';

test('renders without crashing', () => {
    const el = render(
        <RangeEditor
            dataId="gCobbDouglasA"
            value={0}
            handler={function() {}}
            min={0} />
    );
    if (!el){ console.error('el does not exist'); }
});

test('Displays override radio button when configured', () => {
    const el = render(
        <RangeEditor
            dataId="gCobbDouglasA"
            value={0}
            handler={function() {}}
            min={0}
            max={5}
            showOverrideButton={true}
            overrideLabel={'override'}
            overrideValue={10000}
        />
    ).root;
    const button = el.findByProps({type: 'radio'});
    expect(button.type).toEqual('input');
});
