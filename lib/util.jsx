import React from 'react';
import { Tooltip } from 'antd';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import { omit, merge, cloneDeep, flatten } from 'lodash';
import { isSomeFalsy, formatTime } from '@nbfe/tools';
import { createElement } from '@nbfe/js2html';
import { defaultColumn, pickerFormatMap, formItemTooltopMargin, searchSeparator } from './config';

// 处理 props.columns
export const mergeColumns = columns => {
    return cloneDeep(columns)
        .map((v, i) => {
            const column = merge({}, defaultColumn, v);
            const { name, label, defaultValue, template } = column;
            const { tpl } = template;
            if (tpl === 'input') {
                column.placeholder = label ? ['请输入', label].join('') : '';
                const { inputType } = template;
                if (['select-search', 'select-input'].includes(inputType)) {
                    const [selectKey, inputKey] = name.split(',');
                    if (isSomeFalsy(selectKey, inputKey)) {
                        throw new Error('range-picker 必须传参数: "name" 需为长度为 "selectKey,inputKey"');
                    }
                    column.name = [selectKey, inputKey].join(searchSeparator);
                }
            }
            if (tpl === 'select') {
                column.placeholder = label ? ['请选择', label].join('') : '';
                column.defaultValue = defaultValue === defaultColumn.defaultValue ? undefined : defaultValue;
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
                const picker = template.picker || 'date';
                const format = template.format || pickerFormatMap[picker];
                template.picker = picker;
                template.format = format;
                column.placeholder = undefined;
            }
            if (tpl === 'range-picker') {
                const [startTimeKey, endTimeKey] = name.split(',');
                if (isSomeFalsy(startTimeKey, endTimeKey)) {
                    throw new Error('range-picker 必须传参数: "name" 需为长度为 "startTimeKey,endTimeKey"');
                }
                column.name = [startTimeKey, endTimeKey].join(searchSeparator);
                const format = template.format || 'YYYY-MM-DD HH:mm:ss';

                template.format = format;
                column.placeholder = undefined;
            }
            column.template = template;
            return column;
        })
        .filter(v => Boolean(v.visible));
};

// 表单初始值
export const getInitialValues = columns => {
    return cloneDeep(columns).reduce((prev, cur) => {
        const { name, defaultValue, template } = cur;
        const { tpl } = template;
        // 日期范围
        if (tpl === 'range-picker') {
            const [startTimeKey, endTimeKey] = name.split(searchSeparator);
            prev[startTimeKey] = '';
            prev[endTimeKey] = '';
            return prev;
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
            const [startTimeKey, endTimeKey] = name.split(searchSeparator);
            if (value) {
                result[startTimeKey] = formatTime(value[0], format);
                result[endTimeKey] = formatTime(value[1], format);
            } else {
                result[startTimeKey] = '';
                result[endTimeKey] = '';
            }
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
    if (['radio', 'checkbox', 'range-picker'].includes(tpl)) {
        style.width = undefined;
    } else {
        style.width = width;
    }
    return style;
};

// Form.Item 子组件的 props
export const getFormItemNodeProps = column => {
    const { placeholder, template } = cloneDeep(column);
    const { tpl } = template;
    const formItemNodeProps = {
        placeholder,
        style: getFormItemNodeStyle(column),
        ...omit(template, ['width', 'tpl'])
    };
    return formItemNodeProps;
};

// 解析url: [文案|链接]
const linkReg = /\[(.+?)\|(.+?)\]/g;

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
    return innerTooltip.map((v2, i2) => {
        return <div key={[i2].join()} dangerouslySetInnerHTML={{ __html: v2 }} />;
    });
};

export const renderFormItemLabel = (column, { labelWidth }) => {
    const { label, tooltip } = column;
    if (!label.trim()) {
        return null;
    }
    return (
        <div style={{ width: labelWidth || undefined }}>
            <span>{label}</span>
            {!!tooltip && (
                <Tooltip title={getTooltipTitleNode(tooltip)} overlayClassName="dyna-search-tooltip">
                    <QuestionCircleOutlined style={{ marginLeft: formItemTooltopMargin }} />
                </Tooltip>
            )}
        </div>
    );
};
