import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { omit, pick, last, isNumber } from 'lodash';
import { Select } from 'antd';
import { getDisplayName } from './util.jsx';

class Index extends PureComponent {
    static displayName = getDisplayName('Select');

    static defaultProps = {};

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        allItem: PropTypes.object,
        remoteConfig: PropTypes.object
    };

    render() {
        const { props } = this;
        const { value, onChange, options, allItem } = props;
        const selectProps = omit(props, [
            'defaultValue',
            'value',
            'onChange',
            'onCustomChange',
            'allItem',
            'remoteConfig'
        ]);
        return (
            <Select
                {...selectProps}
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
