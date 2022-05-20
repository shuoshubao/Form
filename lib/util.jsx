import React from 'react';
import { Tooltip } from './antd';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import { get, pick, omit, merge, cloneDeep, flatten, noop, isFunction, isObject } from 'lodash';
import { classNames, isSomeFalsy, formatTime, convertDataToEnum, isEmptyValue } from '@nbfe/tools';
import { createElement } from '@nbfe/js2html';
import {
    isAntdV3,
    componentName,
    prefixClassName,
    defaultColumn,
    pickerFormatMap,
    formItemTooltopMargin,
    searchSeparator,
    inputTypeList
} from './config';

export const getDisplayName = (name = '') => {
    return [componentName, name].join('');
};

export const getClassNames = (...args) => {
    return classNames(args)
        .split(' ')
        .map(v => {
            return [prefixClassName, v].join('-');
        })
        .join(' ');
};

// 处理 props.columns
export const mergeColumns = (columns = []) => {
    return cloneDeep(columns)
        .map((v, i) => {
            const column = merge({}, defaultColumn, v);
            const { name, label, defaultValue } = column;
            let { template } = column;
            const { tpl } = template;
            column.rules = column.rules.map(v2 => {
                if (isFunction(v2)) {
                    return v2(label);
                }
                return v2;
            });
            if (tpl === 'input') {
                template = {
                    inputType: 'input',
                    inputWidth: defaultColumn.template.width,
                    ...template
                };
                const { inputType } = template;
                column.placeholder = label ? ['请输入', label].join('') : '';
                if (['select-search', 'select-input'].includes(inputType)) {
                    template = {
                        selectWidth: 100,
                        options: [],
                        ...template
                    };
                    const [selectKey, inputKey] = name.split(',');
                    column.name = [selectKey, inputKey].join(searchSeparator);
                }
            }
            if (tpl === 'auto-complete') {
                column.placeholder = label ? ['请输入', label].join('') : '';
            }
            if (tpl === 'select') {
                column.placeholder = label ? ['请选择', label].join('') : '';
                column.defaultValue = defaultValue === defaultColumn.defaultValue ? undefined : defaultValue;
                column.template.options = column.template.options || [];
            }
            if (tpl === 'cascader') {
                column.placeholder = label ? ['请选择', label].join('') : '';
                column.defaultValue = defaultValue === defaultColumn.defaultValue ? [] : defaultValue;
            }
            if (tpl === 'checkbox') {
                column.defaultValue = defaultValue === defaultColumn.defaultValue ? [] : defaultValue;
            }
            if (tpl === 'date-picker') {
                // picker: date | week | month | quarter | year
                template = {
                    picker: 'date',
                    ...template
                };
                template = {
                    format: pickerFormatMap[template.picker],
                    ...template
                };
                if (isAntdV3) {
                    column.defaultValue = defaultValue === defaultColumn.defaultValue ? null : defaultValue;
                }
                column.placeholder = undefined;
            }
            if (tpl === 'range-picker') {
                const [key1, key2] = name.split(',');
                column.name = [key1, key2].join(searchSeparator);
                template = {
                    format: 'YYYY-MM-DD HH:mm:ss',
                    ...template
                };
                column.placeholder = undefined;
            }
            if (tpl === 'range-number') {
                const [minValueKey, maxValueKey] = name.split(',');
                column.name = [minValueKey, maxValueKey].join(searchSeparator);
                column.placeholder = column.placeholder || '最小值,最大值';
                column.defaultValue = defaultValue === defaultColumn.defaultValue ? [] : defaultValue;
            }
            column.template = template;
            return column;
        })
        .filter(v => Boolean(v.visible));
};

// 异步数据源
export const injectColumnsWithRemoteConfig = async (context, columns = []) => {
    const innerColumns = cloneDeep(columns);
    await Promise.all(
        innerColumns.map(async v => {
            const { name, template } = v;
            const { tpl, remoteConfig } = template;
            if (['select'].includes(tpl) && isObject(remoteConfig)) {
                const { fetch: fetchFunc, process: processFunc = noop } = remoteConfig;
                const responseData = await fetchFunc();
                const list = convertDataToEnum(
                    processFunc(responseData) || responseData,
                    pick(remoteConfig, ['path', 'valueKey', 'labelKey'])
                );
                template.options = list;
            }
        })
    );
    context.setState({ columns: innerColumns });
};

// 校验参数
export const validateColumns = (columns = []) => {
    columns.forEach(column => {
        const { name, label, template } = column;
        const { tpl } = template;
        if (tpl === 'input') {
            const { inputType = 'input' } = template;
            if (!inputTypeList.includes(inputType)) {
                throw new Error(`[${componentName}] inputType 参数非法, 需为其中一种: ${inputTypeList.join('|')}`);
            }
            if (['select-search', 'select-input'].includes(inputType)) {
                const [selectKey, inputKey] = name.split(searchSeparator);
                if (isSomeFalsy(selectKey, inputKey)) {
                    throw new Error(`[${componentName}] range-picker 必须传参数: "name" 形式为 "selectKey,inputKey"`);
                }
            }
        }
        if (tpl === 'auto-complete') {
            const fetchFunc = get(template, 'remoteConfig.fetch');
            if (!isFunction(fetchFunc)) {
                throw new Error(`[${componentName}] auto-complete 必须传参数: "template.remoteConfig.fetch" 需为函数`);
            }
        }
        // 日期范围 数字范围
        if (['range-picker', 'range-number'].includes(tpl)) {
            const [key1, key2] = name.split(searchSeparator);
            if (isSomeFalsy(key1, key2)) {
                throw new Error(`[${componentName}] ${tpl} 必须传参数: "name" 形式为 "key1,key2"`);
            }
        }
    });
};

