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
import { getData } from "@/context/userContext";

const Login = () => {
    const {setUser} = getData()
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    password: "",
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
    // console.log(formData);
    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:8015/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        navigate("/");
        setUser(res.data.user)
        localStorage.setItem('accessToken', res.data.accessToken)
        toast.success(res.data.message);
      } 
    } catch (error) {
      // 1. Controlliamo se l'errore proviene dalla risposta del server e ha un messaggio
      if (error.response && error.response.data && error.response.data.message) {
        // 2. Usiamo il messaggio specifico del backend per il toast di errore
        toast.error(error.response.data.message);
      } else {
        // 3. Altrimenti, mostriamo un messaggio generico
        toast.error("Si è verificato un errore imprevisto. Riprova.");
      }
      // console.log("Errore durante il login:", error); // Manteniamo il log per il debug
      // --- FINE MODIFICA ---
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative w-full h-screen md:h-[900px] bg-sky-50 dark:bg-gray-800  overflow-hidden">
      <div className="min-h-screen flex flex-col to-muted/20 ">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-sky-800 dark:text-gray-400">
                Accedi al tuo account
              </h1>
              <span className="text-gray-400">
                Inizia a organizzare i tuoi pensieri e le tue idee oggi stesso
              </span>
            </div>
            <Card className="w-full max-w-md bg-sky-100 dark:bg-gray-700 dark:border-gray-600">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-sky-800 dark:text-gray-300">
                  Login
                </CardTitle>
                <CardDescription className="text-center">
                  Inserisci la tue credenziali qui sotto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="La tua email"
                      required
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        className="text-xs underline text-sky-700 hover:text-sky-400 dark:text-blue-400 dark:hover:text-blue-300"
                        to={"/forgot-password"}
                      >
                        Dimenticato la password?
                      </Link>
                    </div>
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
                          <EyeOff className="h-4 w-4 text-sky-600 dark:text-gray-200" />
                        ) : (
                          <Eye className="h-4 w-4 text-sky-600 dark:text-gray-200" />
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
                      <span>Attendi per accedere...</span>
                    </>
                  ) : (
                    "Accedi"
                  )}
                </Button>
                <div className="text-center text-sm mt-4">
                  Non hai un account?{" "}
                  <Link to="/signup" className="text-sky-700 underline font-semibold hover:text-sky-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Registrati
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

export default Login;
