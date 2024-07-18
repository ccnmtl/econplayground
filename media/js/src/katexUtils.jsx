import React from 'react';
import katex from 'katex';

/**
 * getKatexEl
 *
 * Given a katex string, return a jsx element as a span, with the
 * latex formatted inside it.
 */
const getKatexEl = function(str) {
    const rendered = katex.renderToString(str, {
        throwOnError: false
    });

    return (
        <span dangerouslySetInnerHTML={{__html: rendered}}>
        </span>
    );
};

export { getKatexEl };
