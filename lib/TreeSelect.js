import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd';
import { omit, isObject, cloneDeep, noop } from 'lodash';
import { getDisplayName } from './util';

class Index extends Component {
    static displayName = getDisplayName('TreeSelect');

    static defaultProps = {};

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        remoteConfig: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            treeData: cloneDeep(props.treeData)
        };
    }

    async componentDidMount() {
        const { props } = this;
        const { remoteConfig } = props;
        if (!isObject(remoteConfig)) {
            return;
        }
        const { fetch: fetchFunc, process: processFunc = noop } = remoteConfig;
        const responseData = await fetchFunc();
        const treeData = processFunc(responseData) || responseData;
        this.setState({ treeData });
    }

    render() {
        const { props, state } = this;
        const { value, onChange } = props;
        const { treeData } = state;
        const componentProps = omit(props, [
            'defaultValue',
            'value',
            'onChange',
            'onCustomChange',
            'treeData',
            'remoteConfig'
        ]);
        return (
            <TreeSelect
                {...componentProps}
                value={value}
                treeData={treeData}
                onChange={val => {
                    onChange(val);
                    if (props.onCustomChange) {
                        props.onCustomChange();
                    }
                }}
            />
        );
    }
}

export default Index;
