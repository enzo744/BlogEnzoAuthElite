import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import EncryptDecrypt from "@/components/EncryptDecrypt";
import { FilePenLine, LockKeyhole } from "lucide-react";

const VistaTabellare = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const fetchAllBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`https://blogenzoauthelite.onrender.com/blog/get-all-blogs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Errore nel caricamento dei dati"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  // Filtro i blog che hanno almeno un campo libero non vuoto
  const filteredBlogs = blogs.filter(
    (blog) => blog.campoLibero || blog.campoLibero2
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen md:ml-[320px]">
        <p>Caricamento dati...</p>
      </div>
    );
  }

  return (
    <div className="pb-10 pt-20 md:ml-[320px] min-h-screen dark:bg-gray-800">
      <div className="max-w-7xl mx-auto mt-8 px-4">
        {/* 1. MESSAGGIO MOBILE */}
        <div className="block md:hidden text-center py-20">
          <p className="text-red-600 text-lg font-semibold">
            Pagina visibile solo su PC o Tablet
          </p>
        </div>

        {/* 2. CONTENUTO PRINCIPALE SOLO SU TABLET E DESKTOP */}
        <div className="hidden md:block">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Vista Tabellare</h1>
            <Button onClick={() => setIsModalOpen(true)}>
              <LockKeyhole className="mr-2 h-4 w-4" />
              Cripta/Decripta
            </Button>
          </div>

          <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
            <Table className="table-fixed w-full">
              <TableCaption>
                {filteredBlogs.length > 0
                  ? "Panoramica dei tuoi blog con campi liberi compilati."
                  : "Nessun blog trovato con i campi liberi compilati."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Titolo</TableHead>
                  <TableHead className="w-[25%]">Campo Libero</TableHead>
                  <TableHead className="w-[49%]">Campo Libero 2</TableHead>
                  <TableHead className="w-[6%] text-center">Modifica</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="w-[20%] truncate md:whitespace-normal md:break-words">
                      {blog.title}
                    </TableCell>
                    <TableCell className="w-[25%] truncate md:whitespace-normal md:break-words">
                      {blog.campoLibero}
                    </TableCell>
                    <TableCell className="w-[49%] truncate md:whitespace-normal md:break-words">
                      {blog.campoLibero2}
                    </TableCell>
                    <TableCell className="w-[6%] text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/dashboard/write-blog/${blog._id}`)
                        }
                      >
                        <FilePenLine className="h-5 w-5 text-blue-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Strumento Cripta / Decripta"
      >
        <EncryptDecrypt />
      </Modal>
    </div>
  );
};

export default VistaTabellare;
