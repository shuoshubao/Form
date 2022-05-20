import React from 'react';
import { Card } from 'antd';
import { random } from 'lodash';
import { sleep } from '@nbfe/tools';
import Form from '../lib';

const { Descriptions } = Form;

const mockVal = str => {
    // 模拟搜索不到的情况
    if (str.length > 5) {
        return [];
    }
    return [1, 2, 3].map(v => {
        const name = [str, v].join('');
        return {
            value: name,
            label: `${name}(${name}@qq.com)`
        };
    });
};

const selectOptions = {
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

const cascaderOptions = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou'
            }
        ]
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing'
            }
        ]
    }
];

const treeData = [
    {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
            {
                title: 'Child Node1',
                value: '0-0-1',
                key: '0-0-1'
            },
            {
                title: 'Child Node2',
                value: '0-0-2',
                key: '0-0-2'
            }
        ]
    },
    {
        title: 'Node2',
        value: '0-1',
        key: '0-1'
    }
];

const columns = [
    {
        label: '数字范围',
        name: 'a1,a2',
        tooltip: '数字范围',
        defaultValue: [0.1],
        template: {
            tpl: 'range-number',
            separator: '-',
            min: 0,
            max: 1,
            step: 0.1
        }
    },
    {
        label: '级联',
        name: 'cascader',
        tooltip: '级联',
        transform: value => {
            return value[1] || '';
        },
        template: {
            tpl: 'cascader',
            remoteConfig: {
                fetch: async () => {
                    return {
                        code: 0,
                        data: cascaderOptions,
                        mesg: 'success'
                    };
                },
                path: 'data'
            }
        }
    },
    {
        label: '自动完成',
        name: 'auto-complete',
        tooltip: '自动完成',
        // defaultValue: 'shuoshubao',
        template: {
            tpl: 'auto-complete',
            // options: [
            //     {
            //         label: '硕鼠宝',
            //         value: 'shuoshubao'
            //     }
            // ],
            remoteConfig: {
                fetch: async searchText => {
                    await sleep(0.1);
                    return !searchText ? [] : mockVal(searchText);
                }
            }
        }
    },
    {
        label: '选择树',
        name: 'tree-select',
        tooltip: '自动完成',
        template: {
            tpl: 'tree-select',
            // multiple: true,
            // treeCheckable: true,
            treeDefaultExpandAll: true,
            showCheckedStrategy: 'SHOW_PARENT',
            remoteConfig: {
                fetch: async () => {
                    await sleep(1);
                    return treeData;
                }
            }
        }
    },
    {
        label: '关键字1',
        name: 'a1',
        defaultValue: '123',
        template: {
            inputType: 'input'
        }
    },
    {
        label: '关键字2',
        name: 'a2',
        template: {
            inputType: 'textarea'
        }
    },
    {
        label: '关键字22',
        name: 'a22',
        template: {
            inputType: 'password'
        }
    },
    {
        label: '关键字3',
        name: 'a3,a33',
        visible: false,
        tooltip: ['这里填写姓名', 'a[a|https://ke.com]b'],
        // inline: false,
        defaultValue: ['contractNo', '123'],
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
        label: '下拉框1',
        name: 'a',
        template: {
            tpl: 'select',
            mode: 'multiple',
            allItem: {
                label: '全部'
            },
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
        // defaultValue: [2],
        template: {
            tpl: 'checkbox',
            indeterminate: true,
            defaultSelectAll: true,
            // options: [
            //     {
            //         value: 1,
            //         label: 'a'
            //     },
            //     {
            //         value: 2,
            //         label: 'b'
            //     }
            // ]
            remoteConfig: {
                fetch: async () => {
                    await sleep(1);
                    return {
                        code: 0,
                        data: [
                            {
                                code: 1,
                                label: 'a'
                            },
                            {
                                code: 2,
                                label: 'b'
                            },
                            {
                                code: 3,
                                label: 'c'
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

const DescriptionsData = {
    a: 123,
    b: 456
};

const DescriptionsColumns = [
    {
        label: 'A',
        name: 'a'
    },
    {
        label: 'B',
        name: 'b',
        render: (value, record) => {
            return <div>hhh</div>;
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
        <div style={{ padding: 10 }}>
            <Card title="Form" size="small">
                <Form
                    columns={columns}
                    onSubmit={onSubmit}
                    showSearchBtn
                />
            </Card>
            <Card title="Descriptions" style={{ marginTop: 10 }} size="small">
                <Descriptions data={DescriptionsData} columns={DescriptionsColumns} />
            </Card>
        </div>
    );
};
