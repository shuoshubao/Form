import InternalForm, { useForm } from './Form';
import Item from './FormItem';
import ErrorList from './ErrorList';
import List from './FormList';
import { FormProvider } from './context';
import devWarning from './_util/devWarning';

const Form = InternalForm;

Form.Item = Item;
Form.List = List;
Form.ErrorList = ErrorList;
Form.useForm = useForm;
Form.Provider = FormProvider;
Form.create = () => {
    devWarning(false, 'Form', 'antd v4 removed `Form.create`. Please remove or use `@ant-design/compatible` instead.');
};

export default Form;
