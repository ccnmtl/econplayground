import React from 'react';
import { createRoot } from 'react-dom/client';
import { MathJaxContext } from 'better-react-mathjax';
import Viewer from './Viewer.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <MathJaxContext>
        <Viewer />
    </MathJaxContext>
);
