import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Tag, Button } from 'antd';
import { omit, find, flatten, sortBy, cloneDeep, remove } from 'lodash';
import { isEveryFalsy, setAsyncState, isEmptyArray, isEmptyValue, getLabelByValue } from '@nbfe/tools';
import { defaultColumn, searchSeparator } from './config';
import { getClassNames, getDisplayName } from './util';

class Index extends Component {
    static displayName = getDisplayName('FilterPanel');

    static defaultProps = {};

    static propTypes = {
        columns: PropTypes.array.isRequired,
        getFieldsValue: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {}

    // 给外部调用
    setFields = () => {
        const { props, state, onChange } = this;
        const { columns, getFieldsValue } = props;
        const formData = getFieldsValue();
        const data = [];
        sortBy(Object.entries(formData), ([k]) => {
            return columns.findIndex(v2 => {
                return v2.name === k;
            });
        })
            .filter(([k, v]) => {
                return isEveryFalsy(isEmptyValue(v), isEmptyArray(v));
            })
            .forEach(([key, value]) => {
                const column = find(columns, { name: key });
                const { name, label, template } = column;
                const { tpl, options } = template;
                if (!['select', 'radio', 'checkbox'].includes(tpl)) {
                    return;
                }
                sortBy(flatten([value]), v => {
                    return options.findIndex(v2 => {
                        return v2.value === v;
                    });
                }).forEach(value => {
                    const valueText = getLabelByValue(value, options);
                    if (['select', 'radio', 'checkbox'].includes(tpl)) {
                        data.push({
                            name,
                            value,
                            label,
                            valueText
                        });
                    }
                });
            });
        this.setState({ data });
    };

    onChange = item => {
        const { props } = this;
        const { onChange, columns, getFieldsValue } = props;
        const formData = getFieldsValue();
        const { name, value } = item;
        let newValue = cloneDeep(formData[name]);
        if (Array.isArray(newValue)) {
            remove(newValue, v => {
                return v === value;
            });
        } else {
            newValue = '';
        }
        onChange(name, newValue);
    };

    render() {
        const { props, state, onChange } = this;
        const { columns } = props;
        const { data } = state;
        if (isEmptyArray(data)) {
            return null;
        }
        return (
            <div className={getClassNames('filter-panel')}>
                <Divider orientation="left">已选</Divider>
                {data.map((v, i) => {
                    const { label, value, valueText } = v;
                    const tagText = `${label}(${valueText})`;
                    return (
                        <Tag
                            color="blue"
                            closable
                            key={[i, value].join()}
                            onClose={() => {
                                console.log(22, v);
                                onChange(v);
                            }}
                        >
                            {tagText}
                        </Tag>
                    );
                })}
            </div>
        );
    }
}

export default Index;
