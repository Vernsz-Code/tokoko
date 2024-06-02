import React, { useEffect, useState } from "react";
import NavbarComponents from "../components/NavbarComponents";
import axios from "axios";
import { Button, Image, ScrollShadow } from "@nextui-org/react";
import { useParams } from 'react-router-dom';
import { FaStore } from "react-icons/fa";
import { Toaster, toast } from "sonner";

function ProdukPage() {
    const brand = process.env.REACT_APP_BRAND_NAME;
    const logo = process.env.REACT_APP_LOGO_URL;
    const [isLogin, setisLogin] = useState(true);
    const [userV, setuserV] = useState("");
    const [username, setusername] = useState("");
    const baseUrl = process.env.REACT_APP_BASE_URL + "/api/";
    const baseUrlImg = process.env.REACT_APP_BASE_URL + "/storage/imageProduct/";
    const dataUser = localStorage.getItem("user");
    const [data, setdata] = useState([]);
    const { id } = useParams();
    const userid = localStorage.getItem("user_id");

    const handlerAddCart = () => {
        axios.post(`${baseUrl}cart`, {
            users_id: userid,
            product_id: id
        })
            .then(() => {
                toast.info("Success Add to cart")
            })
            .catch(error => console.error('Error adding item to cart:', error));
    }
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
        axios.get(baseUrl + "products/" + id)
            .then((res) => {
                setdata(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id, baseUrl]);
    console.log(baseUrlImg + data.thumbnail)
    return (
        <ScrollShadow hideScrollBar className="max-w-[100%] overflow-y-hidden flex flex-wrap">
        <Toaster />
            <div className="w-[100%] flex justify-center fixed z-50">
                <NavbarComponents title={brand} logoUrl={logo} IsLogin={isLogin} username={username} user={userV} />
            </div>
            <div className="mt-[4em] flex flex-wrap w-full md:w-[400em] min-h-[90vh] justify-center pt-2 ml-[-5px] sm:pt-3 sm:px-[10em] ">
                <div className="w-full min-h-14 bg-gray-200 pl-5 pt-3 pr-5 rounded-lg shadow-lg grid lg:grid-flow-row sm:p-5 gap-3">
                    <div className="w-full min-h-3 grid grid-flow-row lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 grid grid-flow-row lg:gap-2 justify-center p-3 rounded-lg lg:w-full w-[105%] bg-white">
                            <Image src={baseUrlImg + data.thumbnail} isZoomed className="object-cover" />
                            <div className="w-full p-3 bg-white rounded-lg shadow-lg flex items-center gap-4">
                                <FaStore className=" text-[2em]"/>
                                <span className="text-lg bold">{data.store && data.store.title ? data.store.title : "NULL Marketplace"}</span>
                            </div>
                        </div>
                        <div className="bg-gray-100 col-span-2 p-3 rounded-lg shadow-xl pl-6 grid grid-rows-4">
                            <div className="font-bold text-xl grid grid-flow-col items-center">
                                <span>
                                    {data.title}
                                </span>
                                <div className="flex justify-end text-amber-800">
                                    Rp.{data.price}
                                </div>
                            </div>
                            <div className="bg-gray-200 rounded-lg shadow-lg p-3 h-full w-full row-span-3">
                                {data.description}
                            </div>
                        </div>
                    </div>
                     <div className="w-full p-3 bg-white rounded-lg shadow-md grid grid-cols-2 items-center">
                        <div className=""></div>
                        <Button onClick={handlerAddCart} color="primary">Keranjang</Button>
                     </div>
                </div>
            </div>
        </ScrollShadow>
    );
}

export default ProdukPage;
