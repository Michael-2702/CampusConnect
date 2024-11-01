import Login from './Pages/login/Login';
import Register from './Pages/register/Register';
import HomeScreen from './Pages/Home/HomeScreen';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profile from './Pages/viewProfile/Profile';
import AdminLogin from './Pages/admin/AdminLogin';
import AdminHomeScreen from './Pages/Home/AdminHomeScreen';
import AdminReportedPosts from '../src/Components/post/AdminReportedPosts'
import ViewOtherProfile from './Pages/viewProfile/ViewOtherProfile';
import AdminViewOtherProfile from './Pages/viewProfile/AdminViewOtherProfile'
import { ErrorComponent } from './Pages/errorPage/ErrorComponent';
import UserList from './Components/user-Lists/UserList'
import InitiateSignup from './Pages/email-verification/InitiateSignup'

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
      path: "/profile/:id",
      element: <ViewOtherProfile />
    },
    {
      path: "/admin",
      element: <AdminLogin/>
    },
    {
      path: "/adminhome",
      element: <AdminHomeScreen />,
    },
    {
      path: "/reportedPosts",
      element: <AdminReportedPosts/>
    },
    {
      path: "/adminViewProfile/:id",
      element: <AdminViewOtherProfile/>
    },{
      path: "*",
      element: <ErrorComponent />
    }, 
    {
      path: "/viewAllUsers",
      element: <UserList />
    },
    {
      path: "/email-verification",
      element: <InitiateSignup />
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;