/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setBlog } from "@/redux/blogSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getData } from "@/context/userContext";

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  // Nuovi stati per gli errori di validazione
  const [titleError, setTitleError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // Stato per disabilitare il bottone "Create"
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);

  const {user} = getData()
  const { blog } = useSelector((store) => store.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  // Effetto per la validazione in tempo reale e per abilitare/disabilitare il bottone "Create"
  useEffect(() => {
    // Il bottone "Create" è abilitato solo se titolo e categoria non sono vuoti
    setIsCreateButtonDisabled(title.trim() === "" || category.trim() === "");

    // Resetta l'errore del titolo se l'utente inizia a digitare dopo che un errore è stato mostrato
    if (title.trim() !== "" && titleError) {
      setTitleError("");
    }
    // Resetta l'errore della categoria se una categoria viene selezionata
    if (category.trim() !== "" && categoryError) {
      setCategoryError("");
    }
  }, [title, category, titleError, categoryError]); // Dipende da questi stati per re-evaluare

  const createBlogHandler = async () => {
    // Validazione finale prima di inviare la richiesta
    let isValid = true;
    if (title.trim() === "") {
      setTitleError("Il titolo del blog è obbligatorio.");
      isValid = false;
    }
    if (category.trim() === "") {
      setCategoryError("La categoria è obbligatoria.");
      isValid = false;
    }

    if (!isValid) {
      toast.error("Compila tutti i campi obbligatori.");
      return; // Ferma l'esecuzione se la validazione fallisce
    }
    const accessToken = localStorage.getItem("accessToken");
    // ✅ Verifica se il token esiste
    if (!accessToken) {
        toast.error("Utente non autenticato. Impossibile creare il blog.");
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `https://blogenzoauthelite.onrender.com/blog`,
        { title, category },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setBlog([...blog, res.data.blog]));
        navigate(`/dashboard/write-blog/${res.data.blog._id}`);
        toast.success(res.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Errore nella creazione del blog:", error); // Usa console.error
      toast.error(
        error.response?.data?.message || "Errore durante la creazione del blog."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 h-screen lg:ml-[280px] pt-20">
      <Card className="md:p-10 p-4 dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Creiamo un blog</h1>
        <div className="text-sm">
          <p>Inserisci il titolo e seleziona la categoria per il tuo nuovo blog (campi obbligatori).</p>
          <p>Clicca su "Crea" per salvare il tuo blog. Sarai reindirizzato in altra pagina</p>
          <p>dove potrai aggiungere altri campi e contenuti per tuo nuovo blog.</p>
        </div>
        <div className="mt-5 ">
          <div>
            <Label className="mb-2" htmlFor="blogTitle">Titolo del blog</Label>
            <Input
              type="text"
              id="blogTitle" // Aggiungi un ID per accessibilità
              placeholder="Nome del tuo blog"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`bg-white dark:bg-gray-700 ${
                titleError ? "border-red-500 focus:border-red-500" : ""
              }`}
              aria-describedby={titleError ? "titleError" : undefined} // Per accessibilità
            />
            {titleError && (
              <p id="titleError" className="text-red-500 text-sm mt-1">
                {titleError}
              </p>
            )}
          </div>
          <div className="mt-4 mb-5">
            <Label className="mb-2" htmlFor="blogCategory">Categoria</Label>
            <Select onValueChange={getSelectedCategory} value={category}>
              {" "}
              {/* Aggiungi value per controllare il Select */}
              <SelectTrigger
                className={`w-[220px] bg-white dark:bg-gray-700 ${
                  categoryError ? "border-red-500 focus:border-red-500" : ""
                }`}
                id="blogCategory" // Aggiungi un ID per accessibilità
                aria-describedby={categoryError ? "categoryError" : undefined} // Per accessibilità
              >
                <SelectValue placeholder="Seleziona una categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categoria</SelectLabel>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="Personale">Personale</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {categoryError && (
              <p id="categoryError" className="text-red-500 text-sm mt-1">
                {categoryError}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {/* <Button  variant="outline">Cancel</Button> */}
            <Button
              className=""
              disabled={loading || isCreateButtonDisabled} // Disabilita il bottone se la validazione non passa
              onClick={createBlogHandler}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Attendi...
                </>
              ) : (
                "Crea"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateBlog;
