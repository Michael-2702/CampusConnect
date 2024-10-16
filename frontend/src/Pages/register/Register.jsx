import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromInitiateSignup = location.state?.email || "";

  const [data, setData] = useState({
    name: "",
    username: "",
    email: emailFromInitiateSignup,
    password: "",
    department: "",
    graduationYear: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (!emailFromInitiateSignup) {
      navigate('/initiate-signup'); // Redirect if email is not provided
    }
  }, [emailFromInitiateSignup, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for graduationYear
    if (name === 'graduationYear') {
      // Remove any non-digit characters and parse to number
      const numericValue = parseInt(value.replace(/\D/g, ''), 10);
      
      // If the value is a valid number, update the state
      // If the input is empty, keep it as empty string to allow clearing the input
      setData({
        ...data,
        [name]: value === '' ? '' : numericValue || ''
      });
    } else {
      setData({ ...data, [name]: value });
    }
    
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required.";
    if (!data.username) newErrors.username = "Username is required.";
    if (!data.password) newErrors.password = "Password is required.";
    if (!data.department) newErrors.department = "Department is required.";
    if (!data.graduationYear) {
      newErrors.graduationYear = "Graduation year is required.";
    } else if (isNaN(data.graduationYear) || data.graduationYear < 1900 || data.graduationYear > 2100) {
      newErrors.graduationYear = "Please enter a valid graduation year between 1900 and 2100.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Ensure graduationYear is sent as a number in the API request
    const submitData = {
      ...data,
      graduationYear: parseInt(data.graduationYear, 10)
    };

    axios.post("http://localhost:3000/api/v1/user/complete-signup", submitData)
      .then((res) => {
        console.log("Registration Successful", res);
        navigate('/Login');
      })
      .catch((err) => {
        console.log("Error", err);
        if (err.response && err.response.data.error) {
          const zodErrors = err.response.data.error;
          const formattedErrors = {};
          zodErrors.forEach(error => {
            formattedErrors[error.path[0]] = error.message;
          });
          setErrors(formattedErrors);
        } else if (err.response && err.response.data.msg) {
          setGeneralError(err.response.data.msg);
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 rounded-md shadow-xl">
        <h1 className="text-3xl block text-center font-semibold">
          <i className="fa-solid fa-user"></i> Register
        </h1>
        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3" role="alert">
            <span className="block sm:inline">{generalError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="name" className="block text-base mb-2">Name</label>
            <input
              type="text"
              name="name"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter your name..."
              value={data.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="username" className="block text-base mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter your username..."
              value={data.username}
              onChange={handleInputChange}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="email" className="block text-base mb-2">Email</label>
            <input
              type="text"
              name="email"
              className="border w-full text-base px-2 py-1 focus:outline-none bg-gray-100"
              value={data.email}
              readOnly
            />
          </div>
          <div className="mt-3">
            <label htmlFor="password" className="block text-base mb-2">Password</label>
            <input
              type="text"
              name="password"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter your password..."
              value={data.password}
              onChange={handleInputChange}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="department" className="block text-base mb-2">Department</label>
            <input
              type="text"
              name="department"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter your department..."
              value={data.department}
              onChange={handleInputChange}
            />
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="graduationYear" className="block text-base mb-2">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter your graduation year..."
              value={data.graduationYear}
              onChange={handleInputChange}
              min="1900"
              max="2100"
            />
            {errors.graduationYear && <p className="text-red-500 text-sm mt-1">{errors.graduationYear}</p>}
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-blue-500 bg-blue-500 text-white py-1 w-full rounded-md hover:bg-blue-600 focus:outline-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
            >
              <h3 className='font-black'>Register</h3> 
            </button>
          </div>
        </form>
        <div className="mt-3 flex justify-center">
          <NavLink to="/Login" className="text-blue-700 font-semibold">
            <h3 className='font-bold'>Already have an account? Login</h3> 
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Register;