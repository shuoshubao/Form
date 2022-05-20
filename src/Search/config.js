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
    prop: '',
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
