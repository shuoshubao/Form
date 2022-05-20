import Search from './Search';

const columns = [
    {
        label: '隐藏',
        prop: 'visibility',
        visible: false
    },
    {
        label: '姓名',
        prop: 'b',
        tooltip: ['这里填写姓名', 'a[a|https://ke.com]b']
    },
    {
        label: '性别',
        prop: 'c',
        defaultValue: 2,
        template: {
            tpl: 'select',
            allowClear: true,
            data: [
                { label: '男', value: 1 },
                { label: '女', value: 2 }
            ]
        }
    },
    {
        label: '创建时间1',
        prop: 'd',
        tooltip: '创建时间1',
        template: {
            tpl: 'date-picker'
        }
    },
    {
        label: '创建时间2',
        prop: 'd1',
        template: {
            tpl: 'date-picker',
            format: 'YYYY-MM-DD HH:mm',
            showTime: true
        }
    },
    {
        label: '创建时间3',
        prop: 'd2',
        template: {
            tpl: 'date-picker',
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true
        }
    },
    {
        label: '创建时间4',
        prop: 'd3',
        template: {
            tpl: 'date-picker',
            picker: 'month'
        }
    },
    {
        label: '时间区间',
        prop: 'e',
        template: {
            tpl: 'range-picker',
            format: 'YYYY-MM-DD HH:mm:ss',
            startTimeKey: 'sTime',
            endTimeKey: 'eTime'
        }
    }
];

const App = () => {
    return (
        <div className="App" style={{ padding: 10, background: '#edf0f3' }}>
            <Search columns={columns} />
        </div>
    );
};

export default App;
