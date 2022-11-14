import React from 'react';

export default class ExportGraphButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '#'
        };
    }
    render() {
        return (
            <a className="btn btn-secondary btn-sm ml-2"
               download="ep-graph.svg"
               href={this.state.url}
               title="Export as SVG"
               onClick={this.onClick.bind(this)}>
                Export as SVG <svg className="octicon octicon-after" xmlns="http://www.w3.org/2000/svg" fill="white" width="16" height="16" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4 6h3V0h2v6h3l-4 4-4-4zm11-4h-4v1h4v8H1V3h4V2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"/></svg>
            </a>
        );
    }
    onClick(evt) {
        if (!window.board) {
            evt.preventDefault();
            return;
        }

        const svg = window.board.renderer.dumpToDataURI(false);
        this.setState({
            url: svg
        });
    }
}
