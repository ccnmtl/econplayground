import React from 'react';
import EditableControl from '../form-components/EditableControl.jsx';
import { handleFormUpdate } from '../utils.js';

export default class AreaConfiguration extends React.Component {
    render() {
        const me = this;
        return (
            <>
                <h3>Areas</h3>
                {this.props.displayLabels && (
                    <>
                        <div className="form-row align-items-end">
                            <div className="col-4">
                                <EditableControl
                                    id="gAreaAName"
                                    name="Area A label"
                                    value={this.props.gAreaAName}
                                    valueEditable={true}
                                    isInstructor={true}
                                    updateGraph={this.props.updateGraph} />
                            </div>
                            <div className="col-4">
                                <EditableControl
                                    id="gAreaBName"
                                    name="Area B label"
                                    value={this.props.gAreaBName}
                                    valueEditable={true}
                                    isInstructor={true}
                                    updateGraph={this.props.updateGraph} />
                            </div>
                            <div className="col-4">
                                <EditableControl
                                    id="gAreaCName"
                                    name="Area C label"
                                    value={this.props.gAreaCName}
                                    valueEditable={true}
                                    isInstructor={true}
                                    updateGraph={this.props.updateGraph} />
                            </div>
                        </div>
                    </>
                )}

                <div className="form-group d-flex flex-wrap">
                    {['A', 'B', 'C', 'A + B', 'B + C', 'A ∪ B', 'B ∪ C'].map(
                        function (el, idx) {
                            return (
                                <div className="d-flex form-check col-4" key={idx}>
                                    <label className="form-check-label">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id={`gAreaConfiguration-${idx}`}
                                            name="gAreaConfiguration"
                                            onChange={handleFormUpdate.bind(me)}
                                            checked={me.props.gAreaConfiguration === idx}
                                            value={idx}
                                        />
                                        {el}
                                    </label>
                                </div>
                            );
                        })}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <div className="form-check">
                            <label className="form-check-label">
                                <input
                                    id="gIsAreaDisplayed"
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleFormUpdate.bind(this)}
                                    checked={this.props.gIsAreaDisplayed} />
                                Show Area Shadow
                            </label>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
