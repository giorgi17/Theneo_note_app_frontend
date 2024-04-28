import { useEffect, useState } from 'react';
import { Button, Checkbox, CheckboxProps, Flex, Form, Input, Select, Skeleton } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { CreateNoteRequest, User } from '../../store/interfaces';
import { clearNote, createNote, deleteNote, editNote, getNote } from '../../store/noteSlice';
import { useDesignTokens } from '../../themes/helpers';
import { NewNoteProps } from './interfaces';
import { getCategories } from '../../store/categorySlice';
import Title from 'antd/es/typography/Title';
import { getUsers } from '../../store/userSlice';

const NewNote: React.FC<NewNoteProps> = () => {
    const [isPrivate, setIsPrivate] = useState<boolean | undefined>();
    const [selectedCategory, setSelectedCategory] = useState<string | undefined | null>();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const fetchedNote = useSelector((state: RootState) => state.note.note);
    const loading = useSelector((state: RootState) => state.note.isLoading);
    const error = useSelector((state: RootState) => state.note.error);

    const location = useLocation();
    const currentUrl = location.pathname;

    const isEdit = currentUrl.includes('/edit-note');
    const { noteId } = useParams();

    // Fetched Categories and Users
    const categories = useSelector((state: RootState) => state.category.categories.items);
    const users = useSelector((state: RootState) => state.user.users);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const tokens = useDesignTokens();

    // Setting values in case it's an edit route
    useEffect(() => {
        if (isEdit) {
            if (fetchedNote?.category._id) setSelectedCategory(fetchedNote?.category._id);
            if (fetchedNote?.assignedTo) {
                const fetchedAssignedToList = fetchedNote?.assignedTo as User[];
                setSelectedUsers(fetchedAssignedToList.map((item) => item._id));
            }

            setIsPrivate(fetchedNote?.isPrivate);
        } else {
            setSelectedCategory(null);
            setIsPrivate(false);
        }
    }, [fetchedNote?.assignedTo, fetchedNote?.category._id, fetchedNote?.isPrivate, isEdit]);

    useEffect(() => {
        dispatch(getCategories({ page: 1, perPage: 5, noPaginate: true }));
        dispatch(getUsers());

        if (isEdit && noteId) {
            dispatch(getNote({ noteId }));
        }
    }, [dispatch, isEdit, noteId]);

    // Clear fetched note
    useEffect(() => {
        return () => {
            dispatch(clearNote());
        };
    }, [dispatch]);

    const onFinish = (values: CreateNoteRequest) => {
        if (selectedCategory && selectedUsers && typeof isPrivate === 'boolean') {
            if (isEdit && fetchedNote) {
                dispatch(
                    editNote({
                        noteId: fetchedNote?._id,
                        noteData: {
                            _id: fetchedNote._id,
                            title: values.title,
                            description: values.description,
                            category: selectedCategory,
                            isPrivate,
                            assignedTo: selectedUsers,
                        },
                        navigate,
                    }),
                );
            } else {
                dispatch(
                    createNote({
                        title: values.title,
                        description: values.description,
                        category: selectedCategory,
                        isPrivate,
                        assignedTo: selectedUsers,
                        navigate,
                    }),
                );
            }
        }
    };

    const deleteHandler = () => {
        if (noteId) dispatch(deleteNote({ noteId, navigate }));
    };

    const privacyHandler: CheckboxProps['onChange'] = (e) => {
        setIsPrivate(e.target.checked);
    };

    const categorySelectHandler = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    const userSelectHandler = (selectedUsersUpdated: string[]) => {
        setSelectedUsers(selectedUsersUpdated);
    };

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const noteDisplay = selectedCategory !== undefined && typeof isPrivate === 'boolean' && (
        <Form
            onFinish={onFinish}
            initialValues={{
                ['title']: isEdit ? fetchedNote?.title : '',
                ['description']: isEdit ? fetchedNote?.description : '',
                ['category']: isEdit ? selectedCategory : '',
                ['isPrivate']: isPrivate,
                ['assignedTo']: selectedUsers,
            }}
            style={{ minWidth: 600, maxWidth: 1000, textAlign: 'center' }}
        >
            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input note title!' }]}>
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please input note description!' }]}
            >
                <TextArea rows={10} />
            </Form.Item>

            <Form.Item
                label="Category"
                name="category"
                rules={[
                    {
                        required: true,
                        message: 'Please select a category',
                    },
                ]}
            >
                <Select
                    showSearch
                    placeholder="Select a category"
                    optionFilterProp="children"
                    onChange={categorySelectHandler}
                    filterOption={filterOption}
                    options={categories.map((item) => ({ value: item._id, label: item.title }))}
                />
            </Form.Item>

            <Form.Item label="Assigned to" name="assignedTo">
                <Select
                    mode="multiple"
                    placeholder="Select users"
                    onChange={userSelectHandler}
                    options={users.map((item) => ({
                        value: item._id,
                        label: item.username,
                    }))}
                    filterOption={filterOption}
                />
            </Form.Item>

            <Form.Item name="isPrivate">
                <Checkbox checked={isPrivate} onChange={privacyHandler}>
                    Private
                </Checkbox>
            </Form.Item>

            <Flex align="center" justify="center" gap={tokens.margin} style={{ marginTop: tokens.marginLG }}>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large">
                        Save
                    </Button>
                </Form.Item>

                {isEdit && (
                    <Form.Item>
                        <Button type="primary" size="large" danger onClick={deleteHandler}>
                            Delete
                        </Button>
                    </Form.Item>
                )}
            </Flex>

            {error && (
                <Form.ErrorList
                    errors={[
                        <div key="errorItem" style={{ color: 'red' }}>
                            {error.message} <br />
                            {error?.data?.[0]?.msg}
                        </div>,
                    ]}
                    helpStatus="error"
                />
            )}
        </Form>
    );

    return (
        <Flex align="center" vertical>
            <Title style={{ textAlign: 'center', marginBottom: tokens.marginXXL }}>
                {isEdit ? 'Edit note' : 'Create note'}
            </Title>
            {loading ? <Skeleton active style={{ width: 600 }} /> : noteDisplay}
        </Flex>
    );
};

export default NewNote;
