import { Button, Layout, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../../MainHeader';
import { Error404Props } from './interfaces';

const Error404: React.FC<Error404Props> = () => {
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <MainHeader />

            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        Back Home
                    </Button>
                }
            />
        </Layout>
    );
};

export default Error404;
