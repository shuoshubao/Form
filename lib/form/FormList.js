import * as React from 'react';
import { List } from 'rc-field-form';
import devWarning from './_util/devWarning';
import { FormItemPrefixContext } from './context';

const FormList = ({ prefixCls: customizePrefixCls, children, ...props }) => {
    devWarning(!!props.name, 'Form.List', 'Miss `name` prop.');

    const prefixCls = 'ant-form';
    const contextValue = React.useMemo(
        () => ({
            prefixCls,
            status: 'error'
        }),
        [prefixCls]
    );

    return (
        <List {...props}>
            {(fields, operation, meta) => (
                <FormItemPrefixContext.Provider value={contextValue}>
                    {children(
                        fields.map(field => ({ ...field, fieldKey: field.key })),
                        operation,
                        {
                            errors: meta.errors,
                            warnings: meta.warnings
                        }
                    )}
                </FormItemPrefixContext.Provider>
            )}
        </List>
    );
};

export default FormList;
