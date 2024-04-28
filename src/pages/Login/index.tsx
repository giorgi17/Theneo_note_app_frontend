import { Button, Checkbox, Flex, Form, Input, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import AuthRedirect from '../../components/AuthRedirect';
import { AppDispatch, RootState } from '../../store';
import { LoginProps, LoginValues } from './interfaces';
import { login } from '../../store/userSlice';
import { Link } from 'react-router-dom';
import PathConstants from '../../routes/pathConstants';

const Login: React.FC<LoginProps> = () => {
    const loading = useSelector((state: RootState) => state.user.isLoading);
    const error = useSelector((state: RootState) => state.user.error);

    const dispatch: AppDispatch = useDispatch();

    const onFinish = (values: LoginValues) => {
        dispatch(login({ email: values.email, password: values.password }));
    };

    const form = (
        <Form
            name="login form"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ maxWidth: 600, minWidth: 300 }}
        >
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" type="email" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item>
                <Flex justify="space-between">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Flex>
            </Form.Item>

            <Form.Item>
                <Flex vertical>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    <div>
                        or <Link to={PathConstants.REGISTER}>Register</Link>
                    </div>
                </Flex>
            </Form.Item>

            {error && (
                <Form.ErrorList
                    errors={[
                        <div key="errorItem" style={{ color: 'red' }}>
                            {error.message}
                        </div>,
                    ]}
                    helpStatus="error"
                />
            )}
        </Form>
    );

    return <Flex justify="center">{loading ? <Spin tip="Loading...">{form}</Spin> : form}</Flex>;
};

export default AuthRedirect(Login);
