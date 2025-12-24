import React from 'react';
import {forceFloat} from './utils.js';

export default class AreaDisplay extends React.Component {
    render() {
        if (!this.props.areaA && !this.props.areaB && !this.props.areaC) {
            return null;
        }

        if (this.props.areaConf === 5) {
            return (
                <div>
                    <span className="mx-2">
                        Area A ∪ B:
                        <strong>
                            {forceFloat(
                                this.props.areaA + this.props.areaB)}
                        </strong>
                    </span>
                    <span className="mx-2">
                        Area C: <strong>{this.props.areaC}</strong>
                    </span>
                </div>
            );
        } else if (this.props.areaConf === 6) {
            return (
                <div>
                    <span className="mx-2">
                        Area A: <strong>{this.props.areaA}</strong>
                    </span>
                    <span className="mx-2">
                        Area B ∪ C:
                        <strong>
                            {forceFloat(
                                this.props.areaB + this.props.areaC)}
                        </strong>
                    </span>
                </div>
            );
        }

        return (
            <div>
                <span className="mx-2">
                    Area A: <strong>{this.props.areaA}</strong>
                </span>
                <span className="mx-2">
                    Area B: <strong>{this.props.areaB}</strong>
                </span>
                <span className="mx-2">
                    Area C: <strong>{this.props.areaC}</strong>
                </span>
            </div>
        );
    }
}
