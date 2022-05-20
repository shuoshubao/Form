import * as React from 'react';
import { useMemo } from 'react';
import { classNames } from '@nbfe/tools';
import FieldForm, { List } from 'rc-field-form';
import { FormContext } from './context';
import useForm from './hooks/useForm';

const InternalForm = (props, ref) => {
    const contextForm = null;

    const {
        prefixCls: customizePrefixCls,
        className = '',
        size,
        form,
        colon,
        labelAlign,
        labelCol,
        wrapperCol,
        hideRequiredMark,
        layout = 'horizontal',
        scrollToFirstError,
        requiredMark,
        onFinishFailed,
        name,
        ...restFormProps
    } = props;

    const mergedRequiredMark = useMemo(() => {
        if (requiredMark !== undefined) {
            return requiredMark;
        }

        if (contextForm && contextForm.requiredMark !== undefined) {
            return contextForm.requiredMark;
        }

        if (hideRequiredMark) {
            return false;
        }

        return true;
    }, [hideRequiredMark, requiredMark, contextForm]);

    const prefixCls = 'ant-form';

    const formClassName = classNames(
        prefixCls,
        {
            [`${prefixCls}-${layout}`]: true,
            [`${prefixCls}-hide-required-mark`]: mergedRequiredMark === false,
            [`${prefixCls}-${size}`]: size
        },
        className
    );

    const [wrapForm] = useForm(form);
    const { __INTERNAL__ } = wrapForm;
    __INTERNAL__.name = name;

    const formContextValue = useMemo(
        () => ({
            name,
            labelAlign,
            labelCol,
            wrapperCol,
            vertical: layout === 'vertical',
            colon,
            requiredMark: mergedRequiredMark,
            itemRef: __INTERNAL__.itemRef
        }),
        [name, labelAlign, labelCol, wrapperCol, layout, colon, mergedRequiredMark]
    );

    React.useImperativeHandle(ref, () => wrapForm);

    const onInternalFinishFailed = errorInfo => {
        onFinishFailed?.(errorInfo);

        let defaultScrollToFirstError = { block: 'nearest' };

        if (scrollToFirstError && errorInfo.errorFields.length) {
            if (typeof scrollToFirstError === 'object') {
                defaultScrollToFirstError = scrollToFirstError;
            }
            wrapForm.scrollToField(errorInfo.errorFields[0].name, defaultScrollToFirstError);
        }
    };

    return (
        <FormContext.Provider value={formContextValue}>
            <FieldForm
                id={name}
                {...restFormProps}
                name={name}
                onFinishFailed={onInternalFinishFailed}
                form={wrapForm}
                className={formClassName}
            />
        </FormContext.Provider>
    );
};

const Form = React.forwardRef(InternalForm);

export { useForm, List };

export default Form;
