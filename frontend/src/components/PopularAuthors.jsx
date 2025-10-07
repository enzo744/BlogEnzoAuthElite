import axios from "axios";
import { useEffect, useState } from "react";
import userLogo from "../assets/user.jpg";

const PopularAuthors = () => {
  const [popularUser, setPopularUser] = useState([]);
  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `https://blogenzoauthelite.onrender.com/user/all-users`
      );
      if (res.data.success) {
        setPopularUser(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 items-center">
          <h1 className="text-3xl md:text-4x text-center font-semibold pt-10 ">
            Autori iscritti di recente
          </h1>
          <hr className=" w-48 text-center border-2 border-red-600 rounded-full" />
        </div>
        <div className="flex items-center justify-around my-10 px-4 md:px-0">
          {popularUser?.slice(0, 5)?.map((user, index) => {
            return (
              <div key={index} className="flex flex-col gap-2 items-center">
                <img
                  src={user.photoUrl || userLogo}
                  alt=""
                  className="rounded-full h-12 w-12 md:w-32 md:h-32 xl:w-44 xl:h-44"
                />
                <span className="font-semibold text-gray-600 dark:text-gray-200 text-center">
                  {user?.username}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularAuthors;
