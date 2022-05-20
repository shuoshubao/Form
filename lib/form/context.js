import * as React from 'react';
import omit from 'rc-util/lib/omit';
import { FormProvider as RcFormProvider } from 'rc-field-form';

export const FormContext = React.createContext({
    labelAlign: 'right',
    vertical: false,
    itemRef: () => {}
});

/** `noStyle` Form Item Context. Used for error collection */
export const NoStyleItemContext = React.createContext(null);

export const FormProvider = props => {
    const providerProps = omit(props, ['prefixCls']);
    return <RcFormProvider {...providerProps} />;
};

export const FormItemPrefixContext = React.createContext({
    prefixCls: ''
});
