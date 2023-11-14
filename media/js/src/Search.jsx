import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {authedFetch, getError, getQuestion} from './utils.js';


export default function Search({request, qId}) {
    const [objects, setObjects] = useState();
    const [search, setSearch] = useState();
    const [choice, setChoice] = useState();

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        if (search === undefined) {
            const me = this;
            if (qId) {
                getQuestion(qId).then(function(question) {
                    if (question.graph) {
                        setChoice(question.graph.pk);
                    }
                });
            }
            authedFetch(`/api/${request}`)
                .then(function(response) {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return response.json().then(function(d) {
                            me.setState({
                                alertText: getError(d)
                            });
                            window.scrollTo(0, 0);
                        });
                    }
                }).then(function(json) {
                    setObjects(json);
                });
            setSearch('');
        }
    }, [search]);

    if (objects) {
        let filteredObjects = objects;
        for (let term of search.split(' ')) {
            filteredObjects = filteredObjects.filter(a => a.title.toLowerCase().includes(term.toLowerCase()));
        }
        return (
            <div className='row'>
                <div className='col-4'>
                    <input className='form-control' type='text'
                        name='Search parameters for the graph list'
                        placeholder='Search' onChange={handleSearch}/>
                </div>
                <p className="text-center col-2 text-secondary mt-2 mb-0">
                    Results: {filteredObjects.length}
                </p>
                <div className='col-6'>
                    <select className='form-select' name='graph'
                        defaultValue={choice}
                        id='questionGraph-{{question.pk}}'
                    >
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
        );
    } else {
        return (<p>Loading . . .</p>);
    }
}

Search.propTypes = {
    request: PropTypes.string.isRequired,
    qId: PropTypes.number,
};
