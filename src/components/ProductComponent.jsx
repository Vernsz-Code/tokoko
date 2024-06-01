import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Button, Select, SelectItem } from '@nextui-org/react';

const ProductComponent = ({ storeid }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const categoriesUrl = `${baseUrl}/api/categories`;
    const productsUrl = `${baseUrl}/api/products`;
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(new Set([]));
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

    const onSubmit = async () => {
        setLoading(true);
        const data = {
            ...formData,
            status: Array.from(status)[0] === 'Active' ? 1 : 0
        };

        const payload = new FormData();
        Object.keys(data).forEach(key => {
            payload.append(key, typeof data[key] === 'number' ? data[key].toString() : data[key]);
        });

        try {
            const response = await axios.post(productsUrl, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Product created successfully!');
            reset();
            setFormData(prevState => ({
                ...prevState,
                title: '',
                description: '',
                thumbnail: null,
                price: '',
                stock: '',
                category_id: ''
            }));
            setStatus(new Set([]));
        } catch (error) {
            if (error.response && error.response.data.errors) {
                Object.values(error.response.data.errors).forEach(err => {
                    toast.error(err.join(' '));
                });
            } else {
                toast.error('An error occurred while creating the product.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field) => (e) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: e.target.type === 'file' ? e.target.files[0] : e.target.value
        }));
    };

    const handleCategoryChange = (keys) => {
        setFormData(prevState => ({
            ...prevState,
            category_id: Array.from(keys)[0]
        }));
    };

    return (
        <div className="container p-3">
            <h2>Create Product</h2>
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
                    <Input
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
                        {...register('thumbnail', { required: 'Thumbnail is required' })}
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
                        selectedKeys={new Set([formData.category_id.toString()])}
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
