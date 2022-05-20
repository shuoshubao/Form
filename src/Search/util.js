import React from 'react';
import { Tooltip } from 'antd';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import { merge, cloneDeep, flatten } from 'lodash';
import { formatTime, isSomeFalsy } from '@nbfe/tools';
import { defaultColumn, pickerFormatMap, formItemTooltopMargin } from './config';

// 处理 props.columns
export const mergeColumns = columns => {
    return cloneDeep(columns)
        .map((v, i) => {
            const column = merge({}, defaultColumn, v);
            const { label, defaultValue, template } = column;
            const { tpl } = template;
            if (tpl === 'input') {
                column.placeholder = label ? ['请输入', label].join('') : '';
            }
            if (tpl === 'select') {
                column.placeholder = label ? ['请选择', label].join('') : '';
                column.defaultValue = defaultValue === defaultColumn.defaultValue ? undefined : defaultValue;
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
                const { startTimeKey, endTimeKey } = template;
                if (isSomeFalsy(startTimeKey, endTimeKey)) {
                    throw new Error('range-picker 必须传参数: startTimeKey, endTimeKey');
                }
                const format = template.format || 'YYYY-MM-DD HH:mm:ss';
                template.format = format;
                column.placeholder = undefined;
            }
            // startTime
            return column;
        })
        .filter(v => Boolean(v.visible));
};

// 表单初始值
export const getInitialValues = columns => {
    return cloneDeep(columns).reduce((prev, cur) => {
        const { prop, defaultValue } = cur;
        prev[prop] = defaultValue;
        return prev;
    }, {});
};

// 处理提交的值
export const getSearchValues = (params, columns) => {
    const result = {};
    columns.forEach(v => {
        const { prop, template } = v;
        const { tpl } = template;
        const value = params[prop];
        if (tpl === 'date-picker') {
            const { format } = template;
            if (value) {
                result[prop] = formatTime(value, format);
                return;
            }
        }
        if (tpl === 'range-picker') {
            const { format, startTimeKey, endTimeKey } = template;
            if (value) {
                result[startTimeKey] = formatTime(value[0], format);
                result[endTimeKey] = formatTime(value[1], format);
                return;
            }
        }
        result[prop] = value;
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
    // 日期范围
    if (tpl === 'range-picker') {
        // style.width = width === defaultColumn.template.width ? ;
        style.width = undefined;
    } else {
        style.width = width;
    }
    return style;
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
                console.log(111, args);
                const [, text, href] = args;
                return `<a href="${href}" target="_blank" style="color: #1890ff; text-decoration: underline;">${text}</a>`;
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
                <Tooltip title={getTooltipTitleNode(tooltip)}>
                    <QuestionCircleOutlined style={{ marginLeft: formItemTooltopMargin }} />
                </Tooltip>
            )}
        </div>
    );
};
