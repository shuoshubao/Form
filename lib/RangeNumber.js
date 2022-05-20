import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Input, Select } from 'antd';
import { isFunction, omit } from 'lodash';
import { isEveryTruthy, isEmptyValue, setAsyncState } from '@nbfe/tools';
import { searchSeparator } from './config';
import { getDisplayName, getClassNames } from './util';

class Index extends Component {
    static displayName = getDisplayName('RangeNumber');

    static defaultProps = {
        separator: '~',
        separatorWidth: 30
    };

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        column: PropTypes.object,
        separator: PropTypes.string, // 分割符
        separatorWidth: PropTypes.number // 分割符宽度
    };

    constructor(props) {
        super(props);
        const value = props.value || [];
        this.state = {
            minValue: value[0],
            maxValue: value[1]
        };
    }

    onInputChange() {
        const { props, state } = this;
        const { onChange, column } = props;
        const { minValue, maxValue } = state;
        // 反转
        const isNeedReverse = isEveryTruthy(!isEmptyValue(minValue), !isEmptyValue(maxValue), minValue > maxValue);
        if (isNeedReverse) {
            onChange([maxValue, minValue]);
        } else {
            onChange([minValue, maxValue]);
        }
        if (this.props.onCustomChange) {
            this.props.onCustomChange();
        }
    }

    render() {
        const { props, state } = this;
        const { column, separator, separatorWidth } = props;
        const { minValue, maxValue } = state;
        const { placeholder, template } = column;
        const inputWidth = (template.width - separatorWidth) / 2;

        const componentProps = omit(template, ['defaultValue', 'value', 'onChange', 'tpl', 'width', 'separator']);

        return (
            <Input.Group compact className={getClassNames('range-number')}>
                <InputNumber
                    disabled={props.disabled}
                    value={minValue}
                    onChange={async value => {
                        await setAsyncState(this, { minValue: value });
                        this.onInputChange();
                    }}
                    className={getClassNames('range-number-min')}
                    style={{
                        width: inputWidth
                    }}
                    {...componentProps}
                    placeholder={placeholder.split(',')[0]}
                />
                <Input
                    disabled
                    className={getClassNames('range-number-separator')}
                    style={{
                        width: separatorWidth
                    }}
                    placeholder={separator}
                />
                <InputNumber
                    disabled={props.disabled}
                    value={maxValue}
                    onChange={async value => {
                        await setAsyncState(this, { maxValue: value });
                        this.onInputChange();
                    }}
                    className={getClassNames('range-number-max')}
                    style={{
                        width: inputWidth
                    }}
                    {...componentProps}
                    placeholder={placeholder.split(',')[1]}
                />
            </Input.Group>
        );
    }
}

export default Index;
