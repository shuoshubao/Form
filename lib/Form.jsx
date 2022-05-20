import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce, isFunction, omit, merge } from 'lodash';
import { isEmptyArray, setAsyncState, isEveryFalsy, classNames } from '@nbfe/tools';
import { Card, Button, Form, Select, DatePicker, Radio, Checkbox, Cascader } from './antd';
import Switch from './Switch.jsx';
import Input from './Input.jsx';
import FilterPanel from './FilterPanel.jsx';
import { isAntdV3, componentName, defaulCardProps, defaulFormProps } from './config';
import {
    getClassNames,
    validateColumns,
    mergeColumns,
    getInitialValues,
    getSearchValues,
    getFormItemLabelWidth,
    renderFormItemLabel,
    getFormItemNodeProps
} from './util.jsx';

class Index extends Component {
    static displayName = componentName;

    static defaultProps = {
        autoSubmit: true,
        showSearchBtn: false,
        showResetBtn: true,
        cardProps: {},
        formProps: {},
        labelWidth: 0,
        visibleFilterPanel: false
    };

    static propTypes = {
        columns: PropTypes.array.isRequired,
        // 自动触发搜索
        autoSubmit: PropTypes.bool,
        // 展示搜索按钮
        showSearchBtn: PropTypes.bool,
        // 展示重置按钮
        showResetBtn: PropTypes.bool,
        // 事件: 提交 (submitData, formData) => {}
        onSubmit: PropTypes.func,
        // Card 的属性 https://ant.design/components/card-cn/#API
        cardProps: PropTypes.object,
        // Form 的属性 https://ant.design/components/form-cn/#API
        formProps: PropTypes.object,
        // Form.Item label 的宽度
        labelWidth: PropTypes.number,
        // 是否显示 筛选区
        visibleFilterPanel: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            initialValues: {}
        };
        this.formRef = React.createRef();
        this.filterPanelRef = React.createRef();
    }

    async componentDidMount() {
        const { columns, autoSubmit } = this.props;
        const innerColumns = mergeColumns(columns);
        validateColumns(innerColumns);
        // 初始值
        const initialValues = getInitialValues(innerColumns);
        await setAsyncState(this, { columns: innerColumns, initialValues });
        if (isEmptyArray(innerColumns)) {
            return;
        }
        if (autoSubmit) {
            this.onSearch();
        }
    }

    // 获取 formNode
    getFormRefNode = () => {
        return isAntdV3 ? this.props.form : this.formRef.current;
    };

    // 立即查询
    onImmediateSearch = column => {
        const { immediate, template } = column;
        const { tpl } = template;
        this.debounceFilterPanelSetFields();
        if (!immediate) {
            return;
        }
        if (['input'].includes(tpl)) {
            return;
        }
        this.onSearch();
    };

    // 查询
    onSearch = debounce(() => {
        const { state, props } = this;
        const { columns } = state;
        const formRefNode = this.getFormRefNode();
        const params = formRefNode.getFieldsValue();
        const searchValues = getSearchValues(params, columns);
        if (isFunction(props.onSubmit)) {
            props.onSubmit(searchValues, params);
        }
        this.debounceFilterPanelSetFields();
    }, 100);

    // 筛选域
    debounceFilterPanelSetFields = debounce(() => {
        const { visibleFilterPanel } = this.props;
        if (visibleFilterPanel) {
            this.filterPanelRef.current.setFields();
        }
    }, 100 + 10);

    // 重置
    onReset = () => {
        const formRefNode = this.getFormRefNode();
        formRefNode.resetFields();
        this.onSearch();
    };

    // Form.Item
    renderColumns = () => {
        const { props, state } = this;
        const { initialValues, columns } = state;
        const labelWidth = props.labelWidth || getFormItemLabelWidth(columns);
        return columns.map((v, i) => {
            const { label, name, inline, template } = v;
            const { tpl } = template;
            const formItemNodeProps = getFormItemNodeProps(v);
            formItemNodeProps.onChange = () => {
                this.onImmediateSearch(v);
            };
            let formItemNode = null;
            // Input
            if (tpl === 'input') {
                formItemNode = (
                    <Input
                        column={v}
                        {...formItemNodeProps}
                        onSearch={() => {
                            this.onSearch();
                        }}
                    />
                );
            }

            // Select
            if (tpl === 'select') {
                formItemNode = (
                    <Select {...omit(formItemNodeProps, ['options'])}>
                        {formItemNodeProps.options.map(v => {
                            return (
                                <Select.Option value={v.value} key={v.value}>
                                    {v.label}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            }

            // Cascader
            if (tpl === 'cascader') {
                formItemNode = <Cascader {...formItemNodeProps} />;
            }

            // Radio
            if (tpl === 'radio') {
                formItemNode = <Radio.Group {...formItemNodeProps} />;
            }

            // Checkbox
            if (tpl === 'checkbox') {
                formItemNode = <Checkbox.Group {...formItemNodeProps} />;
            }

            // DatePicker
            if (tpl === 'date-picker') {
                formItemNode = <DatePicker {...formItemNodeProps} />;
            }

            // RangePicker
            if (tpl === 'range-picker') {
                formItemNode = <DatePicker.RangePicker {...formItemNodeProps} />;
            }

            // Switch
            if (tpl === 'switch') {
                formItemNode = <Switch {...formItemNodeProps} />;
            }

            const labelNode = renderFormItemLabel(v, { labelWidth });

            const key = [i, label, name].join('_');
            if (isAntdV3) {
                const { getFieldDecorator } = this.props.form;
                return (
                    <Form.Item label={labelNode} name={name} key={key} style={{ width: inline ? undefined : '100%' }}>
                        {getFieldDecorator(name, {
                            initialValue: initialValues[name]
                        })(formItemNode)}
                    </Form.Item>
                );
            }
            return (
                <Form.Item label={labelNode} name={name} key={key} style={{ width: inline ? undefined : '100%' }}>
                    {formItemNode}
                </Form.Item>
            );
        });
    };

    // 查询, 重置
    renderSearchReset = () => {
        const { state, onReset } = this;
        const { columns } = state;
        const { showSearchBtn, showResetBtn } = this.props;
        if (isEveryFalsy(showSearchBtn, showResetBtn)) {
            return null;
        }
        let showSearch = showSearchBtn;
        let showReset = showResetBtn;
        // 只有一项
        if (columns.length === 1) {
            const { template } = columns[0];
            const { tpl, inputType } = template;
            // 只有一个输入框
            if (tpl === 'input' && inputType == 'input') {
                showSearch = true;
            }
            showReset = false;
        }
        return (
            <Form.Item
                className={getClassNames('form-item', {
                    'form-item-hide-submit': !showSearch,
                    'form-item-hide-reset': !showReset
                })}
            >
                <Button type="primary" htmlType="submit" key="submit" className={getClassNames('form-item-submit')}>
                    查询
                </Button>
                <Button onClick={onReset} key="reset" className={getClassNames('form-item-reset')}>
                    重置
                </Button>
            </Form.Item>
        );
    };

    render() {
        const { props, state, onSearch, renderColumns, renderSearchReset } = this;
        const { columns, initialValues } = state;
        const { visibleFilterPanel } = props;
        if (isEmptyArray(columns)) {
            return null;
        }
        const cardProps = merge({}, props.cardProps, defaulCardProps);
        const formProps = merge({}, props.formProps, defaulFormProps);
        if (isAntdV3) {
            formProps.onSubmit = e => {
                e.preventDefault();
                onSearch();
            };
        } else {
            formProps.onFinish = onSearch;
            formProps.initialValues = initialValues;
            formProps.ref = this.formRef;
        }
        return (
            <Card className={getClassNames('container')} {...cardProps}>
                <Form {...formProps}>
                    {renderColumns()}
                    {renderSearchReset()}
                </Form>
                {visibleFilterPanel && (
                    <FilterPanel
                        ref={this.filterPanelRef}
                        columns={columns}
                        getFieldsValue={() => {
                            const formRefNode = this.getFormRefNode();
                            return formRefNode.getFieldsValue();
                        }}
                        onChange={fields => {
                            const formRefNode = this.getFormRefNode();
                            formRefNode.setFields(fields);
                            this.onSearch();
                        }}
                    />
                )}
            </Card>
        );
    }
}

export default () => {
    if (isAntdV3) {
        return Form.create({ name: 'form' })(Index);
    }
    return Index;
};
