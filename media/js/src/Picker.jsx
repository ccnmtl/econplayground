import React, { Component } from 'react';
import GraphPicker from './GraphPicker.jsx';
import { defaultGraph } from './GraphMapping.js';

class Picker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            user: null,
            alertText: null,
            inGraph: null,
            lastGraphVisited: null,
        };

        Object.assign(this.state, defaultGraph);

        this.gp = React.createRef();
        this.ge = React.createRef();

        // Back/Forward navigation work-around
        //      Refresh still messes with the state,
        //      but it's much less of a problem
        window.addEventListener('hashchange', () => {
            if (this.state.gType === null) {
                this.setState({
                    step: 0,
                    inGraph: false,
                });
            } else if (this.state.inGraph) {
                this.setState({
                    lastGraphVisited: this.state.gType,
                    step: 0,
                    inGraph: false,
                });
            } else {
                // Copy defaultGraph object
                let newState = Object.assign({}, defaultGraph);
                newState.step = 1;
                newState.gType = (this.state.gType !== null ? this.state.gType : this.state.lastGraphVisited);
                newState.inGraph = true;

                this.setState(newState);
            }
        });
    }
    render() {
        return (
            <div className="Picker">
                <div className="Picker-container">
                    <div className="alert alert-danger"
                        hidden={this.state.alertText ? false : true}
                        role="alert">
                        {this.state.alertText}
                    </div>
                    <GraphPicker/>
                </div>
            </div>
        );
    }
}

export default Picker;
