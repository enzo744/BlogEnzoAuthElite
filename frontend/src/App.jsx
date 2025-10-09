import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

// Importa i provider e i componenti di layout
import { UserProvider } from "./context/userContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Importa le tue pagine
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogView from "./pages/BlogView";
import CreateBlog from "./pages/CreateBlog";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import YourBlog from "./pages/YourBlog";
import UpdateBlog from "./pages/UpdateBlog";
import VistaTabellare from "./pages/VistaTabellare";
import SearchResults from "./pages/SearchResults";
import Rubrica from "./pages/Rubrica";

// --- LAYOUT PRINCIPALE (CON LA CORREZIONE) ---
const AppLayout = () => {
  return (
    <UserProvider>
      <Navbar />
      <main className=""> {/* <-- CORREZIONE APPLICATA QUI */}
        <Outlet />
      </main>
      <Footer />
    </UserProvider>
  );
};

// --- LAYOUT DEL DASHBOARD ---
const DashboardLayout = () => {
  return (
    <UserProvider>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </UserProvider>
  );
};

// --- CONFIGURAZIONE DEL ROUTER ---
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/blogs", element: <Blog /> },
      { path: "/about", element: <About /> },
      { path: "/search", element: <SearchResults /> },
      { path: "/profile", element: <Profile /> },
      {
        path: "/blogs/:blogId",
        element: (
          <ProtectedRoute>
            <BlogView />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "write-blog", element: <CreateBlog /> },
      { path: "write-blog/:blogId", element: <UpdateBlog /> },
      { path: "your-blog", element: <YourBlog /> },
      { path: "profile", element: <Profile /> },
      { path: "vista-tabellare", element: <VistaTabellare /> },
      { path: "rubrica", element: <Rubrica /> },
    ],
  },
  // Rotte senza layout principale
  {
    path: "/login",
    element: (
      <UserProvider>
        <Navbar /> <Login />
      </UserProvider>
    ),
  },
  {
    path: "/signup",
    element: (
      <UserProvider>
        <Navbar /> <Signup />
      </UserProvider>
    ),
  },
  { path: "/verify", element: <VerifyEmail /> },
  { path: "/verify/:token", element: <Verify /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-otp/:email", element: <VerifyOTP /> },
  { path: "/change-password/:email", element: <ChangePassword /> },
]);

// --- IL COMPONENTE APP ---
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;