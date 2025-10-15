import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setBlog } from "@/redux/blogSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Modal from "@/components/Modal";
import EncryptDecrypt from "@/components/EncryptDecrypt";
import { getData } from "@/context/userContext";
import { Trash2, Printer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { lazy, Suspense } from "react";
// const JoditEditor = lazy(() => import("jodit-react"));

const UpdateBlog = () => {
  getData();
  const [blogToDelete, setBlogToDelete] = useState({ id: null, title: "" });
  const accessToken = localStorage.getItem("accessToken");

  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const [openEncryptDecryptModal, setOpenEncryptDecryptModal] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFetchingBlog, setIsFetchingBlog] = useState(true); // Stato per il caricamento del blog

  const params = useParams();
  const id = params.blogId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);

  // const [content, setContent] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    campoLibero: "",
    campoLibero2: "",
  });

  // Funzione per recuperare il blog specifico
  const fetchBlog = useCallback(async () => {
    try {
      setIsFetchingBlog(true);
      const res = await axios.get(`https://blogenzoauthelite.onrender.com/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        const fetchedBlog = res.data.blog;
        setBlogData({
          title: fetchedBlog.title || "",
          subtitle: fetchedBlog.subtitle || "",
          description: fetchedBlog.description || "",
          category: fetchedBlog.category || "",
          campoLibero: fetchedBlog.campoLibero || "",
          campoLibero2: fetchedBlog.campoLibero2 || "",
        });
        // setContent(fetchedBlog.description || "");
        setPreviewThumbnail(fetchedBlog.thumbnail || "");
        setPublish(fetchedBlog.isPublished || false);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Errore nel caricamento del blog"
      );
    } finally {
      setIsFetchingBlog(false);
    }
  }, [id, accessToken]); // ✅ Dipendenze corrette: tutto ciò che viene usato dentro fetchBlog

  // useEffect che chiama fetchBlog
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id, fetchBlog]); // ✅ Nessun warning

  const isIOS = () => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  // const editor = useRef(null);
  const campoLibero2Ref = useRef(null);
  const [isIosDevice, setIsIosDevice] = useState(false);

  // Rileva iOS all'avvio
  useEffect(() => {
    setIsIosDevice(isIOS());
  }, []);

  // Autoresize per iOS
  useEffect(() => {
    const autoresize = (ref) => {
      if (ref && ref.current && ref.current instanceof HTMLElement) {
        ref.current.style.height = "auto";
        ref.current.style.height = ref.current.scrollHeight + "px";
      }
    };

    if (isIosDevice) {
      autoresize(campoLibero2Ref);
    }
  }, [isIosDevice, blogData.campoLibero2]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData({ ...blogData, category: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const openDeleteDialog = () => {
    setBlogToDelete({ id: id, title: blogData.title });
    setIsDeleteDialogOpen(true);
  };

  const updateBlogHandler = async () => {
    const formData = new FormData();
    if (!blogData.title || blogData.title.trim() === "") {
      toast.error("Il titolo è obbligatorio.");
      return;
    }
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", blogData.description);
    formData.append("category", blogData.category);
    formData.append("campoLibero", blogData.campoLibero);
    formData.append("campoLibero2", blogData.campoLibero2);

    if (blogData.thumbnail) {
      formData.append("file", blogData.thumbnail);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `https://blogenzoauthelite.onrender.com/blog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setBlog(blog.map((b) => (b._id === id ? res.data.blog : b))));
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const togglePublishUnpublish = async () => {
    const newPublishState = !publish;
    try {
      const res = await axios.patch(
        `https://blogenzoauthelite.onrender.com/blog/${id}/publish?publish=${newPublishState}`,
        null,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`, // ✅ Corretto: l'header va qui
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(
          setBlog(
            blog.map((b) =>
              b._id === id ? { ...b, isPublished: newPublishState } : b
            )
          )
        );
        toast.success(res.data.message);
        navigate(`/dashboard/your-blog`);
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.error(error);
      toast.error("something went wrong");
    }
  };

  const handleConfirmDelete = async () => {
    //  Usa l'ID salvato nello stato 'blogToDelete'
    if (!blogToDelete.id) return;

    if (!accessToken) {
      console.error("Token di accesso non trovato.");
      toast.error("Utente non autenticato. Effettua il login.");
      return;
    }

    try {
      const res = await axios.delete(
        `https://blogenzoauthelite.onrender.com/blog/delete/${blogToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("something went error");
    } finally {
      setBlogToDelete({ id: null, title: "" });
      setIsDeleteDialogOpen(false);
    }
  };

  //  NUOVA FUNZIONE per eliminare la thumbnail
  const handleRemoveThumbnail = async () => {
    if (!id) {
      toast.error("ID del blog non trovato.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.delete(
        `https://blogenzoauthelite.onrender.com/blog/${id}/remove-thumbnail`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // Pulisci l'anteprima e lo stato del file
        setPreviewThumbnail("");
        setBlogData((prev) => ({ ...prev, thumbnail: null }));
      }
    } catch (error) {
      console.error("Errore durante la rimozione della thumbnail:", error);
      toast.error(
        error.response?.data?.message || "Impossibile rimuovere la thumbnail."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mostra un messaggio di caricamento
  if (isFetchingBlog) {
    return (
      <div className="flex items-center justify-center h-screen md:ml-[320px]">
        <p>Caricamento blog...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="printable-page pb-5 bg-gray-200  pt-20 lg:ml-[285px] flex-wrap">
      <div className="max-w-6xl mx-auto mt-6 px-3">
        <Card className="w-full bg-white dark:bg-gray-800 p-5">
          <h1 className="text-4xl font-bold">Informazioni sul blog</h1>
          <span className="text-sm no-print">
            Apporta modifiche ai tuoi blog qui. Clicca su Pubblica quando hai
            finito e se vuoi renderlo visibile a tutti gli utenti loggati.
          </span>
          <div className="flex flex-col sm:flex-row justify-center gap-5 my-4 no-print">
          
            <Button onClick={() => togglePublishUnpublish()} className="w-full sm:w-[180px]">
              {publish ? "UnPublish" : "Publish"}
            </Button>
            <Button onClick={handlePrint} className="w-full sm:w-[180px]">
              <Printer className="mr-2 h-4 w-4" />
              Print or Download
            </Button>
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" onClick={openDeleteDialog} className="w-full sm:w-[180px]">
                  Remove Blog
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione non può essere annullata. Verrà eliminato in
                    modo permanente questo blog e rimosso dai nostri server.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmDelete}>
                    Continua
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 overflow-hidden">
            <div className="flex-1 min-w-0">
              <Label className="mb-2">Title</Label>
              <Input
                type="text"
                placeholder="Enter a title"
                name="title"
                value={blogData.title}
                onChange={handleChange}
                className={`w-full text-base ${
                  blogData.title === ""
                    ? "border-red-500 focus:ring-red-500"
                    : "dark:border-gray-300"
                }`}
              />
              {blogData.title === "" && (
                <p className="text-sm text-red-500 mt-1">
                  Il titolo è obbligatorio.
                </p>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Label className="mb-2">Subtitle</Label>
              <Input
                type="text"
                placeholder="Enter a subtitle"
                name="subtitle"
                value={blogData.subtitle}
                onChange={handleChange}
                className="w-full dark:border-gray-300 text-base"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <Label className="block mb-2">Campo Libero</Label>
              <Input
                type="text"
                placeholder="Campo libero"
                name="campoLibero"
                value={blogData.campoLibero}
                onChange={handleChange}
                className="w-full dark:border-gray-300 text-base"
              />
            </div>
            <div className="flex-1">
              <Label className="block mb-2">Campo Libero2</Label>
              <Textarea
                ref={campoLibero2Ref}
                placeholder="Campo libero2"
                name="campoLibero2"
                value={blogData.campoLibero2}
                onChange={handleChange}
                className={`custom-textarea w-full text-base overflow-hidden ${
                  isIosDevice ? "resize-none" : "resize-y"
                }`}
              />
            </div>
          </div>
          <div>
            <Label className="mb-2">Description</Label>
            <Textarea
              name="description"
              placeholder="Scrivi qui la descrizione del blog"
              value={blogData.description}
              onChange={handleChange}
              className={`custom-textarea w-full text-base overflow-hidden ${
                isIosDevice ? "resize-none" : "resize-y"
              }`}
            />
          </div>
          <div>
            <Label className="mb-2">Category</Label>
            <Select onValueChange={selectCategory} value={blogData.category}>
              <SelectTrigger className="w-[180px] dark:border-gray-300">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="Personale">Personale</SelectItem>
                  <SelectItem value="Ufficio">Ufficio</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="mb-2">Thumbnail</Label>
            <div className="flex items-center gap-3">
              <Input
                id="file"
                type="file"
                onChange={selectThumbnail}
                accept="image/*"
                className="w-fit dark:border-gray-300 text-base"
              />

              {/* Icona con tooltip */}
              {previewThumbnail && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Trash2
                        onClick={handleRemoveThumbnail}
                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                        disabled={loading}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rimuovi Foto</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Mostra l'anteprima */}
            {previewThumbnail && (
              <div className="mt-1 flex justify-center sm:justify-start">
                <img
                  src={previewThumbnail}
                  className="w-64 my-2 rounded text-base"
                  alt="Anteprima Thumbnail"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 items-center justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button> 
            <Button
              className="text-purple-600 hover:text-slate-700 hover:bg-linear-to-r hover:from-purple-500 hover:to-indigo-500 border border-purple-500 hover:border-purple-700 bg-orange-200 dark:bg-orange-300"
              onClick={() => setOpenEncryptDecryptModal(true)}
            >
              Cripta/Decripta
            </Button>
            <Button
              onClick={updateBlogHandler}
              disabled={blogData.title === ""}
            >
              {loading ? "Please Wait" : "Save"}
            </Button>
          </div>
        </Card>
      </div>
      <Modal
        isOpen={openEncryptDecryptModal}
        onClose={() => setOpenEncryptDecryptModal(false)}
        title="Strumento Cripta / Decripta"
        className="max-w-5xl mx-auto"
      >
        <EncryptDecrypt />
      </Modal>
    </div>
  );
};

export default UpdateBlog;
