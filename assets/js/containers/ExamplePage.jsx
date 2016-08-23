'use strict';

import React, { Component, PropTypes } from 'react';
import BasePage from './BasePage';
import { Map, List, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { getExampleData } from '../actions';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import _ from 'lodash';

class ExamplePage extends BasePage {

    // Initial state
    state = {
        fetch_stack: List([])
    };

    constructor(props) {
        super(props);
    }

    fetchData = (args) => {
        const { getExampleData }  = this.props;

        // Default values to the values in props
        args = args || this.props.args;

        getExampleData(args);
    };

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillReceiveProps(nextProps) {
        const { example_data } = this.props;

        super.componentWillReceiveProps(nextProps);

        // Update the component state if the data has changed
        if (example_data !== nextProps.example_data) { 
            this.setState(() => {
                let new_state = {};
                return new_state;
            });
        } 
    }

    componentDidUpdate(prevProps, prevState) {
        const { fetching, url_query } = this.props;

        // If url parameters have changed, fetch data from the api
        if (prevProps.url_query !== url_query) {
            if (!fetching) {
                // Get the new report
                this.fetchData();
            } else {
                this.queueFetch(['args']);
            }
        }

        super.componentDidUpdate(prevProps, prevState);
    }

    render() {
        const { fetching, pathname, url_query, example_data } = this.props;

        const allDataLoaded = example_data !== null;

        const loadingWrapperClasses = classNames('loading-fade-wrapper', {loading: fetching});

        const loadingSpinner = fetching ? <img src="/public/img/spinner.gif" className="loading-spinner" alt="Loading..." /> : '';

        return (
            <div className="page-wrapper example-page-wrapper row">
                <div className={loadingWrapperClasses}>
                    <div className="col-xs-12 page-title">
                        <h1>Example Page</h1> 
                        <p>This is an example page</p>
                    </div>
                </div>
                {loadingSpinner}
            </div>
        );
    }
}

export default connect(
    // Redux state binding
    (state, ownProps) => {
        const fetching = state.example.get('fetching');

        return {
            fetching,
            example_data: state.example.get('data'),
            pathname: ownProps.location.pathname,
            url_query: ownProps.location.query
        };
    },
    { getExampleData, pushState: push }
)(ExamplePage);
