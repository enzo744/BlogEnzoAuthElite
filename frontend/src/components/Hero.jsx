import blogAbout from "../assets/blog-about.avif";
import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { getData } from "@/context/userContext";

const Hero = () => {
  const { user } = getData();
  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        {/* text section */}
        <div className="max-w-2xl">
          <h1 className="text-2xl lg:text-5xl md:text-4xl font-semibold mt-5 mb-4 ">
            Welcome, {user ? " " + user.username : ""}
          </h1>
          <p className="text-sm md:text-lg pb-4">
            Resta aggiornato con articoli approfonditi, tutorial e
            approfondimenti su sviluppo web, marketing digitale e innovazioni
            tecnologiche.
          </p>
          <div className="flex space-x-4">
            <Link to={"/dashboard/write-blog"}>
              <Button className="md:text-lg text-sm">Crea un blog</Button>
            </Link>
            <Link to={"/about"}>
              <Button
                variant="outline"
                className="border-white px-6 py-3 md:text-lg text-sm"
              >
                Altre Info
              </Button>
            </Link>
          </div>
        </div>
        {/* image section */}
        <div className=" flex items-center justify-center ">
          <img
            src={blogAbout}
            alt=""
            className="lg:h-[350px] md:w-[550px] object-scale-down"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
