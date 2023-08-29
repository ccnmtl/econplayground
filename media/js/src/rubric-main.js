import React from 'react';
import { createRoot } from 'react-dom/client';
import Rubric from './rubric/Rubric.jsx';

function initRubric(domElement, questionId) {
    const container = domElement;
    if (container) {
        const root = createRoot(container);
        root.render(<Rubric questionId={questionId} />);
    }
}

window.initRubric = initRubric;
