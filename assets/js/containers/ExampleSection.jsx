'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/*********************************************************************************************************************
 * Simple component that just renders it's children wrapped in a div. Using components like this allows to
 * break our URLs up so that we can categorize them more logically. For example:
 *
 *      /example/page-1/
 *      /example/page-2/
 *      /example-2/page-1/
 *      /example-2/page-2/
 *
 * is better than:
 *
 *      /example-page-1/
 *      /example-page-2/
 *      /example-2-page-1/
 *      /example-2-page-2/
 *********************************************************************************************************************/
class ExampleSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div className="section-wrapper">
                {children}
            </div>
        );
    }
}

export default connect(
    (state) => {
        return {
        };
    }
)(ExampleSection);
