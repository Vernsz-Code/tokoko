import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useTranslation } from "react-i18next";
import SkeletonCardComponent from './skeletonCardComponent';

function SearchComponent({ search, isReload }) {
    const { t } = useTranslation();
    const baseUrl = process.env.REACT_APP_BASE_URL + "/api/";
    const [data, setData] = useState([]);
    const imageUrl = process.env.REACT_APP_BASE_URL + "/storage/imageProduct/";
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchData = () => {
      axios
        .get(`${baseUrl}products/searchname/${search}`)
        .then((res) => {
          setData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    };
  
    useEffect(() => {
      fetchData();
    }, [baseUrl]);
  
    useEffect(() => {
      fetchData();
    }, [isReload]);
  
    if (!isLoading && data.length === 0) {
      return <p>{t("noResultFound")}</p>;
    }
  
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:gap-2 md:gap-5">
        {data.map((product) => (
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
            />
          </div>
        ))}
      </div>
    );
  }
  export default SearchComponent;
  