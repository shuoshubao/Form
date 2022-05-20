/*
 * @Author: shuoshubao
 * @Date:   2022-04-20 17:50:17
 * @Last Modified by:   fangt11
 * @Last Modified time: 2022-04-20 18:29:58
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';
import * as ColorsPicker from 'react-color';
import { without } from 'lodash';
import { DownOutlined } from './Icons';
import { getDisplayName, getClassNames } from './util';

class Index extends Component {
    static displayName = getDisplayName('ColorPicker');

    static defaultProps = {
        type: 'SwatchesPicker'
    };

    static propTypes = {
        type: PropTypes.oneOf(without(Object.keys(ColorsPicker), 'default'))
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    render() {
        const { state, props } = this;
        const { value, onChange, type, style } = props;
        const { visible } = state;

        const getOverlay = type => {
            const ColorPicker = ColorsPicker[type];
            return (
                <ColorPicker
                    color={value}
                    onChange={color => {
                        onChange(color.hex);
                        this.setState({ visible: false });
                    }}
                />
            );
        };

        const handleToggleVisible = () => {
            this.setState({ visible: !visible });
        };

        return (
            <Dropdown.Button
                visible={visible}
                onClick={handleToggleVisible}
                overlay={getOverlay(type)}
                icon={
                    <span onClick={handleToggleVisible}>
                        <DownOutlined />
                    </span>
                }
                className={getClassNames('color-picker')}
            >
                <div style={{ width: style.width - 32, height: '100%', background: value }} />
            </Dropdown.Button>
        );
    }
}

export default Index;
