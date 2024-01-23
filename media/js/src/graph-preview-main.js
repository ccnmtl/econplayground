import React from 'react';
import { createRoot } from 'react-dom/client';
import GraphPreview from './GraphPreview.jsx';

const rootMC = {};

function initGraphPreview(domElement, gId= null) {
    const container = domElement;
    if (container) {
        if (!(container.id in rootMC)) {
            rootMC[domElement.id] = createRoot(domElement);
        }
    }
    if (gId) {
        rootMC[domElement.id].render(<GraphPreview gId={gId} />);
    }
}

window.initGraphPreview = initGraphPreview;
