import { useState } from 'react';
import Login from './Pages/login/Login';
import Register from './Pages/register/Register';
import Topbar from './Components/topbar/Topbar';
import Left_sidebar from './Components/left_sidebar/Left_sidebar';
import Share from './Components/share/Share';
import HomeScreen from './Pages/Home/HomeScreen';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profile from './Pages/viewProfile/profile';
import AdminLogin from './Pages/admin/AdminLogin';
import AdminHomeScreen from './Pages/Home/AdminHomeScreen';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />, 
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/home",
      element: <HomeScreen />,
    },
    {
      path: "/profile",
      element: <Profile />
    },
    {
      path: "/admin",
      element: <AdminLogin/>
    },
    {
      path: "/adminhome",
      element: <AdminHomeScreen />,
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;