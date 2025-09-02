import { Alert, AlertDescription } from "@/components/ui/alert";
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
// import { getData } from '@/context/userContext'
import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e)=>{
        e.preventDefault()
        try {
            setIsLoading(true)
            const res = await axios.post(`http://localhost:8015/user/forgot-password`, {
                email
            });
            if(res.data.success){
             navigate(`/verify-otp/${email}`)
             toast.success(res.data.message)
             setEmail("")
            }
        } catch (error) {
            console.log(error);
        } finally{
            setIsLoading(false)
        }
    }
  return (
    <div className="relative w-full h-[760px] bg-violet-50 dark:bg-gray-400 overflow-hidden">
      <div className="min-h-screen flex flex-col">
        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-violet-800 dark:text-gray-800">
                Resetta la tua password
              </h1>
              {/* <span className="text-muted-foreground">
                Immetti la tua email per resettare la tua password
              </span> */}
            </div>
            <Card className="bg-white  dark:bg-gray-300">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-violet-800 dark:text-gray-800">
                  Password Dimenticata!
                </CardTitle>
                <CardDescription className="text-center dark:text-gray-800">
                  {isSubmitted
                    ? "Controlla la tua email. Troverai un link per reimpostare la tua password."
                    : "Immetti la tua email e fai clic sul pulsante qui sotto. Riceverai un link per reimpostare la tua password"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {isSubmitted ? (
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-primary/10 rounded-full p-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">
                        Controlla la tua posta in arrivo
                      </h3>
                      <p className="text-muted-foreground">
                        Abbiamo inviato un link per reimpostare la password{" "}
                        <span className="font-medium text-foreground">
                          {email}
                        </span>
                      </p>
                      <p>
                        Se non vedi l'email, controlla la cartella spam o{" "}
                        <button
                          className="text-primary hover:underline font-medium"
                          onClick={() => setIsSubmitted(false)}
                        >
                          riprova
                        </button>
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2 relative ">
                      <Label><span className="dark:text-gray-800">Email</span> </Label>
                      <Input
                        type="email"
                        placeholder="Inserisci il tuo indirizzo email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className=" dark:bg-gray-700 dark:border-gray-600"
                        disabled={isLoading}
                      />
                    </div>
                    <Button className="w-full bg-violet-700 text-white relative hover:bg-violet-500 cursor-pointer">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Invio del collegamento di ripristino..
                        </>
                      ) : (
                        "Invia collegamento di reimpostazione"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex justify-center dark:text-gray-800">
                <span>
                  Ricordi la tua password?{" "}
                  <Link
                    to={"/login"}
                    className="text-violet-600 hover:underline font-medium relative"
                  >
                    Accedi
                  </Link>
                </span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
