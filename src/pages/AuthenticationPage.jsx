import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import AuthenticationComponent from '../components/AuthenticationComponent';
import { useParams } from 'react-router-dom';

function RegisterPage() {
    const params = useParams();
    const [valueParam, setValueParam] = useState();
    useEffect(() => {
        if (params.param === 'register') {
        setValueParam(false);
        } else {
        setValueParam(true);
        }
    }, [params.param]); 
  
    const iconUrl = process.env.REACT_APP_LOGO_URL;
    return (
        <div style={{
                fontFamily: 'poppins, sans-serif'
            }} 
            className='overflow-hidden w-[100%] bg-[#ffffff] min-h-[100vh] flex relative flex-wrap'>
            <div className='hidden absolute gap-3 font-bold text-2xl mt-[5em] ml-[4em] w-[13em] z-40 xl:flex'>
                <LazyLoadImage
                    src={iconUrl}
                    alt='logo'
                    width={50}
                    height={50}
                    effect='blur'
                />
                <h1 className='mt-2'>
                    TOKOKO
                </h1>
                <div className='absolute rotatediv h-[30em] w-[6em] border-[1px] bg-[#ffffff] ml-[-7em] mt-[190%] shadow-2xl rounded-xl rotate-[30deg] xl:ml-[-3em] xl:mt-[165%]'></div>
            </div>
            <div className="flex h-[100vh] w-full justify-center items-center">
                <AuthenticationComponent login={valueParam}/>
            </div>
        </div>
    )
}

export default RegisterPage