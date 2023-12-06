import React from 'react';
import { createRoot } from 'react-dom/client';
import Rubric from './rubric/Rubric.jsx';

const rootRubric = {};

function initRubric(domElement, questionId=null) {
    const container = domElement;
    if (container) {
        if (!(container.id in rootRubric)) {
            rootRubric[domElement.id] = createRoot(domElement);
        }
        rootRubric[domElement.id].render(<Rubric questionId={questionId} />);
    }
}

window.initRubric = initRubric;
