import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    department: "",
    graduationYear: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // Clear the error for this field when the user starts typing
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    // Convert graduationYear to number
    const formData = {
      ...data,
      graduationYear: data.graduationYear ? parseInt(data.graduationYear, 10) : undefined
    };

    axios
      .post("http://localhost:3000/api/v1/user/signup", formData)
      .then((res) => {
        console.log("Registered Successfully", res);
        // alert("Registered Successfully");
        navigate('/Login');
      })
      .catch((err) => {
        console.log("Error", err);
        if (err.response) {
          if (err.response.data.error) {
            // Handle Zod validation errors
            const zodErrors = err.response.data.error;
            const formattedErrors = {};
            zodErrors.forEach(error => {
              formattedErrors[error.path[0]] = error.message;
            });
            setErrors(formattedErrors);
          } else if (err.response.data.msg) {
            // Handle other backend errors
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
            <label htmlFor="email" className="block text-base mb-2">Email ID</label>
            <input
              type="email"
              name="email"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter your Email ID..."
              value={data.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
              min="2025" max="2099" step="1" 
              name="graduationYear"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter your graduation year..."
              value={data.graduationYear}
              onChange={handleInputChange}
            />
            {errors.graduationYear && <p className="text-red-500 text-sm mt-1">{errors.graduationYear}</p>}
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-red-700 bg-red-700 text-white py-1 w-full rounded-md hover:bg-red-600 focus:outline-none"
            >
              <i className="fa-solid fa-right-to-bracket"></i> Register
            </button>
          </div>
        </form>
        <div className="mt-3 flex justify-center">
          <NavLink to="/Login" className="text-red-700 font-semibold">
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Register;