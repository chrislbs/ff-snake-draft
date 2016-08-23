'use strict';

import React, { Component } from 'react';

export default class PathSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div className="path-section-wrapper">
                {children}
            </div>
        );
    }
}
