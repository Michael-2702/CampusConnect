import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    adminId: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const PostData = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // Clear the error for this field when the user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    axios
      .post('http://localhost:3001/api/v2/admin/login/', data)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("authorization", res.data.token);
          console.log("Token stored in localStorage:- ", res.data.token);
          // alert(res.data.msg); // Show success message
          navigate('/adminHome');
        } else {
          // If there's a message but no token, it's probably an error
          alert(res.data.msg);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data.error) {
          // Handle Zod validation errors
          const zodErrors = err.response.data.error;
          const formattedErrors = {};
          zodErrors.forEach(error => {
            formattedErrors[error.path[0]] = error.message;
          });
          setErrors(formattedErrors);
        } else if (err.response) {
          alert(err.response.data.msg || "An error occurred");
        } else if (err.request) {
          alert("No response received from server");
        } else {
          alert("Error: " + err.message);
        }
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 rounded-md shadow-xl">
        <h1 className="text-3xl block text-center font-semibold">
          <i className="fa-solid fa-user"></i> Admin Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="text" className="block text-base mb-2">AdminId</label>
            <input
              type="text"
              name="adminId"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter AdminId..."
              value={data.adminId}
              onChange={PostData}
            />
            {errors.adminId && <p className="text-red-500 text-sm mt-1">{errors.adminId}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="password" className="block text-base mb-2">Password</label>
            <input
              type="text"
              name="password"
              className="border w-full text-base px-2 py-1 focus:outline-none"
              placeholder="Enter your Password..."
              value={data.password}
              onChange={PostData}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mt-5">
          <button
              type="submit"
              className="border-2 border-blue-500 bg-blue-500 text-white py-1 w-full rounded-md hover:bg-blue-600 focus:outline-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
            >
              <i className="fa-solid fa-right-to-bracket"></i> <h3 className='font-black'>Login</h3> 
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default AdminLogin;