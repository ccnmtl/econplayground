import React from 'react';

/**
 * GridOption is a re-usable component that creates <input> elements with
 * type="number" in order to define a range.
 */
export default class GridOption extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="col-6">
                    <label className="col-auto" key="dataId" htmlFor={this.props.label}>
                        <em>
                            {this.props.label + ' grid'}
                        </em>
                    </label>
                    <ul id={this.props.label} className="input-group mb-0 col-auto">
                        {['none', 'point', 'line'].map((item, key) => {
                            return (
                                <li key={key} className="list-group-item mx-1 mb-2">
                                    <label
                                        className={`btn btn-${
                                            key === this.props.value ?
                                                'primary' : 'light'}`}
                                        htmlFor={this.props.label + '-' + item}
                                    >{item}</label>
                                    <input
                                        className="btn-check"
                                        aria-label={this.props.label + '-' + item}
                                        id={this.props.label + '-' + item}
                                        data-id={this.props.label + '-' + item}
                                        name={this.props.id}
                                        type="radio"
                                        onChange={this.props.handler}
                                        value={key}
                                        checked={key === this.props.value}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
