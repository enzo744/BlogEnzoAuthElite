// // src/pages/SearchList.jsx
// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import BlogCard from "../components/BlogCard";
// import { toast } from "sonner";
// import { getData } from "@/context/userContext";

// const SearchList = () => {
//   const location = useLocation();
//   const { user } = getData();
//   const accessToken = localStorage.getItem("accessToken");

//   const params = new URLSearchParams(location.search);
//   const query = params.get("q");
//   const published = params.get("published"); // true / false / null

//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!query) return;
//       if (!user || !accessToken) {
//         toast.error("Utente non autenticato.");
//         return;
//       }

//       setLoading(true);
//       try {
//         const res = await axios.get(
//           `https://blogenzoauthelite.onrender.com/blog/search?q=${query}&published=${published || ""}`,
//           {
//             headers: { Authorization: `Bearer ${accessToken}` },
//             withCredentials: true,
//           }
//         );
//         if (res.data.success) {
//           setResults(res.data.blogs);
//         } else {
//           toast.error(res.data.message);
//         }
//       } catch (err) {
//         console.error("Errore nella ricerca:", err);
//         toast.error("Errore nella ricerca.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [query, published]);

//   return (
//     <div className="pt-32 px-6">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-xl font-semibold mb-4">
//           Risultati per: <span className="text-blue-600">{query}</span>
//         </h2>

//         {loading ? (
//           <p>Caricamento...</p>
//         ) : results.length === 0 ? (
//           <p>Nessun risultato trovato.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {results.map((blog) => (
//               <BlogCard key={blog._id} blog={blog} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchList;

import BlogCard from "../components/BlogCard";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SearchList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");
  const { blog } = useSelector((store) => store.blog);

  const filteredBlogs = blog?.filter((blog) => {
  const title = blog?.title?.toLowerCase() || "";
  const subtitle = blog?.subtitle?.toLowerCase() || "";
  const category = blog?.category?.toLowerCase() || "";

  return (
    title.includes(query?.toLowerCase()) ||
    subtitle.includes(query?.toLowerCase()) ||
    category.includes(query?.toLowerCase())
  );
});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="pt-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-5">Search Results for: {query}</h2>
        <div className="grid grid-cols-3 gap-7 my-10">
          {filteredBlogs.map((blog, index) => {
            return <BlogCard key={index} blog={blog} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchList;
