import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { omit, pick, isObject, cloneDeep, noop } from 'lodash';
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
        const { remoteConfig } = props;
        if (!isObject(remoteConfig)) {
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

    render() {
        const { props, state } = this;
        const { value, onChange, allItem } = props;
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
