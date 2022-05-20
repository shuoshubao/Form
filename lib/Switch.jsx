import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import { isFunction, omit } from 'lodash';

class Index extends Component {
    static displayName = 'SearchSwitch';
    static defaultProps = {};

    static propTypes = {
        value: PropTypes.bool,
        onChange: PropTypes.func
    };

    onChange = (checked, event) => {
        if (isFunction(this.props.onChange)) {
            this.props.onChange(checked, event);
        }
    };

    render() {
        const { defaultValue, value, style } = this.props;
        const { onChange } = this;
        const switchProps = omit(this.props, ['value', 'defaultValue', 'onChange', 'style']);
        return (
            <div style={style}>
                <Switch checked={value} defaultChecked={defaultValue} onChange={onChange} {...switchProps} />
            </div>
        );
    }
}

export default Index;
