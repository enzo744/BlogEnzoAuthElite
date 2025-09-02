import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState({
    username: "",
    email: "",
    password: "",
    frontendOrigin: window.location.origin,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^.{2,20}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // ✋ Validazione username
    if (!usernameRegex.test(formData.username)) {
      toast.error("Lo username deve contenere da 2 a 20 caratteri.");
      return;
    }

    // ✋ Validazione email
    if (!emailRegex.test(formData.email)) {
      toast.error("Il formato dell'email non è valido.");
      return;
    }

    // ✋ Validazione password
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un simbolo."
      );
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:8015/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        navigate("/verify");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Registrazione utente fallita");
      }
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      if (message) {
        toast.error(message);
      } else {
        toast.error("Registrazione fallita. Riprova.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative w-full h-screen md:h-[900px] bg-sky-50 dark:bg-gray-800 overflow-hidden">
      <div className="min-h-screen flex flex-col to-muted/20 ">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-sky-800 dark:text-gray-400">
                Crea il tuo account
              </h1>
              <span className="text-sky-800 dark:text-gray-400">
                Inizia a organizzare i tuoi pensieri e le tue idee oggi stesso
              </span>
            </div>
            <Card className="w-full max-w-md bg-sky-100 dark:bg-gray-700 dark:border-gray-400">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-sky-800 dark:text-gray-300">
                  Registra il tuo account
                </CardTitle>
                <CardDescription className="text-center">
                  Inserisci la tue credenziali qui sotto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Nome completo</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      type="text"
                      placeholder="Nome, cognome o username"
                      required
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="prova@example.com"
                      required
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="La tua password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-transparent cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-sky-600  dark:text-gray-200" />
                        ) : (
                          <Eye className="h-4 w-4 text-sky-600  dark:text-gray-200" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  className="w-full bg-sky-700 hover:bg-sky-500 dark:text-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Sto creando l'account...</span>
                    </>
                  ) : (
                    " Registrati"
                  )}
                </Button>
                <div className="text-center text-sm mt-4">
                  Hai già un account?{" "}
                  <Link
                    to="/login"
                    className="text-sky-700 underline font-semibold hover:text-sky-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    Accedi
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
