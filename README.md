# 简介

基于 [antd-form](https://ant.design/components/form-cn/) 进行二次封装

# 安装

```text
npm i @nbfe/form
```

# 使用

```js
import Form from '@nbfe/form';

const onSubmit = params => {
    console.log(params);
};

<Form
    onSubmit={onSubmit} // 搜索事件
    columns={searchColumns} // 表单的配置
    showResetBtn={true} // 展示重置按钮
    showSearchBtn={false} // 展示搜索按钮
    autoSubmit={true} // 自动触发搜索
    disabled={false} // 详情模式
    labelWidth={0} // label 的 width, 默认是内部自动计算
    cardProps={{}} // Card 的属性 https://ant.design/components/card-cn/#API
    formProps={{}} // Form 的属性 https://ant.design/components/form-cn/#API
    visibleFilterPanel={false} // 是否显示 筛选区
/>;
```
