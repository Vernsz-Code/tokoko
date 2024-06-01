import React from "react";
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
} from "@nextui-org/react";
import { IoMdSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function NavbarComponents({ title, logoUrl, IsLogin, username, user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  console.log(IsLogin);
  return (
    <Navbar isBordered shouldHideOnScroll className="bg-[#16DB65] w-[70em] shadow-lg rounded-b-md z-50">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4 text-white">
          <Avatar isBordered src={logoUrl}  onClick={() => navigate("/")} className="cursor-pointerl"/>
          <p className="ml-8 hidden sm:block font-bold text-inherit cursor-pointer" onClick={() => navigate("/")}>{title}</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[40rem] h-10 bg-white rounded-lg",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder={t("inputSearch")}
          size="sm"
          startContent={<IoMdSearch />}
          type="search"
        />
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
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
              <DropdownItem key="settings"
                onClick={
                  () => {
                    navigate("/MarketPlace")
                  }
                }
              >{t("btnSetting")}</DropdownItem>
              <DropdownItem key="help_and_feedback"
                onClick={
                  () => {
                    window.open("https://wa.me/+6285183123404?text=Bantuan dan Masukan,", "_blank");
                  }
                }
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
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link
                className="text-white font-bold"
                href="/authentication/login"
              >
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
          </NavbarContent>
        )}
      </NavbarContent>
    </Navbar>
  );
}

export default NavbarComponents;
