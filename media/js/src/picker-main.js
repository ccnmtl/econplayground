import React from 'react';
import { createRoot } from 'react-dom/client';
import { MathJaxContext } from 'better-react-mathjax';
import Picker from './Picker.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <MathJaxContext>
        <Picker />
    </MathJaxContext>
);
