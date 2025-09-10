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
      const res = await axios.get(`https://blogenzoauthelite.onrender.com/blog/get-own-blogs`, {
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
    <div className="pt-20 md:ml-[320px] h-screen flex flex-col dark:bg-gray-700">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col flex-grow overflow-hidden">
        <div className="block md:hidden text-center py-20">
          <p className="text-red-600 text-lg font-semibold">
            Pagina visibile solo su PC o Tablet
          </p>
        </div>

        {/* 2. CONTENUTO PRINCIPALE SOLO SU TABLET E DESKTOP */}
        <div className="hidden md:flex md:flex-col md:flex-grow overflow-hidden">
          <div className="flex-shrink-0 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">
                Vista Tabellare
              </h1>
              <Button onClick={() => setIsModalOpen(true)}>
                <LockKeyhole className="mr-2 h-4 w-4" />
                Cripta/Decripta
              </Button>
            </div>
          </div>

          {/* 👇 MODIFICA PRINCIPALE:
              - Rimosso il componente <Card>.
              - Le classi della Card (p-5, rounded-md, border, etc.) sono state applicate a questo div.
              - Questo div è ora sia il contenitore di stile CHE il contenitore scorrevole.
          */}
          <TableCaption className="mb-4 text-xl text-gray-800 dark:text-gray-200">
            {filteredBlogs.length > 0
              ? `Panoramica dei tuoi blog con campi liberi compilati: ${
                  filteredBlogs.length
                } blog${filteredBlogs.length > 1 ? "s" : ""}`
              : "Nessun blog trovato con i campi liberi compilati."}
          </TableCaption>

          <div className="overflow-y-auto flex-grow p-5 rounded-lg border bg-card text-card-foreground shadow-sm dark:bg-gray-800">
            <Table className="table-fixed w-full">
              {/* Ora l'intestazione è un figlio diretto del contenitore scorrevole e 'sticky' funzionerà */}
              <TableHeader className="sticky top-0 bg-card z-10  rounded">
                <TableRow>
                  <TableHead className="w-[20%] font-bold">Titolo</TableHead>
                  <TableHead className="w-[28%] font-bold">
                    Campo Libero
                  </TableHead>
                  <TableHead className="w-[46%] font-bold">
                    Campo Libero 2
                  </TableHead>
                  <TableHead className="w-[6%] text-center font-bold">
                    Modifica
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Il contenuto della tabella rimane identico */}
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="truncate md:whitespace-normal md:break-words">
                      {blog.title}
                    </TableCell>
                    <TableCell className="truncate md:whitespace-normal md:break-words">
                      {blog.campoLibero}
                    </TableCell>
                    <TableCell className="truncate md:whitespace-normal md:break-words">
                      {blog.campoLibero2}
                    </TableCell>
                    <TableCell className="text-center">
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
          </div>
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
