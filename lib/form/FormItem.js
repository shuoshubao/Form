import * as React from 'react';
import { useContext } from 'react';
import { Row } from 'antd';
import { omit } from 'lodash';
import { classNames } from '@nbfe/tools';
import { Field } from 'rc-field-form';
import FieldContext from 'rc-field-form/lib/FieldContext';
import { supportRef } from 'rc-util/lib/ref';
import FormItemLabel from './FormItemLabel';
import FormItemInput from './FormItemInput';
import { FormContext, NoStyleItemContext } from './context';
import { toArray, getFieldId } from './util';
import devWarning from './_util/devWarning';
import { cloneElement, isValidElement } from './_util/reactNode';
import useFrameState from './hooks/useFrameState';
import useDebounce from './hooks/useDebounce';
import useItemRef from './hooks/useItemRef';

const NAME_SPLIT = '__SPLIT__';

const MemoInput = React.memo(
    ({ children }) => children,
    (prev, next) => prev.value === next.value && prev.update === next.update
);

function hasValidName(name) {
    if (name === null) {
        devWarning(false, 'Form.Item', '`null` is passed as `name` property');
    }
    return !(name === undefined || name === null);
}

function genEmptyMeta() {
    return {
        errors: [],
        warnings: [],
        touched: false,
        validating: false,
        name: []
    };
}

