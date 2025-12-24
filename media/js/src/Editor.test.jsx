/* eslint-env jest */

import React from 'react';
import {render} from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';
import Editor from './Editor.jsx';
import { exportGraph } from './GraphMapping.js';

test('renders without crashing', () => {
    render(<Editor />);
});

test('renders with children in the expected visibility state', () => {
    render(
        <Editor />,
        function() {
            expect(this.gp.current.props.showing).toBe(true);
            expect(this.ge.current.props.showing).toBe(false);

            expect(ReactTestUtils.isCompositeComponent(this.gp.current)).toBe(true);
            expect(ReactTestUtils.isCompositeComponent(this.ge.current)).toBe(true);

            expect(this.state.step).toBe(0);
            expect(this.state.gType).toBe(null);
            ReactTestUtils.Simulate.click(this.gp.current.b1);
            // expect(this.state.step).toBe(1);
        });
});

test('exports its graph state', () => {
    render(
        <Editor />,
        function() {
            let o = exportGraph(this.state);
            expect(o.graph_type).toBe(null);
            expect(o.show_intersection).toBe(true);
            expect(o.line_1_slope).toBe(1);
            expect(o.line_2_slope).toBe(-1);
            expect(o.line_1_label).toBe('');
            expect(o.line_2_label).toBe('');
            expect(o.y_axis_label).toBe('');
            expect(o.x_axis_label).toBe('');
        });
});
