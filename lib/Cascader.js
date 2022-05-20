import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import { omit, pick, isObject, cloneDeep } from 'lodash';
import { convertDataToEnum } from '@nbfe/tools';
import { getDisplayName } from './util';

class Index extends Component {
    static displayName = getDisplayName('Cascader');

    static defaultProps = {};

    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        remoteConfig: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            options: cloneDeep(props.options)
        };
    }

    async componentDidMount() {
        const { props } = this;
        const { remoteConfig } = props;
        if (!isObject(remoteConfig)) {
            return;
        }
        const { fetch: fetchFunc } = remoteConfig;
        const options = await fetchFunc();
        this.setState({ options });
    }

    render() {
        const { props, state } = this;
        const { value, onChange } = props;
        const { options } = state;
        const componentProps = omit(props, [
            'defaultValue',
            'value',
            'onChange',
            'onCustomChange',
            'options',
            'remoteConfig'
        ]);
        return (
            <Cascader
                {...componentProps}
                value={value}
                options={options}
                onChange={val => {
                    onChange(val);
                    if (props.onCustomChange) {
                        props.onCustomChange();
                    }
                }}
            />
        );
    }
}

export default Index;
