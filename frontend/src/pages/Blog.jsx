import BlogCard from "@/components/BlogCard";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setBlog } from "@/redux/blogSlice";
import { toast } from "sonner";
import { getData } from "@/context/userContext";
import { Navigate } from "react-router-dom";

const Blog = () => {
  const { user } = getData();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);

  const accessToken = localStorage.getItem("accessToken");
  if (!user) {
    toast.error("Utente non autenticato.");
    return <Navigate to="/login" />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const getAllPublsihedBlogs = async () => {
      // ✅ Verifica se il token esiste
      if (!accessToken) {
        toast.error("Utente non autenticato.");
        return;
      }
      try {
        const res = await axios.get(
          `https://blogenzoauthelite.onrender.com/blog/get-published-blogs`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // ✅ Corretto: l'header va qui
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
        }
      } catch (error) {
        console.error("Errore nel recupero dei blog pubblicati:", error);
        toast.error("Impossibile caricare i blog. Riprova più tardi.");
      }
    };
    getAllPublsihedBlogs();
  }, [accessToken, dispatch]); // ✅ Add dependencies to useEffect

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto text-center flex flex-col space-y-4 items-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-center pt-10">I nostri blog pubblicati</h1>
        <hr className=" w-24 text-center border-2 border-red-500 rounded-full" />
      </div>
      <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 lg:grid-cols-3 py-10 px-4 lg:px-0">
        {blog?.map((blog) => {
          return <BlogCard blog={blog} key={blog._id} />;
        })}
      </div>
    </div>
  );
};

export default Blog;
