import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slider, InputNumber } from './antd';
import { isFunction, omit } from 'lodash';

class Index extends Component {
    static displayName = 'DynamicFormSlider';

    static defaultProps = {
        InputNumberWidth: 65
    };

    static propTypes = {
        value: PropTypes.number,
        onChange: PropTypes.func,
        InputNumberWidth: PropTypes.number
    };

    onChange = value => {
        this.props.onChange(value);
    };

    render() {
        const { defaultValue, value, style, InputNumberWidth } = this.props;
        const { onChange } = this;
        const SliderProps = omit(this.props, ['defaultValue', 'value', 'onChange', 'style', 'InputNumberWidth']);
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    ...style
                }}
            >
                <Slider
                    style={{ width: style.width - InputNumberWidth - 20 }}
                    value={value}
                    onChange={onChange}
                    {...SliderProps}
                />
                <InputNumber style={{ width: InputNumberWidth }} value={value} onChange={onChange} {...SliderProps} />
            </div>
        );
    }
}

export default Index;
