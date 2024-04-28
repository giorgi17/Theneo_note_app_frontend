import { Flex, Menu, MenuProps } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PathConstants from '../../routes/pathConstants';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/userSlice';
import { useDesignTokens } from '../../themes/helpers';
import { MainHeaderProps } from './interfaces';

const MainHeader: React.FC<MainHeaderProps> = () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const dispatch: AppDispatch = useDispatch();
    const tokens = useDesignTokens();
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn);

    const pathname = location.pathname;

    useEffect(() => {
        if (pathname === PathConstants.HOME) {
            setSelectedKeys(['Home']);
        } else if (pathname === PathConstants.CATEGORIES) {
            setSelectedKeys(['Categories']);
        } else if (pathname === PathConstants.NOTES_SEARCH) {
            setSelectedKeys(['Notes search']);
        } else if (pathname === PathConstants.LOGIN) {
            setSelectedKeys(['Login']);
        } else if (pathname === PathConstants.REGISTER) {
            setSelectedKeys(['Register']);
        } else {
            setSelectedKeys([]);
        }
    }, [pathname]);

    const rightMenuItems: MenuProps['items'] = [];

    const leftMenuItems: MenuProps['items'] = [
        {
            label: <Link to={PathConstants.HOME}>Home</Link>,
            key: 'Home',
        },
    ];

    const bottomMenuItems: MenuProps['items'] = [];

    // Conditionally add the "Login" menu item if not logged in
    if (!loggedIn) {
        rightMenuItems.unshift({
            label: <Link to={PathConstants.LOGIN}>Login</Link>,
            key: 'Login',
        });
        rightMenuItems.unshift({
            label: <Link to={PathConstants.REGISTER}>Register</Link>,
            key: 'Register',
        });
    } else {
        rightMenuItems.unshift({
            label: <span onClick={() => dispatch(logout())}>Logout</span>,
            key: 'Logout',
        });
    }

    bottomMenuItems.push({
        label: <Link to={PathConstants.CATEGORIES}>Categories</Link>,
        key: 'Categories',
    });

    bottomMenuItems.push({
        label: <Link to={PathConstants.NOTES_SEARCH}>Notes Search</Link>,
        key: 'Notes search',
    });

    return (
        <Header>
            <Flex justify="space-between" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={selectedKeys}
                    items={leftMenuItems}
                    disabledOverflow
                />
                This is MainHeader
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={selectedKeys}
                    items={rightMenuItems}
                    disabledOverflow
                />
            </Flex>

            <Menu
                mode="horizontal"
                items={bottomMenuItems}
                selectedKeys={selectedKeys}
                disabledOverflow
                style={{ textAlign: 'center', marginBottom: tokens.marginLG }}
            />
        </Header>
    );
};

export default MainHeader;
