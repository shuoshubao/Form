import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';
import { isFunction, omit } from 'lodash';
import { setAsyncState } from '@nbfe/tools';
import { defaultColumn, searchSeparator } from './config';

class Index extends Component {
    static displayName = 'SearchInput';

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
        const { name, defaultValue, inline, template } = column;
        const { inputType, options, selectWidth = 100, inputWidth = defaultColumn.template.width } = template;
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
        await setAsyncState(this, { inputValue: e.target.value });
        this.onChange();
    };

    onSearch = () => {
        const { props, state } = this;
        const { onChange } = props;
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
        const { name, inline, template } = column;
        const { inputType } = template;
        if (['input', 'search'].includes(inputType)) {
            onChange(inputValue);
            return;
        }
        if (['select-search', 'select-input'].includes(inputType)) {
            const [selectKey, inputKey] = name.split(searchSeparator);
            onChange([selectValue, inputValue]);
            return;
        }
    };

    render() {
        const { props, state, onSelectChange, onInputChange, onSearch } = this;
        const { column, defaultValue, value, style } = props;
        const { selectValue, inputValue } = state;
        const { name, inline, template } = column;
        const { inputType, options, selectWidth = 100, inputWidth = defaultColumn.template.width } = template;
        const inputProps = omit(props, ['column', 'defaultValue', 'value', 'onChange', 'onSearch', 'style']);
        if (inputType === 'search') {
            return (
                <Input.Search
                    {...inputProps}
                    defaultValue={defaultValue}
                    value={inputValue}
                    onChange={onInputChange}
                    onSearch={() => {
                        onSearch();
                    }}
                />
            );
        }
        if (['select-search', 'select-input'].includes(inputType)) {
            const { label } = options.find(v => v.value === selectValue) || {};
            return (
                <Input.Group compact {...inputProps}>
                    <Select
                        value={selectValue}
                        onChange={onSelectChange}
                        options={options}
                        style={{ width: selectWidth }}
                    />
                    {inputType === 'select-search' ? (
                        <Input.Search
                            {...inputProps}
                            value={inputValue}
                            style={{ width: inputWidth }}
                            onChange={onInputChange}
                            onSearch={() => {
                                onSearch();
                            }}
                            placeholder={['请输入', label].join('')}
                        />
                    ) : (
                        <Input
                            value={inputValue}
                            style={{ width: inputWidth }}
                            onChange={onInputChange}
                            placeholder={['请输入', label].join('')}
                        />
                    )}
                </Input.Group>
            );
        }
        return <Input {...inputProps} />;
    }
}

export default Index;
