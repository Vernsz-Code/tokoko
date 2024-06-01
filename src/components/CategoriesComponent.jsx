import React, { useEffect, useState } from 'react';
import SkeletonCardComponent from './skeletonCardComponent';
import axios from 'axios';
import { Tabs, Tab } from "@nextui-org/react";

function CategoriesComponent() {
    const [selected, setSelected] = useState(1);
    const [categories, setCategories] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [products, setProducts] = useState([]);
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const categoriesUrl = `${baseUrl}/api/categories`;
    const productsUrl = `${baseUrl}/api/products48`;
    const imageUrl = `${baseUrl}/storage/imageProduct/`;

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    axios.get(productsUrl, {
                        headers: {
                          'Content-Type': 'application/json',
                          'Access-Control-Allow-Origin': '*', // Mengizinkan akses dari semua domain
                          // Tambahkan header lain jika diperlukan
                          // 'Authorization': 'Bearer token'
                        }}),
                    axios.get(categoriesUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Mengizinkan akses dari semua domain
            // Tambahkan header lain jika diperlukan
            // 'Authorization': 'Bearer token'
          }})
                ]);

                const productsData = productsResponse.data;
                const categoriesData = categoriesResponse.data.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    label: cat.name,
                    data: productsData.filter(product => product.category_id === cat.id).slice(0, 12)
                }));

                setProducts(productsData);
                setCategories(categoriesData);
                // console.log('Products:', productsData);
                // console.log('Categories:', categoriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally{
                setIsLoaded(true);
            }
        };

        fetchProductsAndCategories();
    }, [categoriesUrl, productsUrl]);

    return (
        <div className="flex w-full flex-col items-center">
            <Tabs
                radius='lg'
                color='primary'
                variant='bordered'
                aria-label="Dynamic tabs"
                items={categories}
                selectedKey={selected}
                onSelectionChange={setSelected}
            >
                {(item) => (
                    <Tab key={item.id} title={item.label}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:gap-2 md:gap-5">
                            {isLoaded ? (
                                item.data.map(product => (
                                    <div key={product.id} className="scale-80 sm:scale-100">
                                        <SkeletonCardComponent
                                            isLoaded={isLoaded}
                                            img={imageUrl + product.thumbnail}
                                            title={product.title}
                                            price={product.price}
                                            rating={"0"}
                                            store={product.store.title}
                                        />
                                    </div>
                                ))
                            ) : (
                                Array.from({ length: 12 }).map((_, index) => (
                                    <SkeletonCardComponent
                                        key={index}
                                        isLoaded={isLoaded}
                                        img={"blank"}
                                        title={"title"}
                                        price={"1"}
                                        rating={"4.5"}
                                        store={"Zimbabwe ID"}
                                    />
                                ))
                            )}
                        </div>
                    </Tab>
                )}
            </Tabs>
        </div>
    );
}

export default CategoriesComponent;
