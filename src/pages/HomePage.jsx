import React, { useEffect, useState } from "react";
import NavbarComponents from "../components/NavbarComponents";
import CategoriesComponent from "../components/CategoriesComponent";
import axios from "axios";
import { ScrollShadow } from "@nextui-org/react";

function HomePage() {
  const brand = process.env.REACT_APP_BRAND_NAME;
  const logo = process.env.REACT_APP_LOGO_URL;
  const [isLogin, setisLogin] = useState(true);
  const [userV, setuserV] = useState("");
  const [username, setusername] = useState("");
  const baseUrl = process.env.REACT_APP_BASE_URL + "/api/";
  const dataUser = localStorage.getItem("user")
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
                        }})
          .then((res) => {
            if(res.data.phone_number){
              setuserV(res.data.phone_number)
            }
            else{
              setuserV(JSON.parse(dataUser).email)
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
  }, []);
  return (
    <ScrollShadow hideScrollBar className="max-w-[100%] overflow-y-hidden flex flex-wrap">
      <div className="w-[100%] flex justify-center fixed z-50">
        <NavbarComponents title={brand} logoUrl={logo} IsLogin={isLogin} username={username} user={userV}/>
      </div>
      <div className="mt-[4em] flex flex-wrap w-full min-h-[90vh] justify-center pt-2 ml-[-5px] sm:p-3">
        <CategoriesComponent/>
      </div>
    </ScrollShadow>
  );
}

export default HomePage;
