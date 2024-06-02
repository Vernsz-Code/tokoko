import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Button, Select, SelectItem, Textarea } from '@nextui-org/react';

const ProductComponent = ({ storeid, isInsert = true, id = 0 }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const categoriesUrl = `${baseUrl}/api/categories`;
    const productsUrl = `${baseUrl}/api/products`;
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(new Set([]));
    const [statusP, setStatusP] = useState(1);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: null,
        store_id: parseInt(storeid),
        price: '',
        stock: '',
        category_id: ''
    });

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            store_id: parseInt(storeid)
        }));
    }, [storeid]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(categoriesUrl);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [categoriesUrl]);

    useEffect(() => {
        if (!isInsert) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`${productsUrl}/${id}`);
                    const productData = response.data;
                    setFormData({
                        ...productData,
                        category_id: productData.category_id.toString(), // ensure it matches the Select component
                        thumbnail: null // reset thumbnail since we don't fetch the actual file
                    });
                    setStatus(new Set([productData.status ? 'Active' : 'Inactive']));
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };

            fetchProduct();
        }
    }, [isInsert, id, productsUrl]);

    const onSubmit = async () => {
        setLoading(true);
        try {
            let response;
            if (isInsert) {
                const { title, description, thumbnail, price, stock, category_id } = formData;
                const insertData = {
                    title,
                    description,
                    thumbnail,
                    store_id: parseInt(storeid),
                    price,
                    stock,
                    status: statusP,
                    category_id
                };

                response = await axios.post(productsUrl, insertData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Product created successfully!');
            } else {
                const { title, description, thumbnail, price, stock, category_id } = formData;
                const updatedData = {
                    title,
                    description,
                    thumbnail,
                    store_id: parseInt(storeid),
                    price,
                    stock,
                    status: statusP,
                    category_id
                };

                if (thumbnail !== null) {
                    response = await axios.put(productsUrl + "/" + id, updatedData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else {
                    response = await axios.put(`${productsUrl}/${id}`, updatedData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }

                toast.success('Product updated successfully!');
            }
            reset();
            setFormData({
                title: '',
                description: '',
                thumbnail: null,
                store_id: parseInt(storeid),
                price: '',
                stock: '',
                category_id: ''
            });
            setStatus(new Set([]));
        } catch (error) {
            if (error.response && error.response.data.errors) {
                Object.values(error.response.data.errors).forEach(err => {
                    toast.error(err.join(' '));
                });
            } else {
                toast.error(`An error occurred while ${isInsert ? 'creating' : 'updating'} the product.`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field) => (e) => {
        const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
        if (field === 'status') {
            const statusValue = e.target.value === 'Active' ? 1 : 0;
            setStatusP(statusValue);
        } else {
            setFormData(prevState => ({
                ...prevState,
                [field]: value
            }));
        }
    };

    const handleCategoryChange = (keys) => {
        setFormData(prevState => ({
            ...prevState,
            category_id: Array.from(keys)[0]
        }));
    };

    return (
        <div className="w-full p-3">
            <h2>{isInsert ? "Create Product" : "Update Product"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-flow-row gap-3'>
                <div>
                    <Input
                        label="Title"
                        {...register('title', { required: 'Title is required' })}
                        value={formData.title}
                        onChange={handleInputChange('title')}
                        placeholder="Enter product title"
                    />
                    {errors.title && <p>{errors.title.message}</p>}
                </div>

                <div>
                    <Textarea
                        label="Description"
                        {...register('description', { required: 'Description is required' })}
                        value={formData.description}
                        onChange={handleInputChange('description')}
                        placeholder="Enter product description"
                    />
                    {errors.description && <p>{errors.description.message}</p>}
                </div>

                <div className='grid grid-flow-row'>
                    <Input
                        label="Thumbnail"
                        variant='underlined'
                        labelPlacement='outside-left'
                        type="file"
                        {...register('thumbnail', { required: isInsert })}
                        onChange={handleInputChange('thumbnail')}
                    />
                    {errors.thumbnail && <p>{errors.thumbnail.message}</p>}
                </div>

                <div>
                    <Input
                        label="Price"
                        type="number"
                        step="0.01"
                        {...register('price', { required: 'Price is required' })}
                        value={formData.price}
                        onChange={handleInputChange('price')}
                        placeholder="Enter product price"
                    />
                    {errors.price && <p>{errors.price.message}</p>}
                </div>

                <div>
                    <Input
                        label="Stock"
                        type="number"
                        {...register('stock', { required: 'Stock is required' })}
                        value={formData.stock}
                        onChange={handleInputChange('stock')}
                        placeholder="Enter product stock"
                    />
                    {errors.stock && <p>{errors.stock.message}</p>}
                </div>

                <div>
                    <Select
                        label="Status"
                        variant="bordered"
                        placeholder="Select status"
                        selectedKeys={status}
                        onSelectionChange={setStatus}
                        onChange={handleInputChange('status')}
                    >
                        <SelectItem key="Active">Active</SelectItem>
                        <SelectItem key="Inactive">Inactive</SelectItem>
                    </Select>
                    {errors.status && <p>{errors.status.message}</p>}
                </div>

                <div>
                    <Select
                        label="Category"
                        variant="bordered"
                        placeholder="Select category"
                        selectedKeys={new Set([formData.category_id])}
                        onSelectionChange={handleCategoryChange}
                    >
                        {categories.map(category => (
                            <SelectItem key={category.id}>{category.name}</SelectItem>
                        ))}
                    </Select>
                    {errors.category_id && <p>{errors.category_id.message}</p>}
                </div>

                <Button type="submit" color='primary' disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ProductComponent;
