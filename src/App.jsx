import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import Search from '../lib';

const columns = [
    {
        label: '关键字',
        name: 'a1',
        tooltip: ['这里填写姓名', 'a[a|https://ke.com]b'],
        template: {
            inputType: 'search',
        }
    },
    {
        label: '关键字',
        name: 'a2',
        tooltip: ['这里填写姓名', 'a[a|https://ke.com]b'],
        template: {
            inputType: 'search',
            enterButton: '搜索'
        }
    },
    // {
    //     label: '姓名',
    //     name: 'b',
    //     tooltip: ['这里填写姓名', 'a[a|https://ke.com]b']
    // },
    // {
    //     label: '搜索框',
    //     name: 'a',
    //     template: {
    //         inputType: 'search',
    //         prefix: <UserOutlined />,
    //         // addonAfter: 'addonAfter',
    //         enterButton: true,
    //         allowClear: true
    //     }
    // },
    // {
    //     label: '性别',
    //     name: 'c',
    //     defaultValue: 2,
    //     template: {
    //         tpl: 'select',
    //         allowClear: true,
    //         options: [
    //             { label: '男', value: 1, disabled: true },
    //             { label: '女', value: 2 }
    //         ]
    //     }
    // },
    // {
    //     label: '地区',
    //     name: 'c2',
    //     defaultValue: ['zhejiang', 'hangzhou', 'xihu'],
    //     template: {
    //         tpl: 'cascader',
    //         allowClear: true,
    //         expandTrigger: 'hover',
    //         options: [
    //             {
    //                 value: 'zhejiang',
    //                 label: 'Zhejiang',
    //                 children: [
    //                     {
    //                         value: 'hangzhou',
    //                         label: 'Hangzhou',
    //                         children: [
    //                             {
    //                                 value: 'xihu',
    //                                 label: 'West Lake'
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 value: 'jiangsu',
    //                 label: 'Jiangsu',
    //                 children: [
    //                     {
    //                         value: 'nanjing',
    //                         label: 'Nanjing',
    //                         children: [
    //                             {
    //                                 value: 'zhonghuamen',
    //                                 label: 'Zhong Hua Men'
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // },
    // {
    //     label: '创建时间1',
    //     name: 'd',
    //     tooltip: '创建时间1',
    //     template: {
    //         tpl: 'date-picker'
    //     }
    // },
    // {
    //     label: '创建时间2',
    //     name: 'd1',
    //     template: {
    //         tpl: 'date-picker',
    //         format: 'YYYY-MM-DD HH:mm',
    //         showTime: true
    //     }
    // },
    // {
    //     label: '创建时间3',
    //     name: 'd2',
    //     template: {
    //         tpl: 'date-picker',
    //         format: 'YYYY-MM-DD HH:mm:ss',
    //         showTime: true
    //     }
    // },
    // {
    //     label: '创建时间4',
    //     name: 'd3',
    //     template: {
    //         tpl: 'date-picker',
    //         picker: 'month'
    //     }
    // },
    {
        label: '时间区间',
        name: 'sTime,eTime',
        inline: false,
        template: {
            tpl: 'range-picker',
            format: 'YYYY-MM-DD HH:mm:ss',
        }
    },
    // {
    //     label: '状态',
    //     name: 'f',
    //     inline: false,
    //     // defaultValue: 2,
    //     template: {
    //         tpl: 'radio',
    //         options: [
    //             { label: '待存管', value: 1 },
    //             { label: '部分存管', value: 2, disabled: true },
    //             { label: '存管完成', value: 3 },
    //             { label: '已解冻', value: 4 }
    //         ]
    //     }
    // },
    // {
    //     label: '状态',
    //     name: 'g',
    //     inline: false,
    //     template: {
    //         tpl: 'checkbox',
    //         options: [
    //             { label: '待存管', value: 1 },
    //             { label: '部分存管', value: 2, disabled: true },
    //             { label: '存管完成', value: 3 },
    //             { label: '已解冻', value: 4 }
    //         ]
    //     }
    // },
    // {
    //     label: '开关',
    //     name: 'h',
    //     defaultValue: true,
    //     template: {
    //         tpl: 'switch'
    //     }
    // }
];

export default () => {
    const onSubmit = (params, searchParams) => {
        console.log('搜索:');
        console.log(params);
        // console.log(searchParams);
    };
    return (
        <div className="App" style={{ padding: 10, background: '#edf0f3' }}>
            <Search columns={columns} onSubmit={onSubmit} />
        </div>
    );
};
