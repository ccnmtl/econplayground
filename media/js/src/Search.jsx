import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {getQuestion, getStep} from './utils.js';


export default function Search({request, parentId}) {
    const objects = window.SearchJSON;
    const [search, setSearch] = useState('');
    const [choice, setChoice] = useState();

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        if (parentId) {
            console.log(request);
            if (request === 'steps') {
                getStep(parentId).then(function(step) {
                    if (step.question) {
                        setChoice(step.question.pk);
                    }
                });
            } else {
                getQuestion(parentId).then(function(question) {
                    if (question.graph) {
                        setChoice(question.graph.pk);
                    }
                });
            }
        }
    }, []);

    let filteredObjects = objects;
    for (let term of search.split(' ')) {
        filteredObjects = filteredObjects.filter(a => a.title.toLowerCase().includes(term.toLowerCase()));
    }

    return (<div>
        {console.log(choice)}
        {request === 'steps' ?
            <div className='row'>
                <input 
                    className=
                        {'col-12 mb-2 form-control form-control-sm ep-question'}
                    type='text' name='Search parameters for the graph list'
                    placeholder='Filter' onChange={handleSearch}/>
                <select
                    className='col-12 form-select form-select-sm ep-question'
                    name={`question_step_${parentId}`}
                    defaultValue={typeof choice ==='string' ? choice : ''}
                    id={`stepQuestion-${parentId}`}>
                    <option value=''>{'No Question'}</option>
                    {filteredObjects.map((question, i) => 
                        <option key={i} value={question.id}
                            data-graphtype={question.graph_type}
                            data-pk={question.pk}
                        >
                            {question.title}
                        </option>
                    )}
                </select>
            </div>
            :
            <div className='row'>
                <div className='col-4'>
                    <input 
                        className={'col-4 form-control'}
                        type='text' name='Search parameters for the graph list'
                        placeholder='Filter' onChange={handleSearch}/>
                </div>
                <p className='col-2 text-center text-secondary mt-2 mb-0 p-0'>
                    {'Found: ' + filteredObjects.length}
                </p>
                <div className='col-6'>
                    <select className={'col-6 form-select'} name={'graph'}
                        defaultValue={choice}
                        id={`questionGraph-${parentId}`}>
                        <option value=''>{'No Graph'}</option>
                        {filteredObjects.map((graph, i) => 
                            <option key={i} value={graph.id}
                                data-graphtype={graph.graph_type}
                                data-pk={graph.id}
                            >
                                {graph.title}
                            </option>
                        )}
                    </select>
                </div>
            </div>
        }
    </div>);
}

Search.propTypes = {
    request: PropTypes.string.isRequired,
    parentId: PropTypes.number,
};
