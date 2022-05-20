import React from 'react';
import { Button, Card, Divider } from 'antd';
import { random } from 'lodash';
import { sleep, isUniq, rules } from '@nbfe/tools';
import Form from '../lib';
import '../lib/index.less';

const { required, selectRequired } = rules;

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
            label: 'label-11'
        },
        {
            value: 12,
            label: 'label-12'
        }
    ],
    2: [
        {
            value: 21,
            label: 'label-21'
        },
        {
            value: 22,
            label: 'label-22'
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
        label: '文',
        name: 'a',
        rules: [required]
    },
    {
        label: '姓名',
        name: 'nameList',
        defaultValue: [11, null],
        // defaultValue: [],
        formListProps: {
            min: 1,
            max: 5,
            entity: '',
            rules: [
                {
                    validator: (rule, value) => {
                        console.log(222);
                        console.log(value);
                        console.log(rule);
                        if (!isUniq(value)) {
                            return Promise.reject(new Error('不得重复'));
                        }
                        return Promise.resolve();
                    }
                }
            ]
        },
        rules: [selectRequired('label')],
        template: {
            tpl: 'select',
            options: selectOptions['1'],
            allItem: { value: null, label: '全部' }
            // allowClear: true
        }
    }
];

export default () => {
    const formRef = React.useRef();

    const handleSubmit = (params, searchParams) => {
        console.log('搜索:');
        console.log(params);
        // console.log(searchParams);
    };

    const handleClick = () => {
        formRef.current.forceUpdateColumns(list => {
            return list.map((v, i) => {
                if (i === 0) {
                    v.visible = false;
                }
                return v;
            });
        });
    };

    return (
        <div style={{ padding: 10 }}>
            <Card title="Descriptions" style={{ marginTop: 10 }} size="small">
                <Button onClick={handleClick} type="primary">
                    隐藏第一个
                </Button>
            </Card>
            <Divider />
            <Form
                ref={formRef}
                cardProps={{ bordered: true }}
                formProps={{ layout: 'horizontal' }}
                columns={columns}
                showSearchBtn={false}
                showResetBtn={false}
            >
                <Button
                    type="primary"
                    onClick={async () => {
                        const data = await formRef.current.getFormData();
                        console.log(data);
                    }}
                >
                    提交
                </Button>
            </Form>
        </div>
    );
};
