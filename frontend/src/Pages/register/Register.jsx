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
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Check required fields
    ['name', 'username', 'email', 'password', 'department'].forEach(field => {
      if (!data[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    // Validate email format
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Validate password
    if (data.password) {
      if (data.password.length < 8) {
        newErrors.password = 'Password should be at least 8 characters long';
        isValid = false;
      } else if (!/[a-z]/.test(data.password)) {
        newErrors.password = 'Password must contain at least 1 lowercase letter';
        isValid = false;
      } else if (!/[A-Z]/.test(data.password)) {
        newErrors.password = 'Password must contain at least 1 uppercase letter';
        isValid = false;
      } else if (!/[0-9]/.test(data.password)) {
        newErrors.password = 'Password must contain at least 1 number';
        isValid = false;
      } else if (!/[^A-Za-z0-9]/.test(data.password)) {
        newErrors.password = 'Password must contain at least 1 special character';
        isValid = false;
      }
    }

    // Validate graduation year
    if (data.graduationYear) {
      const year = parseInt(data.graduationYear, 10);
      if (isNaN(year) || year < 2025 || year > 2099) {
        newErrors.graduationYear = 'Graduation year must be between 2025 and 2099';
        isValid = false;
      }
    } else {
      newErrors.graduationYear = 'Graduation year is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    const formData = {
      ...data,
      graduationYear: parseInt(data.graduationYear, 10)
    };

    axios.post("http://localhost:3000/api/v1/user/signup", formData)
      .then((res) => {
        console.log("Registered Successfully", res);
        navigate('/Login');
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
          <i className="fa-solid fa-user"></i> Register
        </h1>
        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3" role="alert">
            <span className="block sm:inline">{generalError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {['name', 'username', 'email', 'password', 'department'].map((field) => (
            <div key={field} className="mt-3">
              <label htmlFor={field} className="block text-base mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                // type={field === 'password' ? 'password' : 'text'}
                type="text"
                name={field}
                className="border w-full text-base px-2 py-1 focus:outline-none"
                placeholder={`Enter your ${field}...`}
                value={data[field]}
                onChange={handleInputChange}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}
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