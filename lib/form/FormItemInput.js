import * as React from 'react';
import { Col } from 'antd';
import { classNames } from '@nbfe/tools';
import { FormContext, FormItemPrefixContext } from './context';
import ErrorList from './ErrorList';

const FormItemInput = props => {
    const {
        prefixCls,
        status,
        wrapperCol,
        children,
        errors,
        warnings,
        _internalItemRender: formItemRender,
        extra,
        help
    } = props;
    const baseClassName = `${prefixCls}-item`;

    const formContext = React.useContext(FormContext);

    const mergedWrapperCol = wrapperCol || formContext.wrapperCol || {};

    const className = classNames(`${baseClassName}-control`, mergedWrapperCol.className);

    // Pass to sub FormItem should not with col info
    const subFormContext = React.useMemo(() => ({ ...formContext }), [formContext]);
    delete subFormContext.labelCol;
    delete subFormContext.wrapperCol;

    const inputDom = (
        <div className={`${baseClassName}-control-input`}>
            <div className={`${baseClassName}-control-input-content`}>{children}</div>
        </div>
    );
    const formItemContext = React.useMemo(() => ({ prefixCls, status }), [prefixCls, status]);
    const errorListDom = (
        <FormItemPrefixContext.Provider value={formItemContext}>
            <ErrorList
                errors={errors}
                warnings={warnings}
                help={help}
                helpStatus={status}
                className={`${baseClassName}-explain-connected`}
            />
        </FormItemPrefixContext.Provider>
    );

    // If extra = 0, && will goes wrong
    // 0&&error -> 0
    const extraDom = extra ? <div className={`${baseClassName}-extra`}>{extra}</div> : null;

    const dom =
        formItemRender && formItemRender.mark === 'pro_table_render' && formItemRender.render ? (
            formItemRender.render(props, { input: inputDom, errorList: errorListDom, extra: extraDom })
        ) : (
            <>
                {inputDom}
                {errorListDom}
                {extraDom}
            </>
        );
    return (
        <FormContext.Provider value={subFormContext}>
            <Col {...mergedWrapperCol} className={className}>
                {dom}
            </Col>
        </FormContext.Provider>
    );
};

export default FormItemInput;
