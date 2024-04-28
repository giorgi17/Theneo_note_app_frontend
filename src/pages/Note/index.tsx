import { LockOutlined } from '@ant-design/icons';
import { Flex, Form, Skeleton, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/typography/Title';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { User } from '../../store/interfaces';
import { getNote } from '../../store/noteSlice';
import { useDesignTokens } from '../../themes/helpers';
import { NoteProps } from './interfaces';

const Note: React.FC<NoteProps> = () => {
    const { noteId } = useParams();
    const dispatch: AppDispatch = useDispatch();
    const tokens = useDesignTokens();

    const loading = useSelector((state: RootState) => state.note.isLoading);
    const error = useSelector((state: RootState) => state.note.error);
    const noteData = useSelector((state: RootState) => state.note.note);

    useEffect(() => {
        if (noteId) {
            dispatch(
                getNote({
                    noteId,
                }),
            );
        }
    }, [dispatch, noteId]);

    let assignedToList;

    if (noteData?.assignedTo) {
        assignedToList = noteData?.assignedTo as User[];
    }

    const noteDisplay = noteData && assignedToList && (
        <Form style={{ minWidth: 600, maxWidth: 1000, textAlign: 'center', position: 'relative' }}>
            <Form.Item style={{ marginBottom: tokens.marginXL }}>
                <Typography.Title level={1}>{noteData.title}</Typography.Title>
            </Form.Item>

            {noteData.isPrivate && (
                <LockOutlined style={{ fontSize: '25px', position: 'absolute', top: 15, right: 0 }} />
            )}

            <Form.Item>
                <TextArea rows={10} value={noteData.description || ''} />
            </Form.Item>

            <Form.Item>
                <Typography.Title level={5}>Category</Typography.Title>
                <Typography.Text>{noteData.category.title}</Typography.Text>
            </Form.Item>

            <Form.Item>
                <Typography.Title level={5}>Assigned to</Typography.Title>
                {assignedToList.map((item) => (
                    <div key={item._id}>
                        {item.username} <br />
                    </div>
                ))}
            </Form.Item>

            {!loading && error && (
                <Title level={2} color="red">
                    There has been an error while deleting note.
                </Title>
            )}
        </Form>
    );

    return (
        <Flex align="center" vertical>
            {loading || !noteData ? <Skeleton active style={{ width: 600 }} /> : noteDisplay}

            {!loading && error && (
                <Title level={2} color="red">
                    There has been an error while fetching note.
                </Title>
            )}
        </Flex>
    );
};

export default Note;
