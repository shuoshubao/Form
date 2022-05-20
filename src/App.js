import React from 'react';
import { Button, Card, Divider, Space, Input } from 'antd';
import { random, isString } from 'lodash';
import moment from 'moment';
import { sleep, isUniq, rules } from '@nbfe/tools';
import Form from '../lib';
import '../lib/index.less';

const { required, selectRequired } = rules;

const columns = [
    {
        label: '图片',
        name: 'img',
        rules: [required],
        transform: value => {
            return value?.response?.data?.url || value;
            // return value.map(v => {
            //     return v.url || v?.response?.data?.url || v;
            // })
        },
        // defaultValue: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        template: {
            tpl: 'upload',
            // limit: 4,
            listType: 'picture-card',
            action: '/picture/upload'
            // customRequest: ({ file, filename, onSuccess, onError }) => {
            //     fetch('/picture/upload', {
            //         method: 'POST',
            //     }).then(res => res.json()).then(res => {
            //         console.log(111)
            //         console.log(res)
            //         console.log(res.data)
            //         onSuccess(res, file)
            //     }).catch(onError)
            // }
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
