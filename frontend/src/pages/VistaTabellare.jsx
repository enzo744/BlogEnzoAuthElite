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
// Rimuoviamo l'import di Card perché applicheremo i suoi stili direttamente
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import EncryptDecrypt from "@/components/EncryptDecrypt";
import { FilePenLine, LockKeyhole, Printer, Search } from "lucide-react";

const VistaTabellare = () => {
  const [showContentOnMobile, setShowContentOnMobile] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const fetchAllBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://blogenzoauthelite.onrender.com/blog/get-own-blogs`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

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

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = blogs.filter((blog) => {
      const hasContent = blog.campoLibero || blog.campoLibero2;

      // Ricerca solo nel titolo e campoLibero
      const matchesSearch =
        blog.title?.toLowerCase().includes(lowerSearch) ||
        blog.campoLibero?.toLowerCase().includes(lowerSearch);

      return hasContent && (!searchTerm || matchesSearch);
    });

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm]);

  const handlePrint = async () => {
    if (window.innerWidth < 768) {
      // Se siamo su mobile, mostra temporaneamente il contenuto
      setShowContentOnMobile(true);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Aspetta che il DOM si aggiorni
    }

    window.print();

    // Dopo la stampa, nascondi di nuovo se eravamo su mobile
    if (window.innerWidth < 768) {
      setTimeout(() => setShowContentOnMobile(false), 1000);
    }
  };

  if (isLoading) {
  return (
    <div className="flex items-center justify-center h-screen md:ml-[320px]">
      <p>Caricamento dati...</p>
    </div>
  );
}

  return (
    <div className="printable-page pt-20 lg:ml-[300px] bg-white flex flex-col dark:bg-gray-700 ">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col flex-grow overflow-hidden">
        
        {/* ✅ Blocco MOBILE SEMPRE visibile con pulsante stampa */}
        <div className="block md:hidden text-center py-20">
          <p className="text-red-600 text-lg font-semibold">
            - Contenuti della pagina visibili solo su PC o Tablet -
            <br /> Tuttavia puoi stampare o scaricare questa pagina.
          </p>
          {/* Bottone Print/Download visibile su mobile */}
          <div className="flex mt-6  justify-center">
            <Button onClick={handlePrint} className="">
              <Printer className="mr-2 h-4 w-4" />
              Print or Download
            </Button>
          </div>
        </div>

        {/* Contenuto principale solo su tablet/desktop */}
        <div
          className={`${showContentOnMobile ? 'block' : 'hidden'} md:flex md:flex-col md:flex-grow overflow-hidden`}
        >
          <div className="flex-shrink-0 py-6">
            <div className="flex flex-col xl:flex-row lg:items-center lg:justify-between gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold">
                Vista Tabellare
              </h1>
              <h2>
                {filteredBlogs.length > 0
                  ? `Voci trovate : ${filteredBlogs.length} blog${
                      filteredBlogs.length > 1 ? "s" : ""
                    }`
                  : "Nessun blog trovato con i campi liberi compilati."}
              </h2>

              <div className="flex gap-4 items-center">
                {/* Campo ricerca con lente */}
                <div className="relative no-print">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Cerca tra i tuoi blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-500"
                  />
                </div>

                {/* Bottone Cripta/Decripta */}
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="no-print"
                >
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  Cripta/Decripta
                </Button>
                {/* Bottone Print */}
                <Button onClick={handlePrint} className="no-print">
                  <Printer className="mr-2 h-4 w-4" />
                  Print or Download
                </Button>
              </div>
            </div>
          </div>

          {/* Tabella dei blog */}
          <div className="overflow-y-auto flex-grow p-5 rounded-lg border bg-gray-100 text-card-foreground shadow-sm dark:bg-gray-800 printable-page">
            <Table className="table-fixed w-full">
              <TableCaption className="mb-4 text-xl text-gray-800 dark:text-gray-200">
                {filteredBlogs.length > 0
                  ? `Panoramica dei tuoi blog con campi liberi compilati: ${
                      filteredBlogs.length
                    } blog${filteredBlogs.length > 1 ? "s" : ""}`
                  : "Nessun blog trovato con i campi liberi compilati."}
              </TableCaption>
              <TableHeader className="sticky top-0 bg-gray-100 z-10 border border-gray-200 dark:border-gray-400">
                <TableRow>
                  <TableHead className="w-[20%] font-bold">Titolo</TableHead>
                  <TableHead className="w-[28%] font-bold">
                    Campo Libero
                  </TableHead>
                  <TableHead className="w-[46%] font-bold">
                    Campo Libero 2
                  </TableHead>
                  <TableHead className="w-[6%] font-bold text-center border border-gray-200 dark:border-gray-400">
                    <Button variant="ghost" size="icon">
                      <FilePenLine className="text-gray-600 dark:text-gray-300" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="truncate md:whitespace-normal md:break-words border border-gray-200 dark:border-gray-400">
                      {blog.title}
                    </TableCell>
                    <TableCell className="truncate md:whitespace-normal md:break-words border border-gray-200 dark:border-gray-400">
                      {blog.campoLibero}
                    </TableCell>
                    <TableCell className="truncate md:whitespace-normal md:break-words border border-gray-200 dark:border-gray-400">
                      {blog.campoLibero2}
                    </TableCell>
                    <TableCell className="text-center border border-gray-200 dark:border-gray-400">
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

      {/* Modale Cripta/Decripta */}
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
