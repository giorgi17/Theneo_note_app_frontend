import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FloatButton, Layout } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useDesignTokens } from '../../themes/helpers';
import MainHeader from '../MainHeader';

import { MainLayoutProps } from './interfaces';

const MainLayout: React.FC<MainLayoutProps> = ({}) => {
    const tokens = useDesignTokens();
    const navigate = useNavigate();

    const location = useLocation();
    const currentUrl = location.pathname;

    const showNewPostButton = !currentUrl.includes('/edit-note') && !currentUrl.includes('/new-note');

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <MainHeader />

            {showNewPostButton && (
                <FloatButton
                    tooltip={<div>Add new Post</div>}
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => navigate('/new-note')}
                />
            )}

            <Content
                style={{
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    paddingTop: tokens.paddingXL,
                    paddingBottom: tokens.paddingXL,
                    marginTop: tokens.marginXXL,
                }}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </Content>
        </Layout>
    );
};

export default MainLayout;
