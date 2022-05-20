import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, debounce, isFunction, omit, merge } from 'lodash';
import { isEmptyArray, setAsyncState, isEveryFalsy, classNames } from '@nbfe/tools';
import { Card, Button, Form, DatePicker, Radio, Checkbox, InputNumber, message } from 'antd';
import { Input, RangeNumber, Select, Tabs, Cascader, TreeSelect, AutoComplete, Switch, Slider } from './components';
import FilterPanel from './FilterPanel';
import { isAntdV3, componentName, defaulCardProps, defaulFormProps } from './config';
import {
    getClassNames,
    validateColumns,
    mergeColumns,
    getInitialValues,
    getSearchValues,
    getFormItemLabelWidth,
    getFormItemProps,
    getFormItemNodeProps
} from './util';
import './index.less';

class Index extends Component {
    static displayName = componentName;

    static defaultProps = {
        disabled: false, // false: 编辑模式; true: 详情模式
        autoSubmit: true,
        showSearchBtn: false,
        showResetBtn: true,
        cardProps: {},
        formProps: {},
        labelWidth: 0,
        visibleFilterPanel: false
    };

    static propTypes = {
        disabled: PropTypes.bool,
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
        const { disabled, columns, autoSubmit } = this.props;
        const innerColumns = mergeColumns(columns, { disabled });
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

    // 封装下 validateFields
    validateFields = () => {
        const { columns } = this.state;
        const formRefNode = this.getFormRefNode();
        const { validateFields } = formRefNode;
        return new Promise(reslove => {
            if (isAntdV3) {
                validateFields((errors, values) => {
                    if (errors) {
                        reslove(null);
                        message.error('表单项填写存在错误！请检查', 2);
                    } else {
                        reslove(getSearchValues(values, columns));
                    }
                });
            } else {
                validateFields()
                    .then(values => {
                        reslove(getSearchValues(values, columns));
                    })
                    .catch(() => {
                        reslove(null);
                        message.error('表单项填写存在错误！请检查', 2);
                    });
            }
        });
    };

    getFormData = this.validateFields;

    // 立即查询
    onImmediateSearch = column => {
        const { immediate, template } = column;
        const { tpl } = template;
        this.debounceFilterPanelSetFields();
        if (!immediate) {
            return;
        }
        if (['input', 'slider'].includes(tpl)) {
            return;
        }
        this.onSearch();
    };

    // 查询
    onSearch = debounce(() => {
        const { state, props } = this;
        const { columns } = state;
        const formRefNode = this.getFormRefNode();
        if (!formRefNode) {
            return;
        }
        const params = formRefNode.getFieldsValue();
        const searchValues = getSearchValues(params, columns);
        if (isFunction(props.onSubmit)) {
            props.onSubmit(searchValues, params);
        }
        this.debounceFilterPanelSetFields();
    }, 300);

    // 筛选域
    debounceFilterPanelSetFields = debounce(() => {
        const { visibleFilterPanel } = this.props;
        if (visibleFilterPanel) {
            this.filterPanelRef.current.setFields();
        }
    }, 300 + 10);

    // 重置
    onReset = () => {
        const { columns } = this.state;
        const formRefNode = this.getFormRefNode();
        const values = formRefNode.getFieldsValue(isAntdV3 ? undefined : true);
        formRefNode.resetFields();
        columns.forEach(column => {
            const {
                name,
                template: { tpl }
            } = column;
            if (tpl === 'tabs') {
                formRefNode.setFieldsValue({ [name]: values[name] });
            }
        });
        this.onSearch();
    };

    // Form.Item
    renderColumns = () => {
        const { props, state } = this;
        const { children } = props;
        const { initialValues, columns } = state;
        const labelWidth = props.labelWidth || getFormItemLabelWidth(columns);
        const columnsNode = columns.map((v, i) => {
            const { name, template } = v;
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

            // InputNumber
            if (tpl === 'input-number') {
                formItemNode = <InputNumber {...formItemNodeProps} />;
            }

            // RangeNumber 数字范围
            if (tpl === 'range-number') {
                formItemNode = <RangeNumber column={v} {...formItemNodeProps} />;
            }

            // Select
            if (tpl === 'select') {
                formItemNode = <Select {...formItemNodeProps} />;
            }

            // Radio
            if (tpl === 'radio') {
                formItemNode = <Radio.Group {...formItemNodeProps} />;
            }

            // Checkbox
            if (tpl === 'checkbox') {
                formItemNode = <Checkbox.Group {...formItemNodeProps} />;
            }

            // Tabs
            if (tpl === 'tabs') {
                const { emitReset = false } = formItemNodeProps;
                formItemNode = (
                    <Tabs
                        column={v}
                        {...omit(formItemNodeProps, ['emitReset'])}
                        onCustomChange={() => {
                            // 触发重置, 清空其他条件
                            if (emitReset) {
                                this.onReset();
                            }
                        }}
                    />
                );
            }

            // DatePicker
            if (tpl === 'date-picker') {
                formItemNode = <DatePicker {...formItemNodeProps} />;
            }

            // RangePicker
            if (tpl === 'range-picker') {
                formItemNode = <DatePicker.RangePicker {...formItemNodeProps} />;
            }

            // Cascader
            if (tpl === 'cascader') {
                formItemNode = <Cascader {...formItemNodeProps} />;
            }

            // TreeSelect
            if (tpl === 'tree-select') {
                formItemNode = <TreeSelect {...formItemNodeProps} />;
            }

            // AutoComplete
            if (tpl === 'auto-complete') {
                formItemNode = <AutoComplete {...formItemNodeProps} />;
            }

            // Switch
            if (tpl === 'switch') {
                formItemNode = <Switch {...formItemNodeProps} />;
            }

            // Slider
            if (tpl === 'slider') {
                formItemNode = (
                    <Slider
                        {...formItemNodeProps}
                        onCustomChange={() => {
                            this.onSearch();
                        }}
                    />
                );
            }

            // 自定义组件
            if (isFunction(tpl)) {
                const DynamicComponent = tpl;
                formItemNode = <DynamicComponent {...formItemNodeProps} />;
            }

            const formItemProps = getFormItemProps(v, { index: i, labelWidth });

            if (isAntdV3) {
                const { getFieldDecorator } = this.props.form;
                return (
                    <Form.Item {...formItemProps}>
                        {getFieldDecorator(name, {
                            initialValue: initialValues[name]
                        })(formItemNode)}
                    </Form.Item>
                );
            }
            return <Form.Item {...formItemProps}>{formItemNode}</Form.Item>;
        });
        if (children) {
            const childrenNode = (
                <Form.Item colon={false} label={<div style={{ width: labelWidth }} />} key="-1">
                    {props.children}
                </Form.Item>
            );
            columnsNode.push(childrenNode);
        }
        return columnsNode;
    };

    // 查询, 重置
    renderSearchReset = () => {
        const { props, state, onReset } = this;
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
            if (tpl === 'input' && inputType === 'input') {
                showSearch = true;
            }
            showReset = false;
        }
        const labelWidth = props.labelWidth || getFormItemLabelWidth(columns);
        return (
            <Form.Item
                colon={false}
                label={<div style={{ width: labelWidth }} />}
                className={getClassNames('form-item')}
            >
                {showSearch && (
                    <Button type="primary" htmlType="submit" key="submit">
                        查询
                    </Button>
                )}
                {showReset && (
                    <Button onClick={onReset} key="reset">
                        重置
                    </Button>
                )}
            </Form.Item>
        );
    };

