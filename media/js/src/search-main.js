import React from 'react';
import { createRoot } from 'react-dom/client';
import Search from './Search.jsx';
import {authedFetch, getError} from './utils.js';


function fetchList(request, callback=null) {
    const me = this;
    authedFetch(`/api/${request}`)
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.json().then(function(d) {
                    me.setState({
                        alertText: getError(d)
                    });
                    window.scrollTo(0, 0);
                });
            }
        }).then(function(json) {
            window.SearchJSON = json;
        }).then(function() {
            if(callback) {
                callback();
            }
        });
}

function initSearch(domElement, request, parentId) {
    const container = domElement;
    if (container) {
        const root = createRoot(container);
        root.render(<Search {...{request, parentId}} />);
    }
}

window.fetchList = fetchList;
window.initSearch = initSearch;