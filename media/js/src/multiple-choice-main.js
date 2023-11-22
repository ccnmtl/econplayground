import React from 'react';
import { createRoot } from 'react-dom/client';
import MultipleChoice from './MultipleChoice.jsx';

function initMultipleChoice(domElement, qId=null) {
    const container = domElement;
    if (container) {
        const root = createRoot(container);
        root.render(<MultipleChoice qId={qId} />);
    }
}

window.initMultipleChoice = initMultipleChoice;
