import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import { omit, isObject, cloneDeep, noop, last } from 'lodash';
import { convertDataToEnum } from '@nbfe/tools';
import { getDisplayName } from './util';

class Index extends Component {
    static displayName = getDisplayName('Cascader');

    static defaultProps = {
        options: []
    };

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        loadData: PropTypes.object,
        remoteConfig: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            options: cloneDeep(props.options)
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
        const options = convertDataToEnum(processFunc(responseData) || responseData, remoteConfig);
        this.setState({ options });
    }

    render() {
        const { props, state } = this;
        const { value, onChange, loadData } = props;
        const { options } = state;
        const componentProps = omit(props, [
            'defaultValue',
            'value',
            'onChange',
            'onCustomChange',
            'options',
            'remoteConfig',
            'loadData'
        ]);
        if (loadData) {
            componentProps.loadData = async selectedOptions => {
                const { loadData: remoteConfig } = props;
                const targetOption = last(selectedOptions);
                targetOption.loading = true;
                const { fetch: fetchFunc, process: processFunc = noop } = remoteConfig;
                const responseData = await fetchFunc(selectedOptions, targetOption);
                targetOption.loading = false;
                const options = convertDataToEnum(processFunc(responseData) || responseData, remoteConfig);
                targetOption.children = options;
                this.setState({ options: [...this.state.options] });
            };
        }
        return (
            <Cascader
                {...componentProps}
                value={value}
                options={options}
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
