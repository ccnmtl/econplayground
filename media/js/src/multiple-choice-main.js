import React from 'react';
import { createRoot } from 'react-dom/client';
import MultipleChoice from './MultipleChoice.jsx';

function initMultipleChoice(domElement, questionId=null) {
    const container = domElement;
    const root = createRoot(container);
    root.render(<MultipleChoice questionId={questionId} />);
}

window.initMultipleChoice = initMultipleChoice;