// 表单初始值
export const getInitialValues = (columns = []) => {
    return cloneDeep(columns).reduce((prev, cur) => {
        const { name, defaultValue, template } = cur;
        const { tpl } = template;
        // 日期范围 数字范围
        if (['range-picker', 'range-number'].includes(tpl)) {
            const [key1, key2] = name.split(searchSeparator);
            prev[key1] = defaultValue[0] || '';
            prev[key2] = defaultValue[1] || '';
        }
        prev[name] = defaultValue;
        return prev;
    }, {});
};

// 处理提交的值
export const getSearchValues = (params, columns) => {
    const result = {};
    columns.forEach(v => {
        const { name, defaultValue, template } = v;
        const { tpl } = template;
        const value = params[name];
        if (tpl === 'input') {
            const { inputType } = template;
            if (['select-search', 'select-input'].includes(inputType)) {
                const [selectKey, inputKey] = name.split(searchSeparator);
                result[selectKey] = value[0];
                result[inputKey] = value[1];
                return;
            }
        }
        if (tpl === 'date-picker') {
            const { format } = template;
            if (value) {
                result[name] = formatTime(value, format);
            } else {
                result[name] = defaultValue;
            }
            return;
        }
        if (tpl === 'range-picker') {
            const { format } = template;
            const [key1, key2] = name.split(searchSeparator);
            if (value) {
                result[key1] = formatTime(value[0], format);
                result[key2] = formatTime(value[1], format);
            } else {
                result[key1] = '';
                result[key2] = '';
            }
            return;
        }
        if (tpl === 'range-number') {
            const [key1, key2] = name.split(searchSeparator);
            const [value1, value2] = value;
            result[key1] = isEmptyValue(value1) ? null : value1;
            result[key2] = isEmptyValue(value2) ? null : value2;
            return;
        }
        result[name] = value;
    });
    return result;
};

// icon 的宽度
const iconWidth = 14;

// 获取 Form.Item label 的宽度
export const getFormItemLabelWidth = columns => {
    if (columns.length === 1) {
        return 0;
    }
    const labelWidthList = columns.map(v => {
        const { label, tooltip } = v;
        let labelWidth = label.length * iconWidth;
        if (tooltip.length) {
            labelWidth += iconWidth + formItemTooltopMargin;
        }
        return labelWidth;
    });
    return Math.max(...labelWidthList);
};

// 获取 Form.Item value 的宽度
export const getFormItemNodeStyle = column => {
    const { template } = column;
    const { tpl, width } = template;
    const style = {};
    // 单选 复选 日期范围
    if (['radio', 'checkbox', 'input-number', 'range-picker'].includes(tpl)) {
        style.width = undefined;
    } else {
        style.width = width;
    }
    return style;
};

// Form.Item 的 props
export const getFormItemProps = (column, { index, labelWidth }) => {
    const { label, name, inline, template } = column;
    const formItemProps = omit(column, [
        'label',
        'visible',
        'defaultValue',
        'immediate',
        'tooltip',
        'placeholder',
        'isSearch',
        'inline',
        'formItemStyle',
        'template'
    ]);
    const labelNode = renderFormItemLabel(column, { labelWidth });
    const key = [index, label, name, column.key].join('_');
    return merge(
        {
            label: labelNode,
            key: key,
            style: { width: inline ? undefined : '100%' }
        },
        formItemProps
    );
};

// Form.Item 子组件的 props
export const getFormItemNodeProps = column => {
    const { placeholder, template } = cloneDeep(column);
    const { tpl } = template;
    return {
        placeholder,
        style: getFormItemNodeStyle(column),
        ...omit(template, ['width', 'tpl'])
    };
};

// 解析url: [文案|链接]
const linkReg = /\[(.+?)\|(.+?)\]/g;

// Tooltip 支持链接的写法
const getTooltipTitleNode = tooltip => {
    const innerTooltip = flatten([tooltip])
        .filter(Boolean)
        .map(String)
        .map(v => {
            return v.replace(/\\n/g, '<br>');
        })
        .map(v => {
            return v.replace(linkReg, (...args) => {
                const [, text, href] = args;
                return createElement({
                    tagName: 'a',
                    attrs: {
                        href,
                        target: '_blank',
                        style: {
                            color: '#fff',
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }
                    },
                    text
                });
            });
        });
    return innerTooltip.map((v, i) => {
        return <div key={[i].join()} dangerouslySetInnerHTML={{ __html: v }} />;
    });
};

// Form.Item tooltip
export const renderFormItemLabel = (column, { labelWidth }) => {
    const { label, tooltip } = column;
    if (!label.trim()) {
        return null;
    }
    return (
        <div style={{ width: labelWidth || undefined }} className={getClassNames('form-item-label')}>
            <span>{label}</span>
            {!!tooltip && (
                <Tooltip title={getTooltipTitleNode(tooltip)} overlayClassName={getClassNames('tooltip')}>
                    <QuestionCircleOutlined
                        style={{ marginLeft: formItemTooltopMargin, color: 'rgba(0, 0, 0, 0.45)' }}
                    />
                </Tooltip>
            )}
        </div>
    );
};
