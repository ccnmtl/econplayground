import React from 'react';
import { createRoot } from 'react-dom/client';
import GraphPreview from './GraphPreview.jsx';

const container = document.getElementById('graph-preview');
const root = createRoot(container);

function initGraphPreview(domElement, graphId=null) {
    root.render(<GraphPreview graphId={graphId} />);
}

window.initGraphPreview = initGraphPreview;
