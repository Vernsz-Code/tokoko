import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaStore } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { ScrollShadow, Button, Card, CardHeader, CardBody, CardFooter, Divider, Input } from "@nextui-org/react";
import NavbarComponents from "../components/NavbarComponents";
import { Toaster, toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import StoreOwnComponent from "../components/StoreOwnComponent";

function MarketPlacePage() {
  const brand = process.env.REACT_APP_BRAND_NAME;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const logo = process.env.REACT_APP_LOGO_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [isFound, setIsFound] = useState(false)
  const [isDisapear, setIsDisapear] = useState(false);
  const [iMarketName, setIMarketName] = useState("");
  const [iUsername, setIUsername] = useState(null);
  const [iDescription, setIDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [userV, setUserV] = useState("");
  const [username, setUsername] = useState("");
  const baseUrl = process.env.REACT_APP_BASE_URL + "/api/";
  const dataUser = localStorage.getItem("user");
  const userid = localStorage.getItem("user_id");

  useEffect(() => {
    if (localStorage.getItem("token_id")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (isLogin) {
      const fetchData = async () => {
        try {
          await axios.get(baseUrl + "stores/" + userid, {
                        headers: {
                          'Content-Type': 'application/json',
                          'Access-Control-Allow-Origin': '*',
                        }});
          setIsFound(true);
        } catch {
          setIsFound(false);
        }

        try {
          const res = await axios.post(baseUrl + "getuser", JSON.parse(dataUser));
          const userData = res.data;
          setUserV(userData.phone_number || JSON.parse(dataUser).email);
          setUsername(userData.data.username);
        } catch (err) {
          console.log("Error:", err);
        } finally {
          setIsLoad(true);
        }
      };

      fetchData();
    }
  }, [isLogin, baseUrl, dataUser, userid]);

  const buttonHandler = () => {
    setIsLoading(true);
    const storeUUID = uuidv4();
    if (isDisapear) {
      console.log(iMarketName, iUsername, iDescription);
      axios.post(baseUrl + "stores", {
        seller_id: userid,
        title: iMarketName,
        name: iUsername ? iUsername : username,
        description: iDescription ? iDescription : "...",
        uuid: storeUUID,
      })
        .then(() => {
          toast.info(t("successRM"), {
            position: "top-right",
            duration: 5000,
          });
          setIsFound(true);
        })
        .catch((err) => {
          toast.info(t("failRM"), {
            position: "top-right",
            duration: 5000,
          });
          console.log("error euyyy : ", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsDisapear(true);
      }, 3000);
    }
  };

  const handleriNameM = (e) => {
    e.preventDefault();
    setIMarketName(e.target.value);
  };

  const handleriOwnerM = (e) => {
    e.preventDefault();
    setIUsername(e.target.value);
  };

  const handlerDescriptionM = (e) => {
    e.preventDefault();
    setIDescription(e.target.value);
  };

  return (
    <ScrollShadow hideScrollBar className="max-w-[100%] overflow-y-hidden flex flex-wrap">
      <Toaster />
      <BarLoader
        cssOverride={{
          position: "fixed",
          top: 0,
          width: "100%",
        }}
        color="#298cf0"
        loading={isLoading}
      />
      {isFound ? (
        <>
          <div className="w-[100%] flex justify-center fixed z-30">
            <NavbarComponents title={brand} logoUrl={logo} IsLogin={isLogin} username={username} user={userV} />
          </div>
          <div className="mt-[4em] flex flex-wrap w-full min-h-[90vh] justify-center pt-2 ml-[-5px] sm:p-3">
            <StoreOwnComponent />
          </div>
        </>
      ) : (
        <div className="w-full h-[100vh]">
          {isDisapear ? (
            <div className="flex min-h-[100vh] w-full justify-center items-center">
              <Card className="p-4 bg-gray-200">
                <CardHeader className="pr-[20rem]">
                  <span className="text-lg font-bold">
                    {t("marketRN")}
                  </span>
                </CardHeader>
                <Divider />
                <CardBody className="grid grid-rows-2 gap-3">
                  <Input onChange={handleriNameM} value={iMarketName} label={t("marketNF")} placeholder="ex. Tokoko" required />
                  <Input onChange={handleriOwnerM} value={iUsername} label={t("marketUF")} placeholder="ex. Vernsz" description={t("marketOL")} />
                  <Input onChange={handlerDescriptionM} value={iDescription} label={t("marketDF")} placeholder="ex. A description to inform customers" description={t("marketODL")} />
                </CardBody>
                <Divider />
                <CardFooter className="p-3 justify-end flex">
                  {isLoad ? (
                    <Button variant="solid" color="primary" onClick={buttonHandler}>
                      {t("rMarket")}
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="w-full h-[100vh] flex bg-white justify-center items-center">
              <Card className="p-4 bg-gray-200">
                <CardHeader>
                  <h1 className="font-bold text-xl">
                    {t("authR")}
                  </h1>
                </CardHeader>
                <CardBody className="flex-col items-center p-4 gap-[2.5rem] overflow-y-hidden">
                  <FaStore className="scale-[500%] mt-[1rem]" />
                  <h1>{t("makeMarketDialog")}</h1>
                </CardBody>
                <CardFooter className="p-3 justify-end flex">
                  <Button variant="solid" color="primary" onClick={buttonHandler}>
                    {t("rMarket")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      )}
    </ScrollShadow>
  );
}

export default MarketPlacePage;
