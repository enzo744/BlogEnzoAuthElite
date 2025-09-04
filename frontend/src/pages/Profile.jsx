import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import userLogo from "../assets/user.jpg";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getData } from "@/context/userContext";

const Profile = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate(); // Inizializza useNavigate
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false); // Nuovo stato per il processo di eliminazione

  const { user, setUser, loading: authLoading } = getData();

  const [input, setInput] = useState({
    username: "",
    bio: "",
    file: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        username: user.username || "",
        bio: user.bio || "",
        file: user.photoUrl || null,
      });
    }
  }, [user]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("bio", input.bio);
    if (input?.file) {
      formData.append("file", input?.file);
    }

    const accessToken = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      const res = await axios.put(
        `https://blogenzoauthelite.onrender.com/user/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          
        }
      );
      if (res.data.success) {
        setOpen(false);
        toast.success(res.data.message);
        setUser(res.data.user);
        // dispatch(getData());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Funzione per gestire l'eliminazione dell'account
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile."
      )
    ) {
      try {
        setDeleting(true);
        const res = await axios.delete(
          `https://blogenzoauthelite.onrender.com/user/profile/delete`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          toast.success(res.data.message);
          // dispatch(getData()); // Svuota lo stato dell'utente in Redux
          getData(setUser(null));
          navigate("/login"); // Reindirizza l'utente alla pagina di login
        }
      } catch (error) {
        console.error("Errore durante l'eliminazione dell'account:", error);
        toast.error(
          error.response?.data?.message ||
            "Errore durante l'eliminazione dell'account."
        );
      } finally {
        setDeleting(false);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Utente non trovato. Riprova il login.</p>
      </div>
    );
  }

  return (
    <div className="pt-18 my-2 md:ml-[300px] md:h-screen dark:bg-gray-800">
      <div className="max-w-6xl mx-auto mt-1 ">
        <Card className="flex flex-col items-center gap-4 p-6 md:p-3 dark:bg-gray-800 mx-4 md:mx-0">
          {/* image section */}
          <div className="flex flex-col items-center justify-center ">
            <Avatar className="w-35 h-35 border-4">
              <AvatarImage src={user?.photoUrl || userLogo} />
            </Avatar>
          </div>

          {/* info section */}
          <div>
            <h1 className="font-bold text-center md:text-4xl text-2xl mb-7">
              Welcome {user?.username}!
            </h1>
            <p className="">
              <span className="font-semibold">Email : </span>
              {user?.email}
            </p>
            <div className="flex flex-col gap-0 items-center justify-center my-5 md:flex-row md:items-center md:text-center md:gap-4">
              <Label className="text-sm">Description</Label>
              <p className="border dark:border-gray-600 p-2  rounded-md">
                {user?.bio ||
                  "Sono uno sviluppatore web e creatore di contenuti, specializzato in tecnologie frontend. Quando non scrivo codice, mi trovate a scrivere di tecnologia."}
              </p>
            </div>

            {/* Finestra di dialogo per modifica profilo */}
            <div className="flex flex-col gap-4 mt-6 items-center justify-center md:flex-row">
              <Dialog open={open} onOpenChange={setOpen}>
                <Button onClick={() => setOpen(true)}>Modifica Profilo</Button>
                <DialogContent className="md:w-[425px] ">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Modifica Profilo
                    </DialogTitle>
                    <DialogDescription className="text-center text-teal-600">
                      Apporta modifiche al tuo profilo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2 py-4">
                    {/* <div className="gap-2"> */}
                    <div className="">
                      <Label htmlFor="username" className="text-right mb-2">
                        Username o nome completo
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        placeholder="Username o nome completo"
                        type="text"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    {/* </div> */}
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-right mb-2">
                      Description
                    </Label>
                    <Textarea
                      id="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      name="bio"
                      placeholder="Enter a description"
                      className="col-span-3 text-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-right mb-2">
                      Picture
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={changeFileHandler}
                      className="w-[277px]"
                    />
                  </div>

                  <DialogFooter>
                    {loading ? (
                      <Button>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
                        wait
                      </Button>
                    ) : (
                      <Button onClick={submitHandler}>Salva Modifiche</Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Nuovo pulsante per la modifica della password */}
              <Link to={`/change-password/${user.email}`}>
                <Button
                  className="max-w-fit text-[12px] font-medium text-purple-700 hover:text-blue-500 hover:bg-orange-400 border-b-2 hover:border-purple-400
                  bg-orange-200 dark:border-white"
                >
                  Modifica Password
                </Button>
              </Link>
              {/* Nuovo pulsante per eliminare l'account */}
              <Button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="max-w-fit text-[12px] font-medium text-red-700 hover:text-white hover:bg-red-600 border-b-2 hover:border-red-400
                bg-red-200 dark:border-white"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Elimina Account"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
