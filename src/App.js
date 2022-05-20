import React from 'react';
import { random } from 'lodash';
import { sleep } from '@nbfe/tools';
import Form from '../lib';

const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat)
});

const selectData = {
    1: [
        {
            value: 11,
            label: '11'
        },
        {
            value: 12,
            label: '12'
        }
    ],
    2: [
        {
            value: 21,
            label: '21'
        },
        {
            value: 22,
            label: '22'
        }
    ]
};

const columns = [
    {
        label: '数字范围',
        name: 'a1,a2',
        tooltip: '数字范围',
        defaultValue: [0.1],
        template: {
            tpl: 'range-number',
            inputNumberProps: {
                min: 0,
                max: 1,
                step: 0.1
            }
        }
    },
    {
        label: '关键字3',
        name: 'a3,a31',
        tooltip: ['这里填写姓名', 'a[a|https://ke.com]b'],
        inline: false,
        template: {
            inputType: 'select-search',
            options: [
                {
                    label: '交易编号',
                    value: 'businessCode'
                },
                {
                    label: '合同编号',
                    value: 'contractNo'
                },
                {
                    label: '买方',
                    value: 'buyerName'
                },
                {
                    label: '卖方',
                    value: 'sellerName'
                }
            ]
        }
    },
    // {
    //     label: '创建时间1',
    //     name: 'b',
    //     tooltip: '创建时间1',
    //     template: {
    //         tpl: 'date-picker'
    //     }
    // },
    {
        label: '级联',
        name: 'b2',
        tooltip: '级联',
        template: {
            tpl: 'cascader'
        }
    },
    {
        label: '下拉框1',
        name: 'a',
        template: {
            tpl: 'select',
            options: [
                {
                    value: 1,
                    label: 'a'
                },
                {
                    value: 2,
                    label: 'b'
                }
            ]
        }
    },
    {
        label: 'checkbox',
        name: 'b',
        defaultValue: [1],
        template: {
            tpl: 'checkbox',
            options: [
                {
                    value: 1,
                    label: 'a'
                },
                {
                    value: 2,
                    label: 'b'
                }
            ]
        }
    },
    {
        label: 'slider',
        name: 'slider',
        defaultValue: 1,
        template: {
            tpl: 'slider'
        }
    },
    {
        label: 'switch',
        name: 'switch',
        defaultValue: true,
        template: {
            tpl: 'switch'
        }
    },
    {
        label: '下拉框2',
        name: 'c',
        defaultValue: 1,
        template: {
            tpl: 'select',
            allowClear: true,
            allItem: { value: null, label: '全部' },
            options: [],
            remoteConfig: {
                fetch: async () => {
                    await sleep(1);
                    return {
                        code: 0,
                        data: [
                            {
                                code: 1,
                                label: 'aa'
                            },
                            {
                                code: 2,
                                label: 'bb'
                            }
                        ],
                        message: '成功'
                    };
                },
                path: 'data',
                valueKey: 'code',
                process: data => {
                    // console.log(123);
                    // console.log(data);
                }
            }
        }
    }
];

export default () => {
    const onSubmit = (params, searchParams) => {
        console.log('搜索:');
        console.log(params);
        // console.log(searchParams);
    };
    return (
        <div className="App" style={{ padding: 10, background: '#edf0f3' }}>
            <Form
                columns={columns}
                onSubmit={onSubmit}
                showSearchBtn
                onValuesChange={({ key, value }, { columns, updateColumns, setFieldsValue }) => {
                    console.log(333);
                    console.log(key, value);
                    if (key === 'a') {
                        columns.forEach(v => {
                            if (v.name === 'b') {
                                v.template.options = selectData[value] || [];
                                setFieldsValue({ b: undefined });
                                updateColumns(columns);
                            }
                        });
                    }
                    console.log(columns);
                    // console.log(allFields);
                }}
            />
        </div>
    );
};
