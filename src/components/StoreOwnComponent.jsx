import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useTranslation } from "react-i18next";
import SkeletonCardComponent from './skeletonCardComponent';
import { BsPencilSquare } from "react-icons/bs";
import { FaBackspace } from "react-icons/fa";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';
import ProductComponent from './ProductComponent';

function StoreOwnComponent() {
    const { t } = useTranslation();
    const baseUrl = process.env.REACT_APP_BASE_URL + "/api/";
    const [data, setData] = useState([]);
    const [storeId, setstoreId] = useState(0)
    const imageUrl = process.env.REACT_APP_BASE_URL + "/storage/imageProduct/";
    const [isLoading, setIsLoading] = useState(true);
    const [isAdd, setisAdd] = useState(false)
    const [selectedStoreId, setselectedStoreId] = useState();
    const [isInsert, setisInsert] = useState(true);



    const getStoreId = () => {
        const userid = localStorage.getItem("user_id");
        if (!userid) {
            return;
        }
        axios.get(`${baseUrl}stores/${userid}`)
            .then((res) => {
                setstoreId(res.data[0].id)
                axios.get(`${baseUrl}products/searchstore/${res.data[0].id}`)
                    .then((res) => {
                        setData(res.data);
                        setIsLoading(false);
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoading(false);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    useEffect(() => {
        getStoreId()
    }, [baseUrl]);

    const handler = () => {
        setIsLoading(true);
        getStoreId()
    }

    const handlerButton = () => {
        setisInsert(true)
        setselectedStoreId(null)
        setisAdd(true)
    }
    const handlerbackbutton = () => {
        handler();
        setisAdd(false)
    }
    const handlerEditButton = () => {
        setisAdd(true)
        setisInsert(false)
    }

    return (
        <div className='w-full flex flex-wrap justify-center'>
            {isAdd ?
                (
                    <div className="w-full">
                        <div className="w-full h-8 items-start">
                            <Button onClick={handlerbackbutton} size='sm' startContent={<FaBackspace />}>
                                <span className=' font-bold'>
                                    {t("btnBack")}
                                </span>
                            </Button>
                        </div>
                        <div className=" w-full mt-3 p-4 flex justify-center">
                            <div className="w-3/5 bg-gray-200 rounded-lg shadow-lg min-h-[50vh] flex justify-center p-3">
                                <ProductComponent storeid={storeId} isInsert={isInsert} id={selectedStoreId}/>
                            </div>
                        </div>
                    </div>
                )
                :
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:gap-2 md:gap-5">

                    <>
                        <div className="scale-80 sm:scale-100">
                            <Card className="w-[200px] space-y-5 p-4 cursor-pointer" radius="lg" onClick={handlerButton}>
                                <CardHeader className=''>
                                    <span className=' font-bold'>Add Product</span>
                                </CardHeader>
                                <Divider />
                                <CardBody className='overflow-hidden ' onClick={handlerButton}>
                                    <div className="scale-[300%] w-full flex justify-center items-center h-full mt-1">
                                        <BsPencilSquare />
                                    </div>
                                </CardBody>
                                <CardFooter className='pt-[4em]'></CardFooter>
                            </Card>
                        </div>
                        {
                            data.map(product => (
                                <div key={product.id} className="scale-80 sm:scale-100">
                                    <SkeletonCardComponent
                                        id={product.id}
                                        isLoaded={!isLoading}
                                        img={imageUrl + product.thumbnail}
                                        title={product.title}
                                        price={product.price}
                                        rating={"0"}
                                        store={product.store.title}
                                        isOwn={true}
                                        handler={handler}
                                        editHandler={handlerEditButton}
                                        selectedid={setselectedStoreId}
                                    />
                                </div>
                            ))
                        }
                    </>
                </div>
            }
        </div>
    )
}

export default StoreOwnComponent;