    render() {
        const { props, state, onSearch, renderColumns, renderSearchReset } = this;
        const { columns, initialValues } = state;
        const { disabled, visibleFilterPanel } = props;
        if (isEmptyArray(columns)) {
            return null;
        }
        const cardProps = merge({}, defaulCardProps, props.cardProps);
        const formProps = merge({}, defaulFormProps, props.formProps);
        if (isAntdV3) {
            formProps.onSubmit = e => {
                e.preventDefault();
                onSearch();
            };
        } else {
            formProps.onFinish = onSearch;
            formProps.initialValues = initialValues;
            formProps.ref = this.formRef;
            if (props.onValuesChange) {
                formProps.onValuesChange = (changedFields, allFields) => {
                    const formRefNode = this.getFormRefNode();
                    const [[key, value]] = Object.entries(changedFields);
                    props.onValuesChange(
                        {
                            key,
                            value,
                            changedFields: cloneDeep(changedFields),
                            allFields: cloneDeep(allFields)
                        },
                        {
                            columns: cloneDeep(columns),
                            updateColumns: list => {
                                this.setState({ columns: list });
                            },
                            ...formRefNode
                        }
                    );
                };
            }
        }
        return (
            <Card
                className={classNames(getClassNames(), {
                    [getClassNames('disabled')]: disabled,
                    [getClassNames('antd-v3')]: isAntdV3
                })}
                {...cardProps}
            >
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

export default (() => {
    if (isAntdV3) {
        return Form.create({ name: 'form' })(Index);
    }
    return Index;
})();
