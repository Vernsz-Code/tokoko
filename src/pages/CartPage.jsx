import React, { useEffect, useState } from "react";
import NavbarComponents from "../components/NavbarComponents";
import axios from "axios";
import { Button, Image, ScrollShadow } from "@nextui-org/react";
import { useParams } from 'react-router-dom';
import { Toaster, toast } from "sonner";
import SkeletonCardComponent from "../components/skeletonCardComponent";

function CartPage() {
    const brand = process.env.REACT_APP_BRAND_NAME;
    const logo = process.env.REACT_APP_LOGO_URL;
    const [isLogin, setisLogin] = useState(true);
    const [userV, setuserV] = useState("");
    const [username, setusername] = useState("");
    const baseUrl = process.env.REACT_APP_BASE_URL + "/api/";
    const imageUrl = process.env.REACT_APP_BASE_URL + "/storage/imageProduct/";
    const [isLoading, setIsLoading] = useState(true);
    const dataUser = localStorage.getItem("user");
    const [data, setdata] = useState([]);
    const userid = localStorage.getItem("user_id");
    const [productCounts, setProductCounts] = useState({});

    useEffect(() => {
        if (localStorage.getItem("token_id")) {
            setisLogin(true);
        } else {
            setisLogin(false);
        }
    }, []);

    useEffect(() => {
        if (isLogin) {
            try {
                axios
                    .post(baseUrl + "getuser", JSON.parse(dataUser), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                    .then((res) => {
                        if (res.data.phone_number) {
                            setuserV(res.data.phone_number);
                        } else {
                            setuserV(JSON.parse(dataUser).email);
                        }
                        setusername(res.data.data.username);
                    })
                    .catch((err) => {
                        console.log("Error:", err);
                    });
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }, [isLogin, dataUser, baseUrl]);

    useEffect(() => {
        axios.get(baseUrl + "cart/" + userid)
            .then((res) => {
                setIsLoading(false)
                console.log(res.data)
                setdata(res.data);
            })
            .catch((err) => {
                setIsLoading(true)
                console.log(err);
            });
    }, [userid, baseUrl]);

    useEffect(() => {
        if (isLoading) return;

        const counts = {};
        data.forEach(cart => {
            const productId = cart.product.id;
            if (productId in counts) {
                counts[productId]++;
            } else {
                counts[productId] = 1;
            }
        });
        setProductCounts(counts);
    }, [data, isLoading]);

    return (
        <ScrollShadow hideScrollBar className="max-w-[100%] overflow-y-hidden flex flex-wrap">
            <Toaster />
            <div className="w-[100%] flex justify-center fixed z-50">
                <NavbarComponents title={brand} logoUrl={logo} IsLogin={isLogin} username={username} user={userV} />
            </div>
            <div className="mt-[4em] w-full pt-2 ml-[-5px] sm:pt-3 sm:px-[10em] grid grid-flow-row gap-3 ">

                {Object.entries(productCounts).map(([productId, count]) => {
                    const cartItem = data.find(cart => cart.product.id === parseInt(productId));
                    return (
                        <div key={productId} className="w-full bg-gray-200 min-h-[5em] p-3 grid grid-cols-5 rounded-lg shadow-lg gap-3">
                            <div className="col-span-4 bg-gray-100 rounded-xl">
                                <SkeletonCardComponent
                                    id={cartItem.product.id}
                                    isLoaded={!isLoading}
                                    img={cartItem.product.thumbnail ? imageUrl + cartItem.product.thumbnail : ''}
                                    title={cartItem.product.title}
                                    price={cartItem.product.price}
                                    rating={"0"}
                                    store={cartItem.product.store ? cartItem.product.store.title : ''}
                                />
                            </div>
                            <div className="bg-white col-span-1 rounded-lg shadow-md p-3">
                                <span className="font-bold ">
                                    Total produk: {count}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollShadow>
    );
}

export default CartPage;
