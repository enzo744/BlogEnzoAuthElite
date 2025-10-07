import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { getData } from "@/context/userContext";
import BlogCardList from "@/components/BlogCardList";

const SearchResults = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = getData();
  const navigate = useNavigate();

  const query = searchParams.get("q");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!user || !accessToken) {
        toast.error("Utente non autenticato. Effettua il login.");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get("https://blogenzoauthelite.onrender.com/blog/search", {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            q: query || "",
            // published: "true", // puoi rimuoverlo se non serve
          },
          withCredentials: true,
        });

        if (res.data.success) {
          setBlogs(res.data.blogs);
        } else {
          toast.error("Errore nella ricerca");
          setBlogs([]);
        }
      } catch (error) {
        console.error("Errore:", error);
        toast.error("Errore durante la ricerca");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, user]);

  return (
    <div className="px-6 pt-20 pb-5">
      <h1 className="text-2xl font-bold mb-4">
        Risultati per:{" "}
        <span className="text-sky-600">&quot;{query}&quot;</span>
      </h1>

      {loading ? (
        <p>Caricamento risultati...</p>
      ) : blogs.length > 0 ? (
        <div className="grid  lg:grid-cols-3 md:grid-cols-2 gap-4">
          {blogs.map((blog) => (
            <BlogCardList key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <p>Nessun risultato trovato.</p>
      )}
    </div>
  );
};

export default SearchResults;
