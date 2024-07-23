import React from 'react';
import PropTypes from 'prop-types';
import {getCohortId, getTopics, handleFormUpdate} from '../utils.js';

/**
 * This component contains the form fields for assignment type,
 * and visibility settings.
 */
export default class CommonGraphSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topics: []
        };

        const me = this;
        getTopics(
            getCohortId(window.location.pathname)
        ).then(function(topics) {
            me.setState({
                topics: topics['topic_set']
            });

            // After getting the topics, set the graph's topic to the
            // first one available, if it needs one.
            if (!me.props.gTopic && topics['topic_set'].length > 0) {
                me.props.updateGraph({
                    gTopic: topics['topic_set'][0].pk
                });
            }
        });
    }
    render() {
        const assessmentUrl =
            (window.EconPlayground && window.EconPlayground.assessmentUrl) ||
            '/admin/main/assessment';

        return (
            <div>
                <h3>Assignment</h3>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="gAssignmentType">
                                Type
                            </label>
                            <select
                                id="gAssignmentType"
                                className="form-select"
                                onChange={handleFormUpdate.bind(this)}
                                value={this.props.gAssignmentType}>
                                <option value="0">Template assignment</option>
                                <option value="1">Labeling assignment</option>
                                <option value="2">Modification assignment</option>
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="gTopic">
                                Topic
                            </label>
                            <select
                                id="gTopic"
                                className="form-select"
                                onChange={handleFormUpdate.bind(this)}
                                value={this.props.gTopic || 0}>
                                {this.state.topics.map(e => (
                                    <option key={e.pk} value={e.pk}>{e.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-check">
                            <label className="form-check-label">
                                <input
                                    id="gDisplayFeedback"
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleFormUpdate.bind(this)}
                                    checked={this.props.gDisplayFeedback} />
                                Display feedback
                            </label>
                        </div>
                        {this.props.enableIntersectionToggle && (
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input
                                        id="gShowIntersection"
                                        className="form-check-input"
                                        type="checkbox"
                                        onChange={handleFormUpdate.bind(this)}
                                        checked={this.props.gShowIntersection} />
                                    Display intersection
                                </label>
                            </div>
                        )}
                        <div className="form-check">
                            <label className="form-check-label">
                                <input
                                    id="gIsPublished"
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleFormUpdate.bind(this)}
                                    checked={this.props.gIsPublished} />
                                Published
                            </label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-check">
                            <label className="form-check-label">
                                <input
                                    id="gIsFeatured"
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleFormUpdate.bind(this)}
                                    checked={this.props.gIsFeatured} />
                                Featured
                            </label>
                        </div>
                        <div className="form-check">
                            <label className="form-check-label">
                                <input
                                    id="gDisplayShadow"
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleFormUpdate.bind(this)}
                                    checked={this.props.gDisplayShadow} />
                                Display shadow on student view
                            </label>
                        </div>
                        <div className="form-check">
                            <label className="form-check-label">
                                <input
                                    id="gNeedsSubmit"
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleFormUpdate.bind(this)}
                                    checked={this.props.gNeedsSubmit} />
                                LTI assessment
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        role="button"
                        className="btn btn-sm btn-primary me-2"
                        title="Feedback and Assessment editor"
                        href={assessmentUrl}>
                        Feedback and Assessment editor
                    </a>
                    <a
                        target="_blank"
                        className="text-decoration-none align-text-top"
                        href="/help/assessment/"
                        title="Assessment Documentation">
                        Assessment info <i className="bi bi-info-circle"></i>
                    </a>
                </div>
                <hr/>
            </div>
        );
    }
}

CommonGraphSettings.defaultProps = {
    enableIntersectionToggle: true
};

CommonGraphSettings.propTypes = {
    enableIntersectionToggle: PropTypes.bool,

    gAssignmentType: PropTypes.number.isRequired,
    gNeedsSubmit: PropTypes.bool.isRequired,
    gDisplayFeedback: PropTypes.bool.isRequired,
    gShowIntersection: PropTypes.bool.isRequired,
    gDisplayShadow: PropTypes.bool.isRequired,
    gIsPublished: PropTypes.bool.isRequired,
    gIsFeatured: PropTypes.bool.isRequired,
    gTopic: PropTypes.number,

    updateGraph: PropTypes.func.isRequired
};
