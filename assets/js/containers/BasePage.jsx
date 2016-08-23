'use strict';

import React, { Component } from 'react';
import { fromJS } from 'immutable';

/*********************************************************************************************************************
 * Base class for all Page containers to inherit from so that we can add common methods to all Page containers
 * in a single location (yey DRY).
 *********************************************************************************************************************/
export default class BasePage extends Component {

    constructor(props) {
        super(props);
    }

    queueFetch = (args) => {
        this.setState(({fetch_stack}) => {
            return {
                fetch_stack: fetch_stack.push(fromJS(args))
            };
        });
    };

    componentDidMount() {
        // Initial load of report data
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        const { fetching } = this.props;
        const { fetch_stack } = this.state;

        // If there is anything in the fetch stack after we finish fetching data, kick of a request
        // for the last item in the stack and throw away the rest
        if (fetching && !nextProps.fetching && fetch_stack.size) {
            const last_fetch = fetch_stack.get(fetch_stack.size-1).toJS();

            // clear the stack before fetching data
            this.setState(({fetch_stack}) => {
                return {
                    fetch_stack: fetch_stack.clear()
                };
            });

            this.fetchData(...last_fetch);
        }
    }

    componentDidUpdate(prevProps, prevState) {
    }
}
