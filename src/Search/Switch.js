import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import { debounce, isFunction, omit, merge } from 'lodash';

class Index extends Component {
    static displayName = 'SearchSwitch';
    static defaultProps = {};

    static propTypes = {
        value: PropTypes.bool,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        console.log(333, this.props);
    }

    onChange = (checked, event) => {
        if (isFunction(this.props.onChange)) {
            this.props.onChange(checked, event);
        }
    };

    render() {
        const { defaultValue, value, style } = this.props;
        console.log(111, defaultValue);
        console.log(222, this.props);
        const { onChange } = this;
        const switchProps = omit(this.props, ['value', 'defaultValue', 'onChange', 'style']);
        return <div style={style}>
            <Switch checked={value} defaultChecked={defaultValue} onChange={onChange} {...switchProps} />
        </div>;
    }
}

export default Index;
