import React from 'react';
import PropTypes from 'prop-types';
import {forceFloat} from './utils';

export default class AreaDisplay extends React.Component {
    render() {
        if (!this.props.areaA && !this.props.areaB && !this.props.areaC) {
            return null;
        }

        if (this.props.areaConf === 5) {
            return (
                <div>
                    <span className="mr-2">
                        Area A ∪ B: <strong>
                                        {forceFloat(
                                            this.props.areaA + this.props.areaB)}
                                    </strong>
                    </span>
                    <span>
                        Area C: <strong>{this.props.areaC}</strong>
                    </span>
                </div>
            );
        } else if (this.props.areaConf === 6) {
            return (
                <div>
                    <span className="mr-2">
                        Area A: <strong>{this.props.areaA}</strong>
                    </span>
                    <span className="mr-2">
                        Area B ∪ C: <strong>
                                        {forceFloat(
                                            this.props.areaB + this.props.areaC)}
                                    </strong>
                    </span>
                </div>
            );
        }

        return (
            <div>
                <span className="mr-2">
                    Area A: <strong>{this.props.areaA}</strong>
                </span>
                <span className="mr-2">
                    Area B: <strong>{this.props.areaB}</strong>
                </span>
                <span>
                    Area C: <strong>{this.props.areaC}</strong>
                </span>
            </div>
        );
    }
}

AreaDisplay.propTypes = {
    areaConf: PropTypes.number.isRequired,
    areaA: PropTypes.number.isRequired,
    areaB: PropTypes.number.isRequired,
    areaC: PropTypes.number.isRequired
};
