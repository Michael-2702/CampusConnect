import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function InitiateSignup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateEmail = (email) => {
    return email.endsWith('@pvppcoe.ac.in');
  };

  const sendOTP = (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateEmail(data.email)) {
      setErrors({ email: "Only Emails ending with @pvppcoe.ac.in can Register" });
      return;
    }

    axios.post("http://localhost:3000/api/v1/user/initiate-signup", { email: data.email })
      .then((res) => {
        console.log("OTP Sent Successfully", res);
        setOtpSent(true);
      })
      .catch((err) => {
        console.log("Error", err);
        if (err.response) {
          if (err.response.data.msg) {
            setGeneralError(err.response.data.msg);
          }
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      });
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    setGeneralError("");

    axios.post("http://localhost:3000/api/v1/user/verify-otp", data)
      .then((res) => {
        console.log("OTP Verified Successfully", res);
        navigate('/Register', { state: { email: data.email } }); 
      })
      .catch((err) => {
        console.log("Error", err);
        if (err.response) {
          if (err.response.data.error) {
            const zodErrors = err.response.data.error;
            const formattedErrors = {};
            zodErrors.forEach(error => {
              formattedErrors[error.path[0]] = error.message;
            });
            setErrors(formattedErrors);
          } else if (err.response.data.msg) {
            setGeneralError(err.response.data.msg);
          }
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 rounded-md shadow-xl">
        <h1 className="text-3xl block text-center font-semibold">
          <i className="fa-solid fa-user"></i> Email Verification
        </h1>
        
        <div className="mt-3">
          <label htmlFor="email" className="block text-base mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="border w-full text-base px-2 py-1 focus:outline-none"
            placeholder="Enter your Email..."
            value={data.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        {!otpSent && (
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-blue-500 bg-blue-500 text-white py-1 w-full rounded-md hover:bg-blue-600 focus:outline-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={sendOTP}
            >
              <i className="fa-solid fa-right-to-bracket"></i> <h3 className='font-black'>Send OTP</h3> 
            </button>
          </div>
        )}
        {otpSent && (
          <>
            <div className="mt-3">
              <label htmlFor="otp" className="block text-base mb-2">OTP</label>
              <input
                type="text"
                name="otp"
                className="border w-full text-base px-2 py-1 focus:outline-none"
                placeholder="Enter OTP..."
                value={data.otp}
                onChange={handleInputChange}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>
            <div className="mt-5">
              <button
                type="submit"
                className="border-2 border-blue-500 bg-blue-500 text-white py-1 w-full rounded-md hover:bg-blue-600 focus:outline-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                onClick={verifyOTP}
              >
                <i className="fa-solid fa-right-to-bracket"></i> <h3 className='font-black'>Verify OTP</h3> 
              </button>
            </div>
          </>
        )}
        {generalError && <p className="text-red-500 text-sm mt-3">{generalError}</p>}
      </div>
    </div>
  );
}

export default InitiateSignup;