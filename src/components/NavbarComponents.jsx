import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Image,
} from "@nextui-org/react";
import { IoMdSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function NavbarComponents({ title, logoUrl, IsLogin, username, user, isreload }) {
  const { t, i18n } = useTranslation();
  const baseUrl = process.env.REACT_APP_BASE_URL + "/images/flag/";
  const idFlags = baseUrl + "id.png";
  const ukFlags = baseUrl + "en.png";

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navigate = useNavigate();
  const [searchData, setSearchData] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate("/s/" + searchData);
      if (typeof isreload === "function") {
        isreload();
      }
    }
  };

  const handleClickSearch = () => {
    navigate("/s/" + searchData);
    if (typeof isreload === "function") {
      isreload();
    }
  };

  const handleChange = (e) => {
    setSearchData(e.target.value);
  };

  return (
    <Navbar isBordered shouldHideOnScroll className="bg-[#16DB65] w-screen xl:w-[70em] shadow-lg rounded-b-md z-50">
      <div className="grid grid-cols-6 w-full gap-4">
        <NavbarContent as="div" justify="start" className=" col-span-1 col-start-1">
          <NavbarBrand className="mr-4 text-white">
            <Avatar
              isBordered
              src={logoUrl}
              onClick={() => navigate("/")}
              className="cursor-pointer"
            />
            <p
              className="ml-8 hidden lg:block font-bold text-inherit cursor-pointer"
              onClick={() => navigate("/")}
            >
              {title}
            </p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent as="div" className=" col-start-2  col-span-4 col-end-6">
          <Input
            classNames={{
              base: "min-w-screen sm:max-w-[40rem] h-10 bg-white rounded-lg",
              mainWrapper: "h-full w-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            onChange={handleChange}
            value={searchData}
            onKeyDown={handleKeyPress}
            placeholder={t("inputSearch")}
            size="sm"
            startContent={<IoMdSearch onClick={handleClickSearch} />}
            type="search"
          />
        </NavbarContent>
        <NavbarContent as="div" className="items-center col-start-6 col-span-1">
          {IsLogin ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  showFallback
                  className="transition-transform"
                  color="secondary"
                  name={username}
                  size="sm"
                  src=""
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">{username}</p>
                  <p className="font-semibold">{user}</p>
                </DropdownItem>
                <DropdownItem key="settings" onClick={() => navigate("/MarketPlace")}>
                  {t("btnSetting")}
                </DropdownItem>
                <DropdownItem key="cart" onClick={() => navigate("/cart")}>
                  {t("btncart")}
                </DropdownItem>
                <DropdownItem
                  key="help_and_feedback"
                  onClick={() => {
                    window.open("https://wa.me/+6285183123404?text=Bantuan dan Masukan,", "_blank");
                  }}
                >
                  {t("feedback")}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token_id");
                    localStorage.removeItem("id");
                    window.location.reload();
                  }}
                >
                  {t("btnLogout")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <>
              <NavbarItem className="hidden lg:flex">
                <Link className="text-white font-bold" href="/authentication/login">
                  {t("authL")}
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  className="bg-white font-bold"
                  href="/authentication/register"
                  variant="flat"
                >
                  {t("authR")}
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </div>
    </Navbar>
  );
}

export default NavbarComponents;
