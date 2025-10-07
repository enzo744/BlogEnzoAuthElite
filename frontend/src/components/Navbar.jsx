import { BookOpen, ChartColumnBig, LogOut, PhoneForwarded, Search, User } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getData } from "@/context/userContext";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import { FaMoon, FaRegListAlt, FaSun } from "react-icons/fa";
import { toggleTheme } from "../redux/themeSlice";
import ResponsiveMenu from "./ResponsiveMenu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import userLogo from "../assets/user.jpg";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { LuFilePlus2 } from "react-icons/lu";

const Navbar = () => {
  const { user, setUser } = getData();
  const { theme } = useSelector((store) => store.theme);
  const [searchTerm, setSearchTerm] = useState(""); // Questo stato viene usato per la ricerca
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `https://blogenzoauthelite.onrender.com/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        setUser(null);
        toast.success(res.data.message);
        localStorage.clear();
        navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  return (
    <div className="navbar no-print py-3 fixed w-full bg-gray-50 dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-500 border-1 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 lg:px-2 ">
        {/* logo section */}
        <div className="flex gap-5 items-center">
          <Link to={"/"}>
            <div className="flex gap-1 items-center">
               <BookOpen className="h-6 w-6 text-sky-700" /> {/* icona */}
              <h1 className="font-bold text-xl">
                <span className="text-sky-600">Note </span>Varie
              </h1>
            </div>
          </Link>
          <div className="relative hidden lg:block">
            <Input
              type="text"
              placeholder="Search"
              className="border border-gray-700 dark:bg-gray-900 bg-gray-300  "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="absolute right-0 top-0" onClick={handleSearch}>
              <Search /> {/* icona */}
            </Button>
          </div>
        </div>
        {/* nav section */}
        <nav className="flex lg:gap-5 gap-4 items-center">
          <ul className="hidden md:flex gap-7 items-center text-md ">
            <NavLink to={"/"} className="cursor-pointer">
              <li>Home</li>
            </NavLink>
            <NavLink to={"/blogs"} className={`cursor-pointer`}>
              <li>Blogs</li>
            </NavLink>
            <NavLink to={"/about"} className={`cursor-pointer`}>
              <li>About</li>
            </NavLink>
            {/* <NavLink to={'/write-blog'} className={`cursor-pointer`}><li>Nuovo Blog</li></NavLink> */}
            {/* <NavLink to={'/dashboard/your-blog'} className={`cursor-pointer`}><li>Miei Blogs</li></NavLink> */}
            {/* <NavLink to={'/dashboard/vista-tabellare'} className={`cursor-pointer`}><li>Lista Blogs</li></NavLink> */}
          </ul>
          <div className="flex">
            <Button onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
            {user ? (
              <div className="ml-7 flex gap-3 items-center">
                {/* <Link to={'/profile'}> */}
                <DropdownMenu className="">
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.photoUrl || userLogo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 dark:bg-gray-800">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/profile")}
                      >
                        <User />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/your-blog")}
                      >
                        <ChartColumnBig />
                        <span>I Miei Blogs</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>

                       <DropdownMenuItem
                         onClick={() => navigate("/dashboard/vista-tabellare")}
                       >
                         <FaRegListAlt />
                         <span>Lista Blogs</span>
                         <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                       </DropdownMenuItem>

                       <DropdownMenuItem
                         onClick={() => navigate("/dashboard/rubrica")}
                       >
                         <PhoneForwarded />
                         <span>Rubrica</span>
                         <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                       </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/write-blog")}
                      >
                        <LuFilePlus2 />
                        <span>Nuovo Blog</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler}>
                      <LogOut />
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* </Link> */}
                <Button className="hidden md:block" onClick={logoutHandler}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="ml-7 lg:flex gap-2 ">
                <Link to={"/login"}>
                  <Button>Login</Button>
                </Link>
                <Link className="hidden lg:block" to={"/signup"}>
                  <Button>Signup</Button>
                </Link>
              </div>
            )}
          </div>
          {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          )}
        </nav>
        <ResponsiveMenu
          openNav={openNav}
          setOpenNav={setOpenNav}
          logoutHandler={logoutHandler}
        />
      </div>
    </div>
  );
};

export default Navbar;
