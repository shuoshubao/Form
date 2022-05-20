import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { omit, pick, isObject, cloneDeep, noop, debounce } from 'lodash';
import { convertDataToEnum } from '@nbfe/tools';
import { getDisplayName } from './util';

class Index extends Component {
    static displayName = getDisplayName('Select');

    static defaultProps = {
        options: []
    };

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        allItem: PropTypes.object,
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
        const { remoteConfig, showSearch } = props;
        if (!isObject(remoteConfig)) {
            return;
        }
        if (showSearch) {
            return;
        }
        const { fetch: fetchFunc, process: processFunc = noop } = remoteConfig;
        const responseData = await fetchFunc();
        const options = convertDataToEnum(
            processFunc(responseData) || responseData,
            pick(remoteConfig, ['path', 'valueKey', 'labelKey'])
        );
        this.setState({ options });
    }

    handleSearch = async searchText => {
        const { remoteConfig } = this.props;
        const value = searchText.trim().replace(/'/g, '');
        if (!value) {
            this.setState({ options: [] });
            return;
        }
        const { fetch: fetchFunc, process: processFunc = noop } = remoteConfig;
        const responseData = await fetchFunc(value);
        const options = convertDataToEnum(
            processFunc(responseData) || responseData,
            pick(remoteConfig, ['path', 'valueKey', 'labelKey'])
        );
        this.setState({ options });
    };

    render() {
        const { props, state } = this;
        const { value, onChange, allItem, showSearch } = props;
        const { options } = state;
        const componentProps = omit(props, [
            'defaultValue',
            'value',
            'onChange',
            'onCustomChange',
            'options',
            'allItem',
            'remoteConfig'
        ]);
        if (showSearch) {
            componentProps.onSearch = debounce(this.handleSearch, 200);
        }
        return (
            <Select
                {...componentProps}
                value={value}
                onChange={val => {
                    onChange(val);
                    if (props.onCustomChange) {
                        props.onCustomChange();
                    }
                }}
            >
                {[allItem, ...options].filter(Boolean).map(v => {
                    const optionProps = pick(v, ['className', 'disabled', 'title', 'value']);
                    return (
                        <Select.Option key={v.value} {...optionProps}>
                            {v.label}
                        </Select.Option>
                    );
                })}
            </Select>
        );
    }
}

export default Index;
