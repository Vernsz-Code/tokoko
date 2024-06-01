import React, { useEffect, useState } from 'react';
import { LocalStoragePusher } from './LocalStoragePusher';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { useTranslation } from 'react-i18next';

function CountdownComponent({ data }) {
  const baseUrl = process.env.REACT_APP_BASE_URL + '/api/';
  const storage = LocalStoragePusher('createdat');
  const newTime = Date.now();
  const { t } = useTranslation();
  let lastTime;
  if (storage.getItem('createdat') !== undefined) {
    lastTime = new Date(storage.getItem('createdat')).getTime();
  }
  const time = (newTime - lastTime) / 1000;
  const formattedTime = Math.floor(time);
  const [currentTime, setCurrentTime] = useState(formattedTime);

  
  const postOtp = () => {
      axios
      .post(baseUrl + 'createotp', data)
      .then((response) => {
          toast.info(t('toastOTPR'), {
              position: 'top-right',
              duration: 5000,
        });
        
        let createdAt = response.data.data.created_at;
        
        storage.removeItem('createdat');
        storage.setItem('createdat', createdAt);
        setCurrentTime(0);
    })
    .catch((err) => {
        console.log(err.response.data.message);
    });
};
useEffect(() => {
  if (currentTime > 0 || currentTime < 300) {
    const intervalId = setInterval(() => {
      setCurrentTime((prevTime) => (prevTime >= 0 && prevTime <= 300 ? prevTime + 1 : 0));
    }, 1000);
    return () => clearInterval(intervalId);
  }
}, [currentTime]);


return (
    <div className='font-bold text-gray-800 w-[90%] text-sm flex mt-5'>
      <Toaster />
      {formattedTime >= 0 && formattedTime < 300 ? (
        <p className='cursor-not-allowed opacity-50'>{t('resendOTPB')}: {300 - formattedTime} {t('secondT')}</p>
      ) : (
        <p className=' cursor-pointer' onClick={postOtp}>{t('resendOTPA')}</p>
      )}
    </div>
  );
}

export default CountdownComponent;
