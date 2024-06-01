import axios from "axios";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Toaster, toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LocalStoragePusher } from "./LocalStoragePusher";
import CountdownComponent from "./CountdownComponent";
import { Input } from "@nextui-org/react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';

function AuthenticationComponent({ login }) {
  const brand = process.env.REACT_APP_BRAND_NAME;
  const storage = LocalStoragePusher("createdat");
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isInsert, setIsInsert] = useState(false);
  const [data, setdata] = useState([]);
  const [scrolled, setscrolled] = useState(0);
  const [username, setusername] = useState("");
  const [fn, setfn] = useState("");
  const [sn, setsn] = useState("");
  const [password, setpassword] = useState("");
  const [isPhoneNumber, setisPhoneNumber] = useState(false);
  const [otpSent, setOtpSent] = useState([]);
  const [passwordSent, setPasswordSent] = useState([]);
  const [valueInput, setvalueInput] = useState("");
  const [isValid, setIsValid] = useState(false);
  const iconUrl = process.env.REACT_APP_LOGO_URL;
  const baseUrl = process.env.REACT_APP_BASE_URL + "/api/";
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const getLabelClass = (isInsert) => {
    return isInsert
      ? "absolute transition-all cursor-text bg-white mt-[3px] text-sm mt-0 px-0 left-[12%] max-h-[2em]"
      : "absolute transition-all cursor-text bg-white mt-[3px] text-md mt-[1em] px-6 left-[12%] max-h-[2em] peer-focus:text-sm peer-focus:mt-0 peer-focus:px-0";
  };

  const getSumbitBtnClass = (isValid) => {
    return isValid
      ? "bg-[#16DB65] mt-[2em] w-[90%] max-h-[2em] transition-color duration-[200ms] justify-center p-5 py-6 border text-lg flex items-center rounded-md text-white cursor-pointer"
      : "bg-gray-300 mt-[2em] w-[90%] max-h-[2em] transition-color duration-[200ms] justify-center p-5 py-6 border text-lg flex items-center rounded-md text-gray-600 cursor-not-allowed";
  };

  const getScrolledClass = (scrolleds) => {
    if (scrolleds === 0) {
      return "min-w-[100%] transition-all h-full flex justify-center flex-wrap";
    } else if (scrolleds === 1) {
      return "min-w-[100%] transition-all ml-[-100%] h-full flex justify-center flex-wrap";
    } else if (scrolleds === 2) {
      return "min-w-[100%] transition-all ml-[-200%] h-full flex justify-center flex-wrap";
    }
  };
  const handleSumbit1 = async (e) => {
    console.log(data)
    e.preventDefault();
    if (data === "") {
      toast.info(t("nullData"), {
        position: "top-right",
        duration: 5000,
      });
      return;
    } else {
      setIsLoading(true);
      setIsValid(false);
      axios
        .post(baseUrl + "getuser", data)
        .then(() => {
          if (!login) {
            toast.info(t("toast1"), {
              position: "top-right",
              duration: 5000,
              action: {
                label: t("clickme"),
                onClick: () => {
                  navigate("/authentication/login");
                },
              },
            });
            return;
          }
          setscrolled(scrolled + 1);
          if (isPhoneNumber) {
            const newTime = Date.now();
            let lastTime;
            if (storage.getItem("createdat") !== undefined) {
              lastTime = new Date(storage.getItem("createdat")).getTime();
            }
            if (!lastTime || newTime - lastTime >= 5 * 60 * 1000) {
              axios
                .post(baseUrl + "createotp", otpSent)
                .then((response) => {
                  toast.info(t("toastOTP"), {
                    position: "top-right",
                    duration: 5000,
                  });
                  let createat = response.data.data.created_at;
                  //createat = new Date(createat);
                  storage.removeItem("createdat");
                  storage.setItem("createdat", createat);
                })
                .catch((err) => {
                  console.log(err.response.data.message);
                });
            }
            setIsInsert(false);
            setIsValid(false);
          }
        })
        .catch((error) => {
          if (login) {
            toast.info(t("toast2"), {
              position: "top-right",
              duration: 5000,
              action: {
                label: t("clickme"),
                onClick: () => {
                  navigate("/authentication/register");
                },
              },
            });
          }
          if (!login) {
            setscrolled(scrolled + 1);
          }
          console.log(
            "Error:",
            error.response ? error.response.data : error.message
          );
        })
        .finally(() => {
          setIsLoading(false);
          setvalueInput("");
        });
    }
  };
  const sentOtp = () => {
    try {
      setIsLoading(true);
      axios
        .post(baseUrl + "sentotp", otpSent)
        .then((res) => {
          toast.info(t("toast3"), {
            position: "top-right",
            duration: 3000,
          });
          redirectToHomePage();
          storage.removeItem('createdat');
          localStorage.setItem("token_id", res.data.token)
          localStorage.setItem("user_id", res.data.id)
          localStorage.setItem("user", JSON.stringify(data));
          deleteOtp();
        })
        .catch(() => {
          toast.error(t("toast4"), {
            position: "top-right",
            duration: 3000,
          });
        }).
        finally(
          setIsLoading(false)
        )
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOtp = () => {
    try {
      axios
        .post(baseUrl + "deleteotp", otpSent)
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const redirectToHomePage = () => {
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 2000);
  };
  const validateuser = () => {
    try {
      setIsLoading(true);
      axios
        .post(baseUrl + "validateuser", passwordSent)
        .then((res) => {
          toast.success(
            "berhasil Masuk, anda akan diarah kan ke halaman utama",
            {
              position: "top-right",
              duration: 3000,
            }
          );
          localStorage.setItem("token_id", res.data.token)
          localStorage.setItem("user_id", res.data.id)
          localStorage.setItem("user", JSON.stringify(data))
          redirectToHomePage();
        })
        .catch((err) => {
          console.log(err);
          toast.warning("password salah", {
            position: "top-right",
            duration: 3000,
          });
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const register = () => {
    if (!fn) {
      toast.error("Kolom nama depan harus diisi.", {
        position: "top-right",
        duration: 3000,
      });
      return; // Menghentikan fungsi jika `firstname` kosong
    }
  
    try {
      setIsLoading(true);
      const userUuid = uuidv4(); // Menghasilkan UUID yang unik
  
      axios.post(baseUrl + "register", {
        phone_number: data.phone_number,
        username: username,
        firstname: fn,
        lastname: sn,
        email: data.email, // Pastikan email sudah ada di state `data`
        password: password,
        user_uuid: userUuid
      })
      .then((response) => {
        toast.success("Pendaftaran berhasil!", {
          position: "top-right",
          duration: 3000,
        });
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/authentication/login");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Pendaftaran gagal. Silakan coba lagi.", {
          position: "top-right",
          duration: 3000,
        });
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }
  const handleSumbit2 = (e) => {
    e.preventDefault();
    if (login) {
      if (isPhoneNumber) {
        sentOtp();
      } else {
        validateuser();
      }
    } else {
      register()
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setvalueInput(value);
    if (value === "") {
      setIsInsert(false);
      setIsValid(false);
    } else {
      setIsInsert(true);
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isValidPhoneNumber = value > 7;
      setisPhoneNumber(isValidPhoneNumber && value.length > 7);
      const formatedValue = value.startsWith("0")
        ? `62${value.slice(1)}`
        : value;
      if (login) {
        if (isValidPhoneNumber) {
          setOtpSent({
            phone_number: formatedValue,
            otp_code: 3,
          });
          setdata({
            phone_number: formatedValue,
          });
        } else if (isValidEmail) {
          setdata({
            email: value,
          });
        }
      } else {
        if (isValidPhoneNumber) {
          setdata({
            phone_number: formatedValue,
          });
        } else if (isValidEmail) {
          setdata({
            email: value,
          });
        }
      }
      setIsValid(isValidEmail || (isValidPhoneNumber && value.length > 7));
    }
  };

  const handleChange2 = (e) => {
    e.preventDefault();
    setvalueInput(e.target.value);
    console.log(e.preventDefault())
    if (isPhoneNumber) {
      if (e.target.value.length > 5) {
        const formatedValue = e.target.value.startsWith("0")
          ? `62${e.target.value.slice(1)}`
          : e.target.value;
        setOtpSent({
          phone_number: formatedValue,
          otp_code: e.target.value,
        });
        setIsValid(true);
        setIsInsert(true);
      } else {
        setIsValid(false);
      }
    } else {
      if (e.target.value.length > 6) {
        setPasswordSent({
          email: data.email,
          password: e.target.value,
        });
        setIsValid(true);
        setIsInsert(true);
      } else {
        setIsValid(false);
      }
    }
  };
  const handleChangeU = (e) => {
    e.preventDefault();
    setusername(e.target.value);
    if (username === "") {
    }
  };
  const handleChangeFn = (e) => {
    e.preventDefault();
    setfn(e.target.value);
  };
  const handleChangeSn = (e) => {
    e.preventDefault();
    setsn(e.target.value);
  };
  const handleChangePass = (e) => {
    e.preventDefault();
    console.log(e.target.value)
    setpassword(e.target.value);
    if(e.target.value.length > 6){
      setIsValid(true)
    }
    else{
      setIsValid(false)
    }};
  const labelClass = getLabelClass(isInsert);
  const LabelSumbitBtn = getSumbitBtnClass(isValid);

  return (
    <div className="flex items-center justify-center flex-wrap max-h-full">
      <BarLoader
        cssOverride={{
          position: "fixed",
          top: 0,
          width: "100%",
        }}
        color="#16DB65"
        loading={isLoading}
      />
      <div
        id="backgroundForm"
        style={{ borderRadius: "56% 44% 84% 16% / 61% 25% 75% 39% " }}
        className="bg-[#16DB65] h-[45em] w-[46em] relative shadow-2xl"
      ></div>
      <div className="h-[90%] flex w-[35em] overflow-x-hidden bg-[#ffffff] rounded-lg border-2 flex-row shadow-xl absolute items-center">
        <Toaster />
        <div className={getScrolledClass(scrolled)}>
          <div className="top pt-3 xl:pt-20 h-[20%] w-[90%] border-b-2 text-2xl font-bold">
            <div className="flex gap-2 xl:hidden mb-[10px]">
              <LazyLoadImage
                src={iconUrl}
                alt="logo"
                width={50}
                height={50}
                effect="blur"
              />
              <h1 className="mt-2">{brand}</h1>
            </div>
            {login ? (
              <div className="flex justify-between text-[20px] xl:text-xl">
                <p>{t("authL")}</p>
                <Link
                  className="font-[600] text-[#266d43]"
                  to={"/authentication/register"}
                >
                  {t("authR")}
                </Link>
              </div>
            ) : (
              <div className="flex justify-between text-[20px] xl:text-xl">
                <p>{t("authR")}</p>
                <Link
                  className="font-[600] text-[#266d43]"
                  to={"/authentication/login"}
                >
                  {t("authL")}
                </Link>
              </div>
            )}
          </div>
          <div className="flex p-6 w-[90%] relative h-[80%] justify-center">
            <form
              className="w-[100%] flex items-center flex-col h-[30em]  gap-0"
              onSubmit={handleSumbit1}
              method="post"
            >
              <input
                autoComplete="on"
                onChange={handleChange}
                value={valueInput}
                type="text"
                id="email"
                className="border duration-500 focus:border-2 transition-all w-[90%] mt-6 top-0 h-8 p-6 rounded-lg peer items-end"
              />
              <label htmlFor="email" className={labelClass}>
                {t("inputF")}
              </label>
              <button
                type="submit"
                aria-label={t('btnSumbit')}
                id="button2"
                disabled={!isValid}
                className={LabelSumbitBtn}
              >
                {t("btnNext")}
              </button>
            </form>
          </div>
        </div>
        <div className={getScrolledClass(scrolled - 1)}>
          <div className="top pt-3 xl:pt-20 h-[20%] w-[90%] border-b-2 text-2xl font-bold">
            <div className="flex gap-2 xl:hidden mb-[10px]">
              <LazyLoadImage
                src={iconUrl}
                alt="logo"
                width={50}
                height={50}
                effect="blur"
              />
              <h1 className="mt-2">{brand}</h1>
            </div>
            <div
              className="flex justify-between text-[20px] xl:text-xl"
              onClick={() => {
                setscrolled(scrolled - 1);
                setvalueInput("");
                setdata("");
                setIsValid(false);
                setusername("");
                setfn("");
                setsn("");
                setpassword("");
              }}
            >
              <p>{t("btnBack")}</p>
            </div>
          </div>
          <div className="flex p-6 w-[90%] relative h-[80%] justify-center">
            {login ? (
              isPhoneNumber ? (
                <form
                  className="w-[100%] flex items-center flex-col h-[30em] gap-0"
                  onSubmit={handleSumbit2}
                  method="post"
                >
                  <input
                    autoComplete="off"
                    onChange={handleChange2}
                    type="text"
                    id="pin"
                    name="otp_code"
                    pattern="\d*" // Hanya memperbolehkan angka
                    maxLength={6} // Maksimal panjang 6 digit
                    value={valueInput}
                    placeholder="******"
                    className="border duration-500 tracking-[3em] text-center flex justify-center focus:border-2 transition-all w-[90%] mt-6 top-0 h-8 p-6 rounded-lg peer items-end"
                  />
                  <label htmlFor="pin" className={labelClass}>
                    {t("inputOTP")}
                  </label>
                  <CountdownComponent data={otpSent} />
                  <button
                    type="submit"
                    aria-label={t('btnSumbit')}
                    id="button2"
                    disabled={!isValid}
                    className={LabelSumbitBtn}
                  >
                    {t("btnSumbit")}
                  </button>
                </form>
              ) : (
                <form
                  className="w-[100%] flex items-center flex-col h-[30em] gap-0"
                  onSubmit={handleSumbit2}
                  method="post"
                >
                  <div className="w-[100%] pl-5">
                    <Input
                      label={t("labelPassword")}
                      variant="underlined"
                      placeholder={t("inputPass")}
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          aria-label="toggle-button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <FaRegEyeSlash className="mt-[2em]" />
                          ) : (
                            <FaRegEye className="mt-[2em]" />
                          )}
                        </button>
                      }
                      size="lg"
                      onChange={handleChange2}
                      type={isVisible ? "text" : "password"}
                      value={valueInput}
                    />
                  </div>

                  <button
                    type="submit"
                    aria-label={t('btnSumbit')}
                    disabled={!isValid}
                    className={LabelSumbitBtn}
                  >
                    {t("btnSumbit")}
                  </button>
                </form>
              )
            ) : (
              <form
                className="w-[100%] flex items-center flex-col h-[30em] gap-0"
                onSubmit={handleSumbit2}
                method="post"
              >
                <div className="w-[100%] flex flex-wrap pl-5">
                  <Input
                    label={t("labelUsername")}
                    variant="underlined"
                    placeholder={t("inputUsername")}
                    className="mb-5"
                    size="lg"
                    value={username}
                    isRequired
                    onChange={handleChangeU}
                  />
                  <Input
                    label={t("labelFn")}
                    isRequired
                    variant="underlined"
                    value={fn}
                    placeholder={t("inputFn")}
                    className="w-[40%] mr-[15%] mb-5"
                    size="md"
                    onChange={handleChangeFn}
                  />
                  <Input
                    label={t("labelLn")}
                    variant="underlined"
                    value={sn}
                    placeholder={t("inputLn")}
                    className="w-[45%] mb-5"
                    size="md"
                    onChange={handleChangeSn}
                  />
                  <Input
                    label={t("inputPass")}
                    variant="underlined"
                    isRequired
                    placeholder={t("inputPass")}
                    endContent={
                      <button
                        className="focus:outline-none "
                        aria-label="toggle-button"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <FaRegEyeSlash className="mt-[2em] " />
                        ) : (
                          <FaRegEye className="mt-[2em]" />
                        )}
                      </button>
                    }
                    size="lg"
                    onChange={handleChangePass}
                    type={isVisible ? "text" : "password"}
                    value={password}
                  />
                </div>
                <button
                  type="submit"
                  aria-label={t('btnSumbit')}
                  disabled={!isValid}
                  className={LabelSumbitBtn}
                >
                  {t("btnSumbit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationComponent;
