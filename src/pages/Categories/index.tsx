import { Button, Flex, Form, Input, List, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addCategory, changeCategoriesPage, deleteCategory, getCategories } from '../../store/categorySlice';
import { Category } from '../../store/interfaces';
import { useDesignTokens } from '../../themes/helpers';
import { CategoriesProps } from './interfaces';

const Categories: React.FC<CategoriesProps> = () => {
    const [newCategory, setNewCategory] = useState('');

    const loading = useSelector((state: RootState) => state.category.isLoading);
    const error = useSelector((state: RootState) => state.category.error);
    const currentPage = useSelector((state: RootState) => state.category.categories.currentPage);
    const totalItems = useSelector((state: RootState) => state.category.categories.totalItems);
    const categories = useSelector((state: RootState) => state.category.categories);

    const dispatch: AppDispatch = useDispatch();
    const tokens = useDesignTokens();

    useEffect(() => {
        dispatch(
            getCategories({
                page: currentPage,
                perPage: 10,
            }),
        );
    }, [dispatch, currentPage]);

    const newCategoryInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(event.target.value);
    };

    const addNewCategoryHandler = () => {
        if (newCategory !== '') {
            dispatch(addCategory({ title: newCategory })).then((action) => {
                if (addCategory.fulfilled.match(action)) {
                    dispatch(getCategories({ page: currentPage, perPage: 10 }));
                    setNewCategory('');
                }
            });
        }
    };

    const deleteCategoryHandler = (categoryId: string) => {
        dispatch(deleteCategory({ categoryId })).then((action) => {
            if (deleteCategory.fulfilled.match(action)) {
                dispatch(getCategories({ page: currentPage, perPage: 10 }));
            }
        });
    };

    const categoryItemDisplay = (category: Category) => (
        <List.Item>
            <Button style={{ width: '90%' }}>{category.title}</Button>
            <Button onClick={() => deleteCategoryHandler(category._id)} danger>
                Delete
            </Button>
        </List.Item>
    );

    return (
        <div>
            <List
                size="small"
                bordered
                loading={loading}
                dataSource={categories.items}
                renderItem={categoryItemDisplay}
            />

            <div>
                <Flex style={{ marginTop: tokens.marginLG }} gap={tokens.marginSM}>
                    <Input onChange={newCategoryInputHandler} value={newCategory} />
                    <Button onClick={addNewCategoryHandler}>Add category</Button>
                </Flex>

                {error && (
                    <Form.ErrorList
                        errors={[
                            <div
                                key="errorItem"
                                style={{ color: 'red', textAlign: 'center', marginTop: tokens.marginMD }}
                            >
                                {error.message} <br />
                                {error?.data?.[0]?.msg}
                            </div>,
                        ]}
                        helpStatus="error"
                    />
                )}
            </div>

            <Pagination
                defaultCurrent={1}
                current={currentPage}
                total={totalItems}
                pageSize={5}
                onChange={(page, pageSize) => dispatch(changeCategoriesPage(page))}
                style={{ marginTop: tokens.marginXXL, textAlign: 'center' }}
            />
        </div>
    );
};

export default Categories;
