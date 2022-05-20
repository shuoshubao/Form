import * as React from 'react';
import { Col, Tooltip } from 'antd';
import classNames from 'classnames';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import { FormContext } from './context';

function toTooltipProps(tooltip) {
    if (!tooltip) {
        return null;
    }

    if (typeof tooltip === 'object' && !React.isValidElement(tooltip)) {
        return tooltip;
    }

    return {
        title: tooltip
    };
}

const FormItemLabel = ({ prefixCls, label, htmlFor, labelCol, labelAlign, colon, required, requiredMark, tooltip }) => {
    if (!label) return null;

    return (
        <FormContext.Consumer key="label">
            {({ vertical, labelAlign: contextLabelAlign, labelCol: contextLabelCol, colon: contextColon }) => {
                const mergedLabelCol = labelCol || contextLabelCol || {};

                const mergedLabelAlign = labelAlign || contextLabelAlign;

                const labelClsBasic = `${prefixCls}-item-label`;
                const labelColClassName = classNames(
                    labelClsBasic,
                    mergedLabelAlign === 'left' && `${labelClsBasic}-left`,
                    mergedLabelCol.className
                );

                let labelChildren = label;
                // Keep label is original where there should have no colon
                const computedColon = colon === true || (contextColon !== false && colon !== false);
                const haveColon = computedColon && !vertical;
                // Remove duplicated user input colon
                if (haveColon && typeof label === 'string' && label.trim() !== '') {
                    labelChildren = label.replace(/[:|：]\s*$/, '');
                }

                // Tooltip
                const tooltipProps = toTooltipProps(tooltip);
                if (tooltipProps) {
                    const { icon = <QuestionCircleOutlined />, ...restTooltipProps } = tooltipProps;
                    const tooltipNode = (
                        <Tooltip {...restTooltipProps}>
                            {React.cloneElement(icon, { className: `${prefixCls}-item-tooltip`, title: '' })}
                        </Tooltip>
                    );

                    labelChildren = (
                        <React.Fragment>
                            {labelChildren}
                            {tooltipNode}
                        </React.Fragment>
                    );
                }

                const labelClassName = classNames({
                    [`${prefixCls}-item-required`]: required,
                    [`${prefixCls}-item-required-mark-optional`]: requiredMark === 'optional',
                    [`${prefixCls}-item-no-colon`]: !computedColon
                });

                return (
                    <Col {...mergedLabelCol} className={labelColClassName}>
                        <label
                            htmlFor={htmlFor}
                            className={labelClassName}
                            title={typeof label === 'string' ? label : ''}
                        >
                            {labelChildren}
                        </label>
                    </Col>
                );
            }}
        </FormContext.Consumer>
    );
};

export default FormItemLabel;
