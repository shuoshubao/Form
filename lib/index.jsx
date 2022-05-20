import './index.scss';
import getFormV3 from './FormV3.jsx';
import Form from './Form.jsx';
import { isAntdV3 } from './config';

export default isAntdV3 ? getFormV3() : Form;
