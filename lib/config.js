export const componentName = 'DynaSearch';

export const defaulCardProps = {
    size: 'small',
    bordered: false
};
export const defaulFormProps = {
    layout: 'inline'
};

// Form.Item tooltip 与文字的边距
export const formItemTooltopMargin = 5;

// 默认 column
export const defaultColumn = {
    label: '',
    name: '', // 当 tpl = 'range-picker' 时, 传数组
    visible: true,
    defaultValue: '',
    immediate: true,
    tooltip: '',
    placeholder: '',
    isSearch: false,
    inline: true,
    style: {},
    formItemStyle: {},
    template: {
        tpl: 'input',
        width: 200
    }
};

export const pickerFormatMap = {
    date: 'YYYY-MM-DD',
    year: 'YYYY',
    month: 'YYYY-MM',
    week: 'YYYY-wo',
    quarter: 'quarter' // todo: Q1,Q2,Q3,Q4
};

// Input select + input 拼接的分隔符
// 日期范围 开始时间 + 结束时间 拼接的分隔符
export const searchSeparator = '___';

// Input 的 inputType 属性
export const inputTypeList = ['input', 'search', 'select-search', 'select-input'];
