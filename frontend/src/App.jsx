import { useState } from 'react';
import Login from './Pages/login/Login';
import Register from './Pages/register/Register';
import Topbar from './Components/topbar/Topbar';
import Left_sidebar from './Components/left_sidebar/Left_sidebar';
import Share from './Components/share/Share';
import HomeScreen from './Pages/Home/HomeScreen';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;