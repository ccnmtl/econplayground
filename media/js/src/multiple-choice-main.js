import React from 'react';
import { createRoot } from 'react-dom/client';
import MultipleChoice from './MultipleChoice.jsx';

const rootMC = {};

function initMultipleChoice(domElement, qId=null) {
    const container = domElement;
    if (container) {
        if (!(container.id in rootMC)) {
            rootMC[domElement.id] = createRoot(domElement);
        }
        rootMC[domElement.id].render(<MultipleChoice qId={qId} />);
    }
}

window.initMultipleChoice = initMultipleChoice;
