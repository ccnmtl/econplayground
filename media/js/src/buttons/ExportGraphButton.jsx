import React from 'react';
import {BOARD_WIDTH, BOARD_HEIGHT} from '../utils.js';

const downloadURI = (uri, name) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default class ExportGraphButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '#'
        };
    }
    render() {
        return (
            <span className="ms-1">
                Export as:
                <a
                    className="btn btn-secondary btn-sm ms-1"
                    download="ep-graph.svg"
                    href={this.state.url}
                    title="Export as SVG"
                    onClick={this.onClickSVG.bind(this)}>
                    SVG <svg className="octicon octicon-after" xmlns="http://www.w3.org/2000/svg" fill="white" width="16" height="16" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4 6h3V0h2v6h3l-4 4-4-4zm11-4h-4v1h4v8H1V3h4V2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"/></svg>
                </a>
                <a
                    className="btn btn-secondary btn-sm ms-1"
                    download="ep-graph.png"
                    href="#"
                    title="Export as PNG"
                    onClick={this.onClickPNG.bind(this)}>
                    PNG <svg className="octicon octicon-after" xmlns="http://www.w3.org/2000/svg" fill="white" width="16" height="16" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4 6h3V0h2v6h3l-4 4-4-4zm11-4h-4v1h4v8H1V3h4V2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"/></svg>
                </a>
                <canvas id="exported-canvas" style={{display: 'none'}} />
            </span>
        );
    }
    onClickSVG(e) {
        if (!window.board) {
            e.preventDefault();
            return;
        }

        const svg = window.board.renderer.dumpToDataURI(false);
        this.setState({
            url: svg
        });
    }

    onClickPNG(e) {
        e.preventDefault();

        if (!window.board) {
            return;
        }

        const canvas = document.getElementById('exported-canvas');

        window.board.renderer.dumpToCanvas(
            'exported-canvas', BOARD_WIDTH, BOARD_HEIGHT
        ).then(() => {
            const pngData = canvas.toDataURL('image/png');

            downloadURI(pngData, e.target.download);
        });
    }
}
