import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Flex, Select, Typography, DatePicker, Input, Button, Pagination, Checkbox, CheckboxProps } from 'antd';
import dayjs from 'dayjs';
import Title from 'antd/es/typography/Title';
import { AppDispatch, RootState } from '../../store';
import { getCategories } from '../../store/categorySlice';
import { getUsers } from '../../store/userSlice';
import { useDesignTokens } from '../../themes/helpers';
import { NotesSearchProps, NoUndefinedRangeValueType } from './interfaces';
import { changeNotesSearchPage, getSearchedNotes } from '../../store/noteSlice';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { GetSearchedNotesRequest } from '../../store/interfaces';

const NotesSearch: React.FC<NotesSearchProps> = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCreatedAtDates, setSelectedCreatedAtDates] = useState<{ from: Date; to: Date }>();
    const [selectedUpdateAtDates, setSelectedUpdateAtDates] = useState<{ from: Date; to: Date }>();
    const [selectedUsers, setSelectedUsers] = useState<string[]>();
    const [selectedCategories, setSelectedCategories] = useState<string[]>();
    const [selectedAllUsers, setSelectedAllUsers] = useState<boolean>(false);

    const tokens = useDesignTokens();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    // Fetched Categories and Users
    const categories = useSelector((state: RootState) => state.category.categories.items);
    const users = useSelector((state: RootState) => state.user.users);

    const notes = useSelector((state: RootState) => state.note.searchedNotes.data);
    const usersWithMatchedFilter = useSelector((state: RootState) => state.note.searchedNotes.usersWithMatchedFilter);
    const currentPage = useSelector((state: RootState) => state.note.searchedNotes.currentPage);
    const totalItems = useSelector((state: RootState) => state.note.searchedNotes.totalItems);
    const loading = useSelector((state: RootState) => state.note.isLoading);
    const error = useSelector((state: RootState) => state.note.error);

    useEffect(() => {
        dispatch(getCategories({ page: 1, perPage: 5, noPaginate: true }));
        dispatch(getUsers());
    }, [dispatch]);

    const userSelectHandler = (selectedUsersUpdated: string[]) => {
        setSelectedUsers(selectedUsersUpdated);
    };

    const categorySelectHandler = (selectedCategoriesUpdated: string[]) => {
        setSelectedCategories(selectedCategoriesUpdated);
    };

    const searchTextHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const selectAllUsersHandler: CheckboxProps['onChange'] = (e) => {
        setSelectedAllUsers(e.target.checked);
    };

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const { RangePicker } = DatePicker;

    const createdAtRangeHandler =
        (dateType: 'creation' | 'update') => (dates: NoUndefinedRangeValueType<dayjs.Dayjs> | null) => {
            const fromDate = dates?.[0]?.toDate();
            const toDate = dates?.[1]?.toDate();

            if (fromDate && toDate) {
                if (dateType === 'creation') {
                    setSelectedCreatedAtDates({
                        from: fromDate,
                        to: toDate,
                    });
                } else {
                    setSelectedUpdateAtDates({
                        from: fromDate,
                        to: toDate,
                    });
                }
            }
        };

    const filterConfig = useMemo(() => {
        const filterObj: GetSearchedNotesRequest['filters'] = {};

        if (selectedCreatedAtDates) {
            filterObj.createdAt = {
                from: selectedCreatedAtDates.from.toISOString(),
                to: selectedCreatedAtDates.to.toISOString(),
            };
        }

        if (selectedUpdateAtDates) {
            filterObj.updatedAt = {
                from: selectedUpdateAtDates.from.toISOString(),
                to: selectedUpdateAtDates.to.toISOString(),
            };
        }

        if (selectedCategories && selectedCategories.length) {
            filterObj.categories = selectedCategories;
        }

        if (selectedUsers && selectedUsers.length) {
            filterObj.creators = {
                selected: selectedUsers,
                selectAll: selectedAllUsers,
            };
        }

        if (selectedAllUsers) {
            filterObj.creators = {
                selected: selectedUsers || [],
                selectAll: selectedAllUsers,
            };
        }

        return filterObj;
    }, [selectedAllUsers, selectedCategories, selectedCreatedAtDates, selectedUpdateAtDates, selectedUsers]);

    const searchHandler = (page: number) => {
        if (searchText !== '') {
            dispatch(
                getSearchedNotes({
                    page,
                    perPage: 5,
                    searchText,
                    ...((filterConfig?.createdAt ||
                        filterConfig?.updatedAt ||
                        filterConfig?.categories ||
                        filterConfig?.creators) && { filters: filterConfig }),
                }),
            );
            dispatch(changeNotesSearchPage(page));
        }
    };

    const usersNotMatchedFilterIds = useMemo(() => {
        return usersWithMatchedFilter.filter((item) => !item.matchedFilter).map((item) => item._id);
    }, [usersWithMatchedFilter]);

    return (
        <div style={{ marginTop: tokens.marginXXL, paddingBottom: tokens.paddingXL }}>
            <Card style={{ textAlign: 'center' }}>
                <Title style={{ textAlign: 'center' }}>Filters</Title>

                <Flex style={{ width: '100%', marginBottom: tokens.marginXL }} vertical gap={tokens.marginMD}>
                    <Flex gap={tokens.marginSM} justify="center" align="center">
                        <Typography.Text style={{ whiteSpace: 'nowrap' }}>Search text:</Typography.Text>
                        <Input onChange={searchTextHandler} />
                    </Flex>

                    <Flex gap={tokens.marginSM} justify="center" align="center">
                        <Typography.Text>Creation date:</Typography.Text>
                        <RangePicker onChange={createdAtRangeHandler('creation')} showTime style={{ flex: 1 }} />
                    </Flex>

                    <Flex gap={tokens.marginSM} justify="center" align="center">
                        <Typography.Text>Update date:</Typography.Text>
                        <RangePicker onChange={createdAtRangeHandler('update')} showTime style={{ flex: 1 }} />
                    </Flex>

                    <Flex gap={tokens.marginSM} justify="center" align="center">
                        <Typography.Text>Categories:</Typography.Text>
                        <Select
                            showSearch
                            mode="multiple"
                            placeholder="Select a category"
                            optionFilterProp="children"
                            onChange={categorySelectHandler}
                            filterOption={filterOption}
                            options={categories.map((item) => ({ value: item._id, label: item.title }))}
                            style={{ flex: 1 }}
                        />
                    </Flex>

                    <Flex gap={tokens.marginSM} justify="center" align="center">
                        <Typography.Text>Users:</Typography.Text>
                        <Select
                            mode="multiple"
                            placeholder="Select users"
                            onChange={userSelectHandler}
                            options={users.map((item) => ({
                                value: item._id,
                                label: item.username,
                            }))}
                            optionRender={(option) => {
                                if (selectedAllUsers && typeof option.value === 'string') {
                                    if (usersNotMatchedFilterIds.includes(option.value)) {
                                        return (
                                            <Typography.Text style={{ textDecoration: 'line-through' }}>
                                                {option.label}
                                            </Typography.Text>
                                        );
                                    } else {
                                        return <Typography.Text>{option.label}</Typography.Text>;
                                    }
                                }

                                return <Typography.Text>{option.label}</Typography.Text>;
                            }}
                            filterOption={filterOption}
                            style={{ flex: 1 }}
                        />
                        <Checkbox onChange={selectAllUsersHandler}>Select all</Checkbox>
                    </Flex>
                </Flex>

                <Button type="primary" onClick={() => searchHandler(1)}>
                    Search
                </Button>
            </Card>

            <Title style={{ textAlign: 'center', marginBottom: tokens.marginLG }}>Searched notes</Title>

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
                    onChange={(page, pageSize) => searchHandler(page)}
                    style={{ marginTop: tokens.marginXXL }}
                />
            </Flex>
        </div>
    );
};

export default NotesSearch;
