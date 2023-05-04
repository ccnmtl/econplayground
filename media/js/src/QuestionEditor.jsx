import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GraphPreview from './GraphPreview';
import { 
    importGraph, exportGraph, defaultEvaluation
} from './GraphMapping';
import {
    authedFetch, getError
} from './utils';


export default class QuestionEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title || 'Untitled',
            prompt: this.props.prompt || '',
            embedded_media: this.props.media || '',
            keywords: this.props.keywords || '',
            gId: this.props.gId,
            mediaUploadFilename: '',
            mediaUploadUrl: null
        };

        this.graphList = [];
        this.selectedGraph = null;
        const me = this;
        authedFetch('/api/graphs/').then(
            response => response.json()).then(
            data => {
                me.graphList = data;
                me.forceUpdate();
            }
        );
    }

    s3upload(mediaUploadFilename) {
        const me = this;
        const s3upload = new window.S3Upload({
            file_dom_selector: 'mediaUploadFilename',
            x_amz_acl: '',
            s3_sign_put_url: '/sign_s3/',
            s3_object_name: mediaUploadFilename,
            onFinishS3Put: function(url, privateUrl) {
                me.setState({mediaUploadUrl: url});
            },
            onError: function(status) {
                console.error('Upload error', status);
            }
        });
    }    

    handleFileChange(e) {
        this.s3upload(this.state.mediaUploadFilename);
    }
    
    handleSaveQuestion() {
        let data = exportGraph(this.state);
        const me = this;
        return authedFetch('/api/questions/', 'post', JSON.stringify(data))
            .then(function(response) {
                if (response.status === 201) {
                    me.setState({
                        alertText: null,
                        step: 2
                    });

                    return response.json().then(function(question) {
                        let url = `/question/${question.id}/`;
                        window.location.href = url;
                    });
                } else {
                    return response.json().then(function(d) {
                        me.setState({
                            alertText: getError(d)
                        });
                        window.scrollTo(0, 0);
                    });
                }
            });
    }

    render() {
        return (
            <div className="QuestionEditor container ">
                <h2>{this.state.title}</h2>
                <section id="text" className="container">
                    <label className="row align-items-baseline" htmlFor="q-title">
                        <h3 className="col-md-2 col-sm-3">Title</h3>
                        <input
                            className="col-md-6 col-sm mr-4"
                            id="q-title"
                            name="question-title"
                            defaultValue={this.state.title}
                            onChange={e => {this.setState({title: e.target.value});}}></input>
                    </label>
                    <label className="row align-items-baseline" htmlFor="prompt">
                        <h3 className="col-md-2 col-sm-3">Prompt</h3>
                        <textarea className="col mr-4 mb-2" id="prompt" placeholder="Describe the task"></textarea>
                    </label>
                    <label className="row align-items-baseline" htmlFor="keywords">
                        <h3 className="col-md-2 col-sm-3">Keywords</h3>
                        <textarea className="col mr-4 mb-2" id="keywords" placeholder="Use spaces to separate keywords"></textarea>
                    </label>
                </section>
                <section id="media" className="accordion">
                    <div className="card">
                        <div className="card-header py-0">
                            <label className="row align-items-baseline" htmlFor="q-media">
                                <h3 className="col-md-3 col-sm-4">Embedded Media</h3>
                                <input 
                                    className="col-md-6 col-sm-5"
                                    id="q-media"
                                    type="text"
                                    placeholder="Embed code"
                                ></input>
                                <button className="btn btn-light mx-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        onClick={() => {
                                            this.setState({media: document.getElementById('q-media').value});
                                        }}
                                    >
                                        <path d="M3.38 8A9.502 9.502 0 0 1 12 2.5a9.502 9.502 0 0 1 9.215 7.182.75.75 0 1 0 1.456-.364C21.473 4.539 17.15 1 12 1a10.995 10.995 0 0 0-9.5 5.452V4.75a.75.75 0 0 0-1.5 0V8.5a1 1 0 0 0 1 1h3.75a.75.75 0 0 0 0-1.5H3.38Zm-.595 6.318a.75.75 0 0 0-1.455.364C2.527 19.461 6.85 23 12 23c4.052 0 7.592-2.191 9.5-5.451v1.701a.75.75 0 0 0 1.5 0V15.5a1 1 0 0 0-1-1h-3.75a.75.75 0 0 0 0 1.5h2.37A9.502 9.502 0 0 1 12 21.5c-4.446 0-8.181-3.055-9.215-7.182Z"></path>
                                    </svg>
                                </button>
                                <button className="btn btn-light" type="button" data-toggle="collapse" data-target="#collapseMedia" aria-expanded="true" aria-controls="collapseMedia">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"></path><path d="M12 3.5c3.432 0 6.124 1.534 8.054 3.241 1.926 1.703 3.132 3.61 3.616 4.46a1.6 1.6 0 0 1 0 1.598c-.484.85-1.69 2.757-3.616 4.461-1.929 1.706-4.622 3.24-8.054 3.24-3.432 0-6.124-1.534-8.054-3.24C2.02 15.558.814 13.65.33 12.8a1.6 1.6 0 0 1 0-1.598c.484-.85 1.69-2.757 3.616-4.462C5.875 5.034 8.568 3.5 12 3.5ZM1.633 11.945a.115.115 0 0 0-.017.055c.001.02.006.039.017.056.441.774 1.551 2.527 3.307 4.08C6.691 17.685 9.045 19 12 19c2.955 0 5.31-1.315 7.06-2.864 1.756-1.553 2.866-3.306 3.307-4.08a.111.111 0 0 0 .017-.056.111.111 0 0 0-.017-.056c-.441-.773-1.551-2.527-3.307-4.08C17.309 6.315 14.955 5 12 5 9.045 5 6.69 6.314 4.94 7.865c-1.756 1.552-2.866 3.306-3.307 4.08Z"></path>
                                    </svg>
                                </button>
                            </label>
                        </div>
                        <div id="collapseMedia" className="collapse show" aria-labelledby="media" data-parent="#media">
                            {this.showMedia(this.state.media)}
                        </div>
                    </div>
                </section>

                <section>
                    <label className="row align-items-baseline">
                        <h3 className="col-md-3 col-sm-4">Image / PDF</h3>
                        <input
                            id="mediaUploadFilename"
                            className="form-control" type="file"
                            value={this.state.mediaUploadFilename}
                            onChange={this.handleFileChange.bind(this)}
                        ></input>
                    </label>
                    {this.state.mediaUploadUrl && (
                        <img className="img-thumbnail"
                             style={{
                                 maxWidth: '200px',
                                 maxHeight: '200px'
                             }}
                             src={this.state.mediaUploadUrl} />
                    )}
                </section>
                
                <section id="graph">
                    <h3>Graph</h3>
                    <div className="row">
                        <div className="row col btn-group btn-group-toggle align-items-center justify-content-center" data-toggle="buttons" style={{height: '25rem', overflow: 'auto'}}>
                            {this.generateGraphList()}
                        </div>
                        <div className="col-8 bg-light rounded d-flex align-items-center justify-content-center">
                            {this.showGraph()}
                        </div>
                    </div>
                </section>
                <section id="grading">
                    <h3>Evaluation and Scoring</h3>
                    <ul>
                        {this.displayParameters()}
                    </ul>
                </section>

            </div>
        );
    }

    displayParameters() {
        console.log('In displayParameters');
        if (this.selectedGraph == null) {
            return (
                <em className="text-secondary">Select a graph to configure the evaluation scheme.</em>
            );
        } else {
            console.log(Object.keys(this.selectedGraph));
            return Object.keys(defaultEvaluation).map((prop, index) => {
                if (this.selectedGraph[prop] !== defaultEvaluation[prop]) {
                    return (
                        <li key={index} className="row bg-light align-items-end my-2">
                            <h3 className="col">{prop}</h3>
                            <label className="col">
                                Correct Adjustment
                                <select className="form-control">
                                    <option>None</option>
                                    <option>Negative</option>
                                    <option>Positive</option>
                                </select>
                            </label>
                            <label className="col">
                                Score
                                <input
                                    className="mx-2"
                                    type="number"
                                    name={prop + ' score'}
                                    defaultValue="1"
                                    onClick={e => {
                                        this.setState({index: e.target.value});
                                    }}
                                />
                            </label>
                        </li>)
                    ;
                }
            });
        }
    }

    generateGraphList() {
        if (this.graphList.length === 0) {
            return (
                <div className="spinner-border text-secondary mx-auto" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            );
        } else {
            return this.graphList.map((graph, index) =>
                <label key={index} className="btn btn-light col-12">
                    <input
                        type="radio"
                        name={graph.title}
                        value={graph.id}
                        onClick={e => {
                            this.selectedGraph = graph;
                            importGraph(this.selectedGraph, this);
                        }} />
                    {graph.title}
                </label>
            );
        }
    }

    showGraph() {
        if (this.selectedGraph) {
            return <GraphPreview {...this.state} />;
        } else {
            return <em className="text-secondary text-center">--No Graph--</em>;
        }
    }
    
    showMedia(media) {
        if (media) {
            return (
                <div 
                    className="card-body px-0 pt-0"
                    width="100%"
                    style={{
                        paddingBottom: '56.25%',  // Preserves 16:9 video ratio
                        position: 'relative'
                    }}
                >
                    <iframe
                        width="100%"
                        height="100%"
                        style={{
                            border: 'none',
                            position: 'absolute'
                        }}
                        src={media}
                        title="Question Media"
                        allowFullScreen>
                    </iframe>
                </div>
            ); 
        } else {
            return (
                <div className="card-body">
                    <em className="text-secondary">No media</em>
                </div>
            );
        }
    }
}

QuestionEditor.propTypes = {
    title: PropTypes.string,
    prompt: PropTypes.string,
    media: PropTypes.string,
    keywords: PropTypes.string,
    gId: PropTypes.number,
};
