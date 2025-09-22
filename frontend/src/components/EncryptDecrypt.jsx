import { useRef, useState, useEffect } from "react"; // Aggiunto useEffect
import CryptoJS from "crypto-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const SECRET_PASS = import.meta.env.VITE_SECRET_PASS;

// Aggiungi le props: initialEmail, initialPassword, onEncryptDecrypt
const EncryptDecrypt = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const [screen, setScreen] = useState("encrypt"); // Inizia in modalità cripta
  const [text, setText] = useState(""); // Testo nell'input
  const [encryptedData, setEncryptedData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");

  const textAreaRef = useRef(null);

  useEffect(() => {
    textAreaRef.current.focus();
  }, [screen]); // focus al cambio di screen

  // Switch between encrypt and decrypt screens
  const switchScreen = (type) => {
    setScreen(type);
    // Clear all data and error message when switching screens
    setText(""); // Resetta il testo input quando cambi modalità
    setEncryptedData("");
    setDecryptedData("");
    setErrorMessage("");
    textAreaRef.current.focus();
  };

  // Encrypt user input text
  const encryptData = () => {
    try {
      const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        SECRET_PASS
      ).toString();
      setEncryptedData(data);
      setErrorMessage("");
      setDecryptedData(""); // Clear decrypted data if present
      textAreaRef.current.focus();
    } catch (error) {
      setErrorMessage("Encryption fallita. Controlla il tuo input!");
      console.log(error);
    }
  };

  // Decrypt user input text
  const decryptData = () => {
  try {
    const cleanedText = text.trim(); // ✅ Elimina solo spazi iniziali/finali
    const bytes = CryptoJS.AES.decrypt(cleanedText, SECRET_PASS);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    setDecryptedData(data);
    setErrorMessage("");
    setEncryptedData(""); // Clear encrypted data if present
    textAreaRef.current.focus();
  } catch (error) {
    setErrorMessage("Decryption fallita. Controlla il tuo input!");
    console.log(error);
  }
};


  // Handle button click (Encrypt or Decrypt)
  const handleClick = () => {
    if (!text) {
      setErrorMessage("Inserire il testo per favore!");
      textAreaRef.current.focus();
      return;
    }

    if (screen === "encrypt") {
      encryptData();
    } else {
      decryptData();
    }
  };

  return (
    // Usiamo space-y per una spaziatura verticale consistente
    <div className="w-full space-y-6 p-8 ">
      <h1 className="text-xl md:text-2xl font-semibold text-center text-foreground dark:text-black">
        Cripta o Decripta Testo
      </h1>

      {/* Segmented Control per Cripta/Decripta costruito con i Button */}
      <div className="flex w-full rounded-md bg-muted p-2 gap-2 justify-center">
        <Button
          variant={screen === "encrypt" ? "secondary" : "ghost"}
          onClick={() => switchScreen("encrypt")}
          className="w-1/2 border-2 border-slate-500 hover:text-amber-500"
        >
          Cripta
        </Button>
        <Button
          variant={screen === "decrypt" ? "secondary" : "ghost"}
          onClick={() => switchScreen("decrypt")}
          className="w-1/2 border-2 border-slate-500 hover:text-amber-500"
        >
          Decripta
        </Button>
      </div>

      {/* Area principale del contenuto */}
      <div className="space-y-3 text-xs  dark:text-black">
        <Textarea
          ref={textAreaRef}
          value={text}
          onChange={({ target }) => setText(target.value)}
          placeholder={
            screen === "encrypt"
              ? "Inserire testo da criptare..."
              : "Inserire testo da decriptare..."
          }
          rows={6} // Diamo un'altezza adeguata
          className="dark:border-gray-300"
        />

        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}

        <Button onClick={handleClick} className="w-full">
          {screen === "encrypt" ? "Cripta Testo" : "Decripta Testo"}
        </Button>
      </div>


      {/* Sezione per mostrare il risultato */}
      {(encryptedData || decryptedData) && (
        <div className="w-full space-y-2 rounded-md border bg-slate-50 p-4 dark:bg-slate-800">
          <Label className="text-blue-600 dark:text-blue-400">
            {screen === "encrypt" ? "Dati Criptati" : "Dati Decriptati"}
          </Label>
          <p className="break-words text-sm font-mono text-muted-foreground">
            {screen === "encrypt" ? encryptedData : decryptedData}
          </p>
        </div>
      )}
    </div>
  );
};

export default EncryptDecrypt;
