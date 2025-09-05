import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";
import About from "./pages/About";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import SearchList from "./pages/SearchList";
import BlogView from "./pages/BlogView";
import CreateBlog from "./pages/CreateBlog";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import YourBlog from "./pages/YourBlog";
import UpdateBlog from "./pages/UpdateBlog";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/blogs",
    element: (
      <>
        <Navbar />
        <Blog />
        <Footer />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Navbar />
        <About />
        <Footer />
      </>
    ),
  },
  {
    path: "/search",
    element: (
      <>
        <Navbar />
        <SearchList />
        <Footer />
      </>
    ),
  },
  {
    path: "/blogs/:blogId",
    element: (
      <>
        <Navbar />
        <ProtectedRoute>
          <BlogView />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/write-blog",
    element: (
      <>
        <Navbar />
        <CreateBlog />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Navbar />
        <Profile />
        <Footer />
      </>
    ),
  },
  {
    path: "write-blog/:blogId",
    element: (
      <>
        <Navbar />
        <CreateBlog />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Navbar />
        <Dashboard />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Navbar />
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </>
    ),
    children: [
      {
        path: "write-blog",
        element: (
          <>
            <CreateBlog />
          </>
        ),
      },
      {
        path: "write-blog/:blogId",
        element: (
          <>
            <UpdateBlog />
          </>
        ),
      },
      {
        path: "your-blog",
        element: <YourBlog />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Signup />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/verify/:token",
    element: <Verify />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp/:email",
    element: <VerifyOTP />,
  },
  {
    path: "/change-password/:email",
    element: <ChangePassword />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
