import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { map, omit, pick, isObject, cloneDeep, noop } from 'lodash';
import { convertDataToEnum } from '@nbfe/tools';
import { getDisplayName } from './util';

class Index extends Component {
    static displayName = getDisplayName('Checkbox');

    static defaultProps = {
        // 是否展示全部
        indeterminate: false
    };

    static propTypes = {
        indeterminate: PropTypes.bool,
        value: PropTypes.any,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);
        const value = cloneDeep(props.value);
        const options = cloneDeep(props.options);
        this.state = {
            checkedList: value,
            indeterminate: value.length && options.length !== value.length,
            checkAll: options.length === value.length
        };
    }

    onCheckAllChange = e => {
        const options = cloneDeep(this.props.options);
        const { checked } = e.target;
        const checkedList = checked ? map(options, 'value') : [];
        this.setState({ checkAll: checked, checkedList, indeterminate: false });
        this.props.onChange(checkedList);
    };

    render() {
        const { props, state } = this;
        const { value, onChange, options } = props;
        const { indeterminate, checkAll } = state;
        const componentProps = omit(props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'indeterminate']);
        return (
            <Fragment>
                {!!props.indeterminate && (
                    <Checkbox indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={checkAll}>
                        全选
                    </Checkbox>
                )}
                <Checkbox.Group
                    {...componentProps}
                    value={value}
                    onChange={val => {
                        onChange(val);
                        this.setState({
                            indeterminate: val.length && options.length !== val.length,
                            checkAll: options.length === val.length
                        });
                        if (props.onCustomChange) {
                            props.onCustomChange();
                        }
                    }}
                />
            </Fragment>
        );
    }
}

export default Index;
