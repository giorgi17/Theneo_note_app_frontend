import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from 'antd/es/typography/Title';
import { AppDispatch, RootState } from '../../store';
import { changeFetchedNotesPage, getNotes } from '../../store/noteSlice';
import { HomeProps } from './interfaces';
import { useDesignTokens } from '../../themes/helpers';
import Flex from 'antd/es/flex';
import { Button, Card, Pagination, Segmented, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { GetNotesRequest } from '../../store/interfaces';

const Home: React.FC<HomeProps> = () => {
    const [sortConfig, setSortConfig] = useState<GetNotesRequest['sort']>({
        name: 'createdAt',
        order: -1,
    });

    const loading = useSelector((state: RootState) => state.note.isLoading);
    const error = useSelector((state: RootState) => state.note.error);
    const notes = useSelector((state: RootState) => state.note.notes.data);
    const currentPage = useSelector((state: RootState) => state.note.notes.currentPage);
    const totalItems = useSelector((state: RootState) => state.note.notes.totalItems);

    const dispatch: AppDispatch = useDispatch();
    const tokens = useDesignTokens();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(
            getNotes({
                page: currentPage,
                perPage: 5,
                sort: {
                    name: sortConfig.name,
                    order: sortConfig.order,
                },
            }),
        );
    }, [dispatch, currentPage, sortConfig.name, sortConfig.order]);

    const sortNameHandler = (value: GetNotesRequest['sort']['name']) => {
        setSortConfig((current) => ({ ...current, name: value }));
    };

    const sortOrderHandler = (value: 'ascending' | 'descending') => {
        let formattedOrder: 1 | -1;
        if (value === 'ascending') {
            formattedOrder = 1;
        } else {
            formattedOrder = -1;
        }

        setSortConfig((current) => ({ ...current, order: formattedOrder }));
    };

    return (
        <div style={{ marginTop: tokens.marginXXL }}>
            <Card style={{ textAlign: 'center' }}>
                <Title style={{ textAlign: 'center', marginBottom: tokens.marginLG }}>Sort By</Title>
                <Segmented<GetNotesRequest['sort']['name']>
                    options={['createdAt', 'updatedAt', 'category', 'title']}
                    onChange={sortNameHandler}
                />
                <br /> <br />
                <Segmented<'ascending' | 'descending'>
                    options={['descending', 'ascending']}
                    onChange={sortOrderHandler}
                />
            </Card>

            <Title style={{ textAlign: 'center', marginBottom: tokens.marginLG }}>All notes</Title>
            <Flex vertical gap={tokens.margin} align="center">
                {loading && <Card title="loading" loading={true} style={{ width: 600 }} />}

                {!loading && notes?.length === 0 && <Title level={2}>No notes to display.</Title>}

                {!loading && error && (
                    <Title level={2} color="red">
                        There has been an error while fetching notes.
                    </Title>
                )}

                {notes.length > 0 &&
                    notes.map((item) => (
                        <Flex justify="flex-start" align="flex-start" gap={tokens.marginMD} key={item._id}>
                            <Card
                                title={item.title}
                                bordered={false}
                                style={{ width: 600 }}
                                hoverable
                                onClick={() => navigate(`/note/${item._id}`)}
                            >
                                {item.isPrivate && (
                                    <LockOutlined
                                        style={{ fontSize: '20px', position: 'absolute', top: 10, right: 10 }}
                                    />
                                )}

                                <Flex vertical gap={tokens.marginSM}>
                                    {item.description}
                                    <Typography.Text type="secondary">{item.creator[0].username}</Typography.Text>
                                </Flex>
                            </Card>

                            <Button onClick={() => navigate(`/edit-note/${item._id}`)}>
                                <EditOutlined />
                            </Button>
                        </Flex>
                    ))}

                <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    total={totalItems}
                    pageSize={5}
                    onChange={(page, pageSize) => dispatch(changeFetchedNotesPage(page))}
                    style={{ marginTop: tokens.marginXXL }}
                />
            </Flex>
        </div>
    );
};

export default Home;
