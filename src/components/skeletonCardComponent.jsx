import React from 'react'
import { FaStore } from "react-icons/fa";
import { FaPencilAlt, FaRegStar, FaRegTrashAlt } from "react-icons/fa";
import { Card, Skeleton, Image, Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { Toaster, toast } from 'sonner';

function SkeletonCardComponent({ isLoaded, img = "", title = "", price = "", rating = "", store = "", isOwn = false, id = "" , handler, editHandler, selectedid}) {
  const baseUrl = process.env.REACT_APP_BASE_URL + "/api/";
  const { t } = useTranslation();
  const deleteData = () => {
    axios.delete(baseUrl + "products/" + id)
      .then(() => {
        handler()
        console.log("success")
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handlerdelete = () => {
    toast.info(t("toast5"), {
      position: "top-right",
      duration: 5000,
      action: {
        label: t("yes"),
        onClick: () => {
          deleteData()
        },
      },
    });
  }
  const handleredit = () => {
    selectedid(id)
    editHandler()
  }
  return (
    <Card className="w-[200px] space-y-5 p-4 cursor-pointer" radius="lg">
      <Skeleton isLoaded={isLoaded} className="rounded-lg text-end">
        {isOwn ?
          <Popover
          showArrow
          placement="right"
          backdrop="blur"
          >
            <PopoverTrigger>
              ...
            </PopoverTrigger>
            <PopoverContent>
              <div className="min-w-[4em] p-2 grid grid-rows-2 gap-2">
                <Button size='sm' color='primary' endContent={<FaPencilAlt />} onClick={handleredit}>Edit</Button>
                <Button size='sm' color='danger' endContent={<FaRegTrashAlt />} onClick={handlerdelete} >Delete</Button>
              </div>
            </PopoverContent>
          </Popover> :
          <></>
        }
        <Image width="100%" src={img} alt={title} fallbackSrc="https://via.placeholder.com/168x96" isZoomed className="h-24 mt-2 rounded-lg bg-default-300 object-cover" />
      </Skeleton>
      <div className="space-y-3">
        <Skeleton isLoaded={isLoaded} className="w-full rounded-lg">
          <span className="text-sm font-bold w-full">
            {title.length > 19 ? `${title.slice(0, 19)}...` : title}
          </span>
        </Skeleton>
        <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
          <span className="text-sm h-4 items-center gap-2 w-full flex">
            <FaStore />{store.length > 12 ? `${store.slice(0, 12)}...` : store}
          </span>
        </Skeleton>
        <Skeleton isLoaded={isLoaded} className="w-full rounded-lg">
          <div className="h-4 w-full rounded flex justify-between">
            <span className="text-sm font-bold">
              Rp.{price}
            </span>
            <div className="text-sm font-bold flex items-center">
              <FaRegStar />{rating}
            </div>
          </div>
        </Skeleton>
      </div>
    </Card>

  )
}

export default SkeletonCardComponent