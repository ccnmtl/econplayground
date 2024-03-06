import React, { Component } from 'react';
import GraphPreview from './GraphPreview.jsx';
import { 
    convertGraph, defaultEvaluation, defaultLabelEvaluation, defaultModificationEvaluation
} from './GraphMapping.js';
import {
    authedFetch, getError, getGraph, getQuestion, getEvaluations, forceNumber
} from './utils.js';


export default class QuestionEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            prompt: '',
            embedded_media: '',
            keywords: '',
            graph: null,
            mediaUploadFilename: '',
            mediaUploadUrl: null,
            evaluations: [],
            showGraph: true,
            showMedia: true,
        };
        this.graphDisplay = {};
        this.qId;
        this.graphList = [];
        const me = this;
        authedFetch('/api/graphs/').then(
            response => response.json()).then(
            data => {
                me.graphList = data;
                me.forceUpdate();
            }
        );

        if (window.location.pathname.includes('edit')) {
            this.qId = window.location.pathname.slice(10,-6);  //  /question/<int:id>/edit/
            getQuestion(this.qId).then(
                data => {
                    me.setState(data);
                    if(data.graph) {
                        getGraph(data.graph).then(
                            graph => {
                                me.graphDisplay = convertGraph(graph);
                                me.forceUpdate();
                            });
                    }
                }
            );
            getEvaluations(this.qId).then(
                response => response.json()).then(
                data => {
                    me.setState({'evaluations': data});
                }
            );
        }
    }

    s3upload(mediaUploadFilename) {
        const me = this;
        const s3upload = new window.S3Upload({  // eslint-disable-line
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

    sendError(response) {
        const me = this;
        return response.json().then(function(d) {
            me.setState({
                alertText: getError(d)
            });
            window.scrollTo(0, 0);
        });
    }
    
    handleSaveQuestion() {
        const me = this;
        let url = '/api/questions/';
        let sendTo = '/question/';
        let method;
        if (this.qId) {
            method = 'put';
            url = url + this.qId + '/';
            sendTo = sendTo + this.qId + '/';
        } else {
            method = 'post';
        }
        
        const evalList = Object.values(this.state.evaluations);
        this.setState(
            {
                'evaluations': evalList,
                'value': evalList.reduce((a,b) => a + b.value, 0)
            },
            () => {
                authedFetch(url, method, JSON.stringify(this.state))
                    .then(function(response) {
                        if (response.status === 200) {
                            me.setState({
                                alertText: null,
                            });
                            return response.json().then(function() {                     
                                location.href = sendTo;
                            });
                        } else {
                            return me.sendError(response);
                        }
                    });
            }
        );
    }

    render() {
        return (
            <div className="QuestionEditor container">
                <h2>{this.state.title}</h2>
                <section id="text" className="container">
                    <label className="row align-items-baseline" htmlFor="q-title">
                        <h3 className="col-md-2 col-sm-3">Title</h3>
                        <input
                            className="col-md-6 col-sm mr-4"
                            id="q-title"
                            name="question-title"
                            value={this.state.title}
                            onChange={e => {this.setState({title: e.target.value});}}></input>
                    </label>
                    <label className="row align-items-baseline" htmlFor="prompt">
                        <h3 className="col-md-2 col-sm-3">Prompt</h3>
                        <textarea
                            className="col mr-4 mb-2"
                            id="prompt"
                            placeholder="Describe the task"
                            value={this.state.prompt}
                            onChange={e => {this.setState({prompt: e.target.value});}}></textarea>
                    </label>
                    <label className="row align-items-baseline" htmlFor="keywords">
                        <h3 className="col-lg-2 col-md-3 col-sm-4 text-break">Keywords</h3>
                        <textarea 
                            className="col mr-4 mb-2"
                            id="keywords"
                            placeholder="Use spaces to separate keywords"
                            value={this.state.keywords}
                            onChange={e => {this.setState({keywords: e.target.value});}}></textarea>
                    </label>
                </section>
                <section id="file" className="container mb-4">
                    <label className="row align-items-baseline">
                        <h3 className="col-md-3 col-sm-4">Image / PDF</h3>
                        <input
                            id="mediaUploadFilename"
                            className="form-control" type="file"
                            onChange={this.handleFileChange.bind(this)}
                        ></input>
                    </label>
                    {this.state.mediaUploadUrl && (
                        <img className="img-thumbnail" alt="Uploaded Media"
                            style={{
                                maxWidth: '200px',
                                maxHeight: '200px'
                            }}
                            src={this.state.mediaUploadUrl} />
                    )}
                </section>
                <div className="accordion">
                    <section id="media" className="card">
                        <div className="card-header py-0">
                            <label className="row align-items-baseline" htmlFor="q-media">
                                <h3 className="col-md-3 col-sm-4">Embedded Media</h3>
                                <div className="col-md-6 col-sm-5 mr-auto">
                                    <input 
                                        className="col"
                                        id="q-media"
                                        type="text"
                                        placeholder="Embed code"
                                        defaultValue={this.state.embedded_media}
                                    ></input>
                                </div>
                                <button className="btn btn-light mx-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        onClick={() => {
                                            this.setState({embedded_media: document.getElementById('q-media').value});
                                        }}
                                    >
                                        <path d="M3.38 8A9.502 9.502 0 0 1 12 2.5a9.502 9.502 0 0 1 9.215 7.182.75.75 0 1 0 1.456-.364C21.473 4.539 17.15 1 12 1a10.995 10.995 0 0 0-9.5 5.452V4.75a.75.75 0 0 0-1.5 0V8.5a1 1 0 0 0 1 1h3.75a.75.75 0 0 0 0-1.5H3.38Zm-.595 6.318a.75.75 0 0 0-1.455.364C2.527 19.461 6.85 23 12 23c4.052 0 7.592-2.191 9.5-5.451v1.701a.75.75 0 0 0 1.5 0V15.5a1 1 0 0 0-1-1h-3.75a.75.75 0 0 0 0 1.5h2.37A9.502 9.502 0 0 1 12 21.5c-4.446 0-8.181-3.055-9.215-7.182Z"></path>
                                    </svg>
                                </button>
                                <button 
                                    className="btn btn-light"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#collapseMedia"
                                    aria-expanded="true"
                                    aria-controls="collapseMedia"
                                    onClick={() => {this.setState({showMedia: !this.state.showMedia});}}
                                >
                                    {this.toggleEye(this.state.showMedia)}
                                </button>
                            </label>
                        </div>
                        <div id="collapseMedia" className="collapse show" aria-labelledby="media" data-parent="#media">
                            {this.displayMedia(this.state.embedded_media)}
                        </div>
                    </section>
                    <section id="graph" className="card" style={{overflow: 'visible'}}>
                        <div className="card-header row align-items-end px-1 pt-0 mx-0">
                            <h3 className="mx-3">Graph</h3>
                            <div className="dropup mr-2">
                                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                    {this.graphDisplay.gTitle ? this.graphDisplay.gTitle : 'Select a graph from the list'}
                                </button>
                                <div className="dropdown-menu overflow-auto" style={{width: '50rem', maxHeight: '40rem', overflow: 'auto'}}>
                                    {this.generateGraphList()}
                                </div>
                            </div>
                            <button
                                className="btn btn-light"
                                type="button"
                                data-toggle="collapse"
                                data-target="#collapseGraph"
                                aria-expanded="true"
                                aria-controls="collapseGraph"
                                onClick={() => {this.setState({showGraph: !this.state.showGraph});}}
                            >
                                {this.toggleEye(this.state.showGraph)}
                            </button>
                        </div>
                        <div id="collapseGraph" className="collapse show" aria-labelledby="graph" data-parent="#graph">
                            <div className="card-body d-flex align-items-center justify-content-center">
                                {this.displayGraph()}
                            </div>
                        </div>
                    </section>
                </div>
                <section id="grading">
                    <h3>Evaluation and Scoring</h3>
                    <ul>
                        {this.displayParameters()}
                    </ul>
                </section>
                <div className="row">
                    <button className="btn btn-primary mr-2" onClick={this.handleSaveQuestion.bind(this)}>Save</button>
                    <button className="btn btn-secondary mr-auto" onClick={this.handleSaveQuestion.bind(this)}>Save and View</button>
                    {this.displayEditFunctions()}
                    
                </div>
            </div>
        );
    }

    displayEditFunctions() {
        if (window.location.pathname.includes('edit')) {
            return (
                <React.Fragment>
                    <a className="btn btn-primary ml-2" href={window.location.pathname.replace('edit', 'clone')}>
                        <svg alt="" height="32" className="mr-1 octicon octicon-repo-clone" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
                            <path fillRule="evenodd" d="M15 0H9v7c0 .55.45 1 1 1h1v1h1V8h3c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1zm-4 7h-1V6h1v1zm4 0h-3V6h3v1zm0-2h-4V1h4v4zM4 5H3V4h1v1zm0-2H3V2h1v1zM2 1h6V0H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h2v2l1.5-1.5L6 16v-2h5c.55 0 1-.45 1-1v-3H2V1zm9 10v2H6v-1H3v1H1v-2h10zM3 8h1v1H3V8zm1-1H3V6h1v1z"></path>
                        </svg>
                        Clone Question
                    </a>
                    <a className="btn btn-danger ml-2" href={window.location.pathname.replace('edit', 'delete')}>
                        <svg alt="" height="32" className="mr-1 octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="24" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path>
                        </svg>
                        Delete Question
                    </a>
                </React.Fragment>
            );
        }
    }

    generateLabel(prop, graph) {
        let label = prop;
        let propRoot = prop.split('_');
        let propType = propRoot.pop();
        if (propType === 'slope') {
            label = graph[`${propRoot.join('_')}_label`];
        } else if (propRoot[0] === 'cobb') {
            label = graph[`${prop}_name`];
        } else if (prop.length < 3) {
            // TODO: Resolve labeling for a1 - a5, a, k, r, y1, y2, alpha, omega
        }
        return label.length === 0 ? prop : label;
    }

    displayParameters() {
        if (this.state.graph == null || this.graphList.length === 0) {
            return (
                <em className="text-secondary">Select a graph to configure the evaluation scheme.</em>
            );
        } else {
            let graph = this.graphList.find(graph => graph.id === this.state.graph);
            let compareDefault;
            if (this.graphDisplay.gAssignmentType === 1) {
                compareDefault = defaultLabelEvaluation;
            } else if (this.graphDisplay.gAssignmentType === 2) {
                compareDefault = defaultModificationEvaluation;
            } else {
                compareDefault = defaultEvaluation;
            }
            return Object.keys(compareDefault).map((prop, index) => {
                let graphProp = graph[prop];
                // This condition isn't for error checking, but for converting number strings into Number objects for comparison 
                if (graphProp && isNaN(graphProp) ? graphProp : Number(graphProp) !== compareDefault[prop]) {
                    let field = this.state.evaluations.find(thisEval => thisEval.field === prop) || {};
                    let label = this.generateLabel(prop, graph);
                    return (
                        <li key={index} className="row bg-light align-items-end my-2">
                            <h4 className="col">{label}</h4>
                            <label className="col">
                                Correct Adjustment
                                <select
                                    id={label + '_adjust'}
                                    className="form-control"
                                    defaultValue={field.comparison || 'None'}
                                    name="correct adjustment"
                                    onChange={(e) => {
                                        let update = this.state.evaluations.filter(e => e.field !== prop);
                                        update.push({
                                            'field': label,
                                            'comparison': e.target.value,
                                            'value': forceNumber(document.getElementById(label + '_score').value) || 1
                                        });
                                        this.setState({'evaluations': update});
                                    }}
                                >
                                    <option value="0">None</option>
                                    <option value="-1">Negative</option>
                                    <option value="1">Positive</option>
                                </select>
                            </label>
                            <label className="col">
                                Score
                                <input
                                    id={label + '_score'}
                                    className="mx-2"
                                    type="number"
                                    name={label + ' score'}
                                    defaultValue={field.value || '0'}
                                    onChange={(e) => {
                                        let update = this.state.evaluations.filter(e => e.field !== prop);
                                        update.push({
                                            'field': label, 
                                            'comparison': document.getElementById(label + '_adjust').value || 'None',
                                            'value': forceNumber(e.target.value)
                                        });
                                        this.setState({'evaluations': update});
                                    }}
                                />
                            </label>
                        </li>
                    );
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
                <button 
                    className="dropdown-item"
                    key={index}
                    type="radio"
                    name={graph.title}
                    value={graph.id}
                    onClick={() => {
                        this.setState({graph: graph.id});
                        
                        this.graphDisplay = convertGraph(graph);
                    }}
                >
                    {graph.title}
                </button>
            );
        }
    }

    displayGraph() {
        if (this.state.graph) {
            return <GraphPreview {...this.graphDisplay} />;
        } else {
            return <em className="text-secondary text-center">--No Graph--</em>;
        }
    }
    
    displayMedia(media) {
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

    toggleEye(target) {
        if (target) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"></path>
                    <path d="M12 3.5c3.432 0 6.124 1.534 8.054 3.241 1.926 1.703 3.132 3.61 3.616 4.46a1.6 1.6 0 0 1 0 1.598c-.484.85-1.69 2.757-3.616 4.461-1.929 1.706-4.622 3.24-8.054 3.24-3.432 0-6.124-1.534-8.054-3.24C2.02 15.558.814 13.65.33 12.8a1.6 1.6 0 0 1 0-1.598c.484-.85 1.69-2.757 3.616-4.462C5.875 5.034 8.568 3.5 12 3.5ZM1.633 11.945a.115.115 0 0 0-.017.055c.001.02.006.039.017.056.441.774 1.551 2.527 3.307 4.08C6.691 17.685 9.045 19 12 19c2.955 0 5.31-1.315 7.06-2.864 1.756-1.553 2.866-3.306 3.307-4.08a.111.111 0 0 0 .017-.056.111.111 0 0 0-.017-.056c-.441-.773-1.551-2.527-3.307-4.08C17.309 6.315 14.955 5 12 5 9.045 5 6.69 6.314 4.94 7.865c-1.756 1.552-2.866 3.306-3.307 4.08Z"></path>
                </svg>);
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M8.052 5.837A9.715 9.715 0 0 1 12 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.11.11 0 0 1 .016.055.122.122 0 0 1-.017.06 16.766 16.766 0 0 1-1.53 2.218.75.75 0 1 0 1.163.946 18.253 18.253 0 0 0 1.67-2.42 1.607 1.607 0 0 0 .001-1.602c-.485-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5c-1.695 0-3.215.374-4.552.963a.75.75 0 0 0 .604 1.373Zm11.114 12.15C17.328 19.38 14.933 20.5 12 20.5c-3.432 0-6.125-1.534-8.054-3.24C2.02 15.556.814 13.648.33 12.798a1.606 1.606 0 0 1 .001-1.6A18.283 18.283 0 0 1 3.648 7.01L1.317 5.362a.75.75 0 1 1 .866-1.224l20.5 14.5a.75.75 0 1 1-.866 1.224ZM4.902 7.898c-1.73 1.541-2.828 3.273-3.268 4.044a.112.112 0 0 0-.017.059c0 .015.003.034.016.055.441.774 1.551 2.527 3.307 4.08C6.69 17.685 9.045 19 12 19c2.334 0 4.29-.82 5.874-1.927l-3.516-2.487a3.5 3.5 0 0 1-5.583-3.949L4.902 7.899Z"></path>
                </svg>
            );
        }
    }
}
