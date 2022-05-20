import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { omit, last, isNumber } from 'lodash';
import { Tabs } from './antd';
import { getDisplayName } from './util.jsx';

const { TabPane } = Tabs;

// 字符串的数字 '1' '123'
const isNumberString = val => {
    return String(Number(val)) === val;
};

class Index extends Component {
    static displayName = getDisplayName('Tabs');

    static defaultProps = {};

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        column: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        const { props } = this;
        const { onChange, onCustomChange, column, options } = props;
        const shouldBeNumber = isNumber(last(options).value);
        const innerValue = String(props.value);
        const tabsProps = omit(props, ['column', 'defaultValue', 'value', 'onChange', 'onCustomChange', 'style']);
        return (
            <Tabs
                animated={false}
                {...tabsProps}
                activeKey={innerValue}
                defaultActiveKey={innerValue}
                onChange={activeKey => {
                    onChange(shouldBeNumber ? Number(activeKey) : activeKey);
                    onCustomChange();
                }}
            >
                {options.map(v => {
                    const { value, label } = v;
                    return <TabPane tab={label} key={value} />;
                })}
            </Tabs>
        );
    }
}

export default Index;
