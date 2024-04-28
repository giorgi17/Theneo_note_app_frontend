import { Button, Flex, Form, Input, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthRedirect from '../../components/AuthRedirect';
import { AppDispatch, RootState } from '../../store';
import { signup } from '../../store/userSlice';
import { RegisterProps, RegisterValues } from './interfaces';

const Register: React.FC<RegisterProps> = () => {
    const loading = useSelector((state: RootState) => state.user.isLoading);
    const error = useSelector((state: RootState) => state.user.error);
    const navigate = useNavigate();

    const dispatch: AppDispatch = useDispatch();

    const onFinish = (values: RegisterValues) => {
        dispatch(
            signup({
                firstname: values.firstname,
                lastname: values.lastname,
                username: values.username,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                navigate,
            }),
        );
    };

    const form = (
        <Flex justify="center">
            <Form
                name="register form"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, minWidth: 420 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Firstname"
                    name="firstname"
                    rules={[{ required: true, message: 'Please input your firstname!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Lastname"
                    name="lastname"
                    rules={[{ required: true, message: 'Please input your lastname!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>

                {error && (
                    <Form.ErrorList
                        errors={[
                            <div key="errorItem" style={{ color: 'red' }}>
                                {error.message}
                                <br />
                                {error?.data?.[0]?.msg}
                            </div>,
                        ]}
                        helpStatus="error"
                    />
                )}
            </Form>
        </Flex>
    );

    return <Flex justify="center">{loading ? <Spin tip="Loading...">{form}</Spin> : form}</Flex>;
};

export default AuthRedirect(Register);
