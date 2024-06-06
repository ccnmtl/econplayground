import React, { Component } from 'react';
import GraphPicker from './GraphPicker.jsx';
import { defaultGraph } from './GraphMapping.js';

class Picker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            alertText: null,
        };

        Object.assign(this.state, defaultGraph);

        this.gp = React.createRef();
        this.ge = React.createRef();
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
