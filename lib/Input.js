import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';
import { isFunction, omit } from 'lodash';
import { setAsyncState } from '@nbfe/tools';
import { getDisplayName } from './util';

const SubInputMap = {
    input: Input,
    textarea: Input.TextArea,
    password: Input.Password,
    search: Input.Search
};

class Index extends Component {
    static displayName = getDisplayName('Input');

    static defaultProps = {};

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        onSearch: PropTypes.func,
        column: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            selectValue: null,
            inputValue: ''
        };
    }

    componentDidMount() {
        const { props, state, onSelectChange, onInputChange } = this;
        const { column, value, style } = props;
        const { selectValue, inputValue } = state;
        const { defaultValue, template } = column;
        const { inputType, options, selectWidth, inputWidth } = template;
        if (['select-search', 'select-input'].includes(inputType)) {
            if (defaultValue === '') {
                this.setState({
                    selectValue: options[0].value
                });
            }
            if (Array.isArray(defaultValue) && defaultValue.length === 2) {
                this.setState({
                    selectValue: defaultValue[0],
                    inputValue: defaultValue[1]
                });
            }
        }
    }

    onSelectChange = async value => {
        await setAsyncState(this, { selectValue: value });
        this.onChange();
    };

    onInputChange = async e => {
        await setAsyncState(this, { inputValue: e.target.value.trim() });
        this.onChange();
    };

    onSearch = () => {
        const { props, state } = this;
        const { onSearch } = props;
        if (!isFunction(onSearch)) {
            return;
        }
        onSearch();
    };

    onChange = () => {
        const { props, state } = this;
        const { onChange } = props;
        if (!isFunction(onChange)) {
            return;
        }
        const { column, value, style } = props;
        const { selectValue, inputValue } = state;
        const { template } = column;
        const { inputType } = template;
        if (['select-search', 'select-input'].includes(inputType)) {
            onChange([selectValue, inputValue]);
            return;
        }
        onChange(inputValue);
    };

    render() {
        const { props, state, onSelectChange, onInputChange, onSearch } = this;
        const { column, defaultValue, value, style } = props;
        const { selectValue, inputValue } = state;
        const { template } = column;
        const { inputType, options, selectWidth, inputWidth } = template;
        const componentProps = omit(props, [
            'column',
            'defaultValue',
            'value',
            'onChange',
            'onSearch',
            'style',
            'inputType',
            'inputWidth',
            'selectWidth'
        ]);
        componentProps.style = { width: inputWidth };
        if (['input', 'textarea', 'password', 'search'].includes(inputType)) {
            const InputComponent = SubInputMap[inputType];
            if (['input', 'search'].includes(inputType)) {
                componentProps.onPressEnter = () => {
                    onSearch();
                };
                if (['search'].includes(inputType)) {
                    componentProps.onSearch = () => {
                        onSearch();
                    };
                }
            }
            return (
                <InputComponent
                    {...componentProps}
                    defaultValue={defaultValue}
                    value={inputValue}
                    onChange={onInputChange}
                />
            );
        }
        if (['select-search', 'select-input'].includes(inputType)) {
            const { label } = options.find(v => v.value === selectValue) || {};
            return (
                <Input.Group compact>
                    <Select
                        disabled={props.disabled}
                        value={selectValue}
                        onChange={onSelectChange}
                        style={{ width: selectWidth }}
                    >
                        {options.map(v => {
                            return (
                                <Select.Option value={v.value} key={v.value}>
                                    {v.label}
                                </Select.Option>
                            );
                        })}
                    </Select>
                    {inputType === 'select-search' ? (
                        <Input.Search
                            {...componentProps}
                            value={inputValue}
                            onChange={onInputChange}
                            onSearch={() => {
                                onSearch();
                            }}
                            placeholder={['请输入', label].join('')}
                        />
                    ) : (
                        <Input
                            {...omit(componentProps, ['enterButton'])}
                            value={inputValue}
                            onChange={onInputChange}
                            placeholder={['请输入', label].join('')}
                        />
                    )}
                </Input.Group>
            );
        }
        return null;
    }
}

export default Index;
