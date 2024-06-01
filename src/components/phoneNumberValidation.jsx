import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberValidation = ({ onPhoneNumberChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [valid, setValid] = useState(true);

  const handleChange = (value) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
    onPhoneNumberChange(value); // Panggil fungsi callback untuk mengirim data ke komponen induk
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  return (
    <div>
      <label>
        Phone Number:
        <PhoneInput
          country={'id'}
          value={phoneNumber}
          onChange={handleChange}
          inputProps={{
            required: true,
          }}
        />
      </label>
      {!valid && (
        <p>Please enter a valid phone number.</p>
      )}
    </div>
  );
};

export default PhoneNumberValidation;