function FormItem(props) {
    const {
        name,
        fieldKey,
        noStyle,
        dependencies,
        prefixCls: customizePrefixCls,
        style,
        className,
        shouldUpdate,
        hasFeedback,
        help,
        rules,
        validateStatus,
        children,
        required,
        label,
        messageVariables,
        trigger = 'onChange',
        validateTrigger,
        hidden,
        ...restProps
    } = props;
    const { name: formName, requiredMark } = useContext(FormContext);
    const isRenderProps = typeof children === 'function';
    const notifyParentMetaChange = useContext(NoStyleItemContext);

    const { validateTrigger: contextValidateTrigger } = useContext(FieldContext);
    const mergedValidateTrigger = validateTrigger !== undefined ? validateTrigger : contextValidateTrigger;

    const hasName = hasValidName(name);

    const prefixCls = 'ant-form';

    // ======================== Errors ========================
    // >>>>> Collect sub field errors
    const [subFieldErrors, setSubFieldErrors] = useFrameState({});

    // >>>>> Current field errors
    const [meta, setMeta] = React.useState(() => genEmptyMeta());

    const onMetaChange = nextMeta => {
        // Destroy will reset all the meta
        setMeta(nextMeta.destroy ? genEmptyMeta() : nextMeta);

        // Bump to parent since noStyle
        if (noStyle && notifyParentMetaChange) {
            let namePath = nextMeta.name;
            if (fieldKey !== undefined) {
                namePath = Array.isArray(fieldKey) ? fieldKey : [fieldKey];
            }
            notifyParentMetaChange(nextMeta, namePath);
        }
    };

    // >>>>> Collect noStyle Field error to the top FormItem
    const onSubItemMetaChange = (subMeta, uniqueKeys) => {
        // Only `noStyle` sub item will trigger
        setSubFieldErrors(prevSubFieldErrors => {
            const clone = {
                ...prevSubFieldErrors
            };

            // name: ['user', 1] + key: [4] = ['user', 4]
            const mergedNamePath = [...subMeta.name.slice(0, -1), ...uniqueKeys];
            const mergedNameKey = mergedNamePath.join(NAME_SPLIT);

            if (subMeta.destroy) {
                // Remove
                delete clone[mergedNameKey];
            } else {
                // Update
                clone[mergedNameKey] = subMeta;
            }

            return clone;
        });
    };

    // >>>>> Get merged errors
    const [mergedErrors, mergedWarnings] = React.useMemo(() => {
        const errorList = [...meta.errors];
        const warningList = [...meta.warnings];

        Object.values(subFieldErrors).forEach(subFieldError => {
            errorList.push(...(subFieldError.errors || []));
            warningList.push(...(subFieldError.warnings || []));
        });

        return [errorList, warningList];
    }, [subFieldErrors, meta.errors, meta.warnings]);

    const debounceErrors = useDebounce(mergedErrors);
    const debounceWarnings = useDebounce(mergedWarnings);

    // ===================== Children Ref =====================
    const getItemRef = useItemRef();

    // ======================== Render ========================
    function renderLayout(baseChildren, fieldId, isRequired) {
        if (noStyle && !hidden) {
            return baseChildren;
        }
        // ======================== Status ========================
        let mergedValidateStatus = '';
        if (validateStatus !== undefined) {
            mergedValidateStatus = validateStatus;
        } else if (meta?.validating) {
            mergedValidateStatus = 'validating';
        } else if (debounceErrors.length) {
            mergedValidateStatus = 'error';
        } else if (debounceWarnings.length) {
            mergedValidateStatus = 'warning';
        } else if (meta?.touched) {
            mergedValidateStatus = 'success';
        }

        const itemClassName = {
            [`${prefixCls}-item`]: true,
            [`${prefixCls}-item-with-help`]: help || debounceErrors.length || debounceWarnings.length,
            [`${className}`]: !!className,

            // Status
            [`${prefixCls}-item-has-feedback`]: mergedValidateStatus && hasFeedback,
            [`${prefixCls}-item-has-success`]: mergedValidateStatus === 'success',
            [`${prefixCls}-item-has-warning`]: mergedValidateStatus === 'warning',
            [`${prefixCls}-item-has-error`]: mergedValidateStatus === 'error',
            [`${prefixCls}-item-is-validating`]: mergedValidateStatus === 'validating',
            [`${prefixCls}-item-hidden`]: hidden
        };

        // ======================= Children =======================
        return (
            <Row
                className={classNames(itemClassName)}
                style={style}
                key="row"
                {...omit(restProps, [
                    'colon',
                    'extra',
                    'getValueFromEvent',
                    'getValueProps',
                    'htmlFor',
                    'id', // It is deprecated because `htmlFor` is its replacement.
                    'initialValue',
                    'isListField',
                    'labelAlign',
                    'labelCol',
                    'normalize',
                    'preserve',
                    'tooltip',
                    'validateFirst',
                    'valuePropName',
                    'wrapperCol',
                    '_internalItemRender'
                ])}
            >
                {/* Label */}
                <FormItemLabel
                    htmlFor={fieldId}
                    required={isRequired}
                    requiredMark={requiredMark}
                    {...props}
                    prefixCls={prefixCls}
                />
                {/* Input Group */}
                <FormItemInput
                    {...props}
                    {...meta}
                    errors={debounceErrors}
                    warnings={debounceWarnings}
                    prefixCls={prefixCls}
                    status={mergedValidateStatus}
                    validateStatus={mergedValidateStatus}
                    help={help}
                >
                    <NoStyleItemContext.Provider value={onSubItemMetaChange}>
                        {baseChildren}
                    </NoStyleItemContext.Provider>
                </FormItemInput>
            </Row>
        );
    }

    if (!hasName && !isRenderProps && !dependencies) {
        return renderLayout(children);
    }

    let variables = {};
    if (typeof label === 'string') {
        variables.label = label;
    } else if (name) {
        variables.label = String(name);
    }
    if (messageVariables) {
        variables = { ...variables, ...messageVariables };
    }

    // >>>>> With Field
    return (
        <Field
            {...props}
            messageVariables={variables}
            trigger={trigger}
            validateTrigger={mergedValidateTrigger}
            onMetaChange={onMetaChange}
        >
            {(control, renderMeta, context) => {
                const mergedName = toArray(name).length && renderMeta ? renderMeta.name : [];
                const fieldId = getFieldId(mergedName, formName);

                const isRequired =
                    required !== undefined
                        ? required
                        : !!(
                              rules &&
                              rules.some(rule => {
                                  if (rule && typeof rule === 'object' && rule.required && !rule.warningOnly) {
                                      return true;
                                  }
                                  if (typeof rule === 'function') {
                                      const ruleEntity = rule(context);
                                      return ruleEntity && ruleEntity.required && !ruleEntity.warningOnly;
                                  }
                                  return false;
                              })
                          );

                // ======================= Children =======================
                const mergedControl = {
                    ...control
                };

                let childNode = null;

                devWarning(
                    !(shouldUpdate && dependencies),
                    'Form.Item',
                    "`shouldUpdate` and `dependencies` shouldn't be used together. See https://ant.design/components/form/#dependencies."
                );
                if (Array.isArray(children) && hasName) {
                    devWarning(false, 'Form.Item', '`children` is array of render props cannot have `name`.');
                    childNode = children;
                } else if (isRenderProps && (!(shouldUpdate || dependencies) || hasName)) {
                    devWarning(
                        !!(shouldUpdate || dependencies),
                        'Form.Item',
                        '`children` of render props only work with `shouldUpdate` or `dependencies`.'
                    );
                    devWarning(
                        !hasName,
                        'Form.Item',
                        "Do not use `name` with `children` of render props since it's not a field."
                    );
                } else if (dependencies && !isRenderProps && !hasName) {
                    devWarning(false, 'Form.Item', 'Must set `name` or use render props when `dependencies` is set.');
                } else if (isValidElement(children)) {
                    devWarning(
                        children.props.defaultValue === undefined,
                        'Form.Item',
                        '`defaultValue` will not work on controlled Field. You should use `initialValues` of Form instead.'
                    );

                    const childProps = { ...children.props, ...mergedControl };
                    if (!childProps.id) {
                        childProps.id = fieldId;
                    }

                    if (supportRef(children)) {
                        childProps.ref = getItemRef(mergedName, children);
                    }

                    // We should keep user origin event handler
                    const triggers = new Set([...toArray(trigger), ...toArray(mergedValidateTrigger)]);

                    triggers.forEach(eventName => {
                        childProps[eventName] = (...args) => {
                            mergedControl[eventName]?.(...args);
                            children.props[eventName]?.(...args);
                        };
                    });

                    childNode = (
                        <MemoInput value={mergedControl[props.valuePropName || 'value']} update={children}>
                            {cloneElement(children, childProps)}
                        </MemoInput>
                    );
                } else if (isRenderProps && (shouldUpdate || dependencies) && !hasName) {
                    childNode = children(context);
                } else {
                    devWarning(
                        !mergedName.length,
                        'Form.Item',
                        '`name` is only used for validate React element. If you are using Form.Item as layout display, please remove `name` instead.'
                    );
                    childNode = children;
                }

                return renderLayout(childNode, fieldId, isRequired);
            }}
        </Field>
    );
}

export default FormItem;
