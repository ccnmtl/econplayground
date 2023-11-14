import React from 'react';
import { createRoot } from 'react-dom/client';
import Search from './Search.jsx';


function initSearch(domElement, request, qId) {
    const container = domElement;
    if (container) {
        const root = createRoot(container);
        root.render(<Search {...{request, qId}} />);
    }
}

window.initSearch = initSearch;