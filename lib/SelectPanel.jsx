import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Tag } from 'antd';
import { isFunction, omit } from 'lodash';
import { setAsyncState } from '@nbfe/tools';
import { defaultColumn, searchSeparator } from './config';

class Index extends Component {
    static displayName = 'SearchSelectPanel';

    static defaultProps = {};

    static propTypes = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    onChange = () => {
        if (!isFunction(this.props.onChange)) {
            return;
        }
        this.props.onChange();
    };

    render() {
        const { props, state } = this;
        return (
            <div>
                <Divider orientation="left">已选</Divider>
            </div>
        );
    }
}

export default Index;
