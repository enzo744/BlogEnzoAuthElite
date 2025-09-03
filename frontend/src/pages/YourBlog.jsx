import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setBlog } from "@/redux/blogSlice";
import { getData } from "@/context/userContext";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, Trash2 } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  LuChevronFirst,
  LuChevronLast,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import SearchBar from "../components/SearchBar";

const ITEMS_PER_PAGE = 5;

const YourBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog } = useSelector((store) => store.blog);
  const { user } = getData();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState({ id: null, title: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  if (!user || !accessToken) {
    toast.error("Utente non autenticato. Effettua il login.");
    return <Navigate to="/login" />;
  }

  const totalPages = Math.ceil(totalAccounts / ITEMS_PER_PAGE);

  const handleSearch = async (searchQuery, publishedFilter) => {
    setLoading(true);
    setIsSearching(true);

    try {
      let url = `https://blogenzoauthelite.onrender.com/blog/search?q=${encodeURIComponent(
        searchQuery || ""
      )}`;
      if (publishedFilter === "true" || publishedFilter === "false") {
        url += `&published=${publishedFilter}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setBlog(res.data.blogs));
        setTotalAccounts(res.data.blogs.length);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Errore nella ricerca:", error);
      toast.error("Errore durante la ricerca.");
      dispatch(setBlog([]));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSearching(false);
    setResetSignal((prev) => !prev);
    setCurrentPage(1);
    getOwnBlog();
  };

  const getOwnBlog = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://blogenzoauthelite.onrender.com/blog/get-own-blogs?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setBlog(res.data.blogs));
        setTotalAccounts(res.data.total);
      }
    } catch (error) {
      console.error("Errore nel recupero dei blog:", error);
      dispatch(setBlog([]));
      toast.error("Errore nel recupero dei blog");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getOwnBlog();
  }, [currentPage]);

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(
        `https://blogenzoauthelite.onrender.com/blog/delete/${blogToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedBlogData = blog.filter(
          (item) => item._id !== blogToDelete.id
        );
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Errore durante l'eliminazione.");
    } finally {
      setBlogToDelete({ id: null, title: "" });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteClick = (id, title) => {
    setBlogToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT");
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else if (currentPage <= 2) {
      pageNumbers.push(1, 2, 3, "...");
    } else if (currentPage >= totalPages - 1) {
      pageNumbers.push("...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "..."
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pb-10 pt-20 md:ml-[320px] h-screen dark:bg-gray-800">
      <div className="max-w-6xl mx-auto mt-8">
        <SearchBar
          onSearch={handleSearch}
          onReset={handleReset}
          resetSignal={resetSignal}
        />

        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption className="text-xl">
              {blog?.length > 0
                ? `I tuoi blog recenti: Totale pagine: ${totalPages} - Totale blogs: ${totalAccounts}`
                : "Nessun blog creato."}
            </TableCaption>
            <TableHeader className="overflow-x-auto">
              <TableRow>
                <TableHead>
                  {/* Replichiamo la struttura del TableCell qui sotto: 
                    un contenitore flex con un segnaposto della stessa larghezza dell'immagine (w-20)
                    e poi il testo.
                  */}
                  <div className="flex items-center gap-4">
                    {/* Segnaposto invisibile che occupa lo stesso spazio dell'immagine */}
                    <div className="w-20 hidden md:block" />
                    <span>Titolo</span>
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Categoria
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Data creazione
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Data modifica
                </TableHead>
                <TableHead className="text-center">Azione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-x-auto">
              {blog?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="flex gap-4 items-center">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-20 h-12 object-scale-down rounded-md hidden md:block"
                      />
                    ) : (
                      <div className="w-20 h-12 hidden md:block"></div>
                    )}
                    <h1
                      className="hover:underline cursor-pointer"
                      onClick={() => navigate(`/blogs/${item._id}`)}
                    >
                      {item.title}
                    </h1>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.category}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(item.updatedAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDotsVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[180px]">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/dashboard/write-blog/${item._id}`)
                          }
                        >
                          <Edit /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleDeleteClick(item._id, item.title);
                          }}
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Paginazione */}
        {totalPages > 1 && !isSearching && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button
              onClick={() => setCurrentPage(1)}
              variant="outline"
              size="sm"
            >
              <LuChevronFirst />
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <LuChevronLeft />
            </Button>

            {getPageNumbers().map((page, idx) =>
              typeof page === "number" ? (
                <Button
                  key={idx}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                >
                  {page}
                </Button>
              ) : (
                <span key={idx} className="px-2 text-gray-500">
                  {page}
                </span>
              )
            )}

            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              <LuChevronRight />
            </Button>
            <Button
              onClick={() => setCurrentPage(totalPages)}
              variant="outline"
              size="sm"
            >
              <LuChevronLast />
            </Button>
          </div>
        )}

        {loading && (
          <p className="text-center text-gray-500 py-4">Caricamento...</p>
        )}

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
              <AlertDialogDescription>
                Il blog "{blogToDelete.title}" verrà eliminato definitivamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Annulla
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Elimina
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default YourBlog;
