/* eslint-env jest */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import RangeEditor from './RangeEditor';

it('renders without crashing', () => {
    const el = TestRenderer.create(
        <RangeEditor
            dataId="gCobbDouglasA"
            value={0}
            handler={function() {}}
            min={0} />
    );
    if (!el){ console.error('el does not exist'); }
});

it('Displays override radio button when configured', () => {
    const el = TestRenderer.create(
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
