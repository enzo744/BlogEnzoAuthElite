import { useRef, useState, useEffect } from "react"; // Aggiunto useEffect
import CryptoJS from "crypto-js";

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
      const bytes = CryptoJS.AES.decrypt(text, SECRET_PASS);
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
    <div className="p-1 max-w-3xl mx-auto"> {/* Rimosso min-h-screen dalla modale */}
      <form className="flex flex-col gap-4 items-center">
        <div className="self-center">
          <h1 className="text-center text-2xl my-2 font-semibold italic text-slate-600">
            Encrypt or Decrypt Testo
          </h1>
          <div className="flex justify-center">
            {/* Buttons to switch between Encrypt and Decrypt screens */}
            <span
              className={`btn btn-left ${
                screen === "encrypt" ? "active" : ""
              } cursor-pointer`}
              onClick={() => {
                switchScreen("encrypt");
              }}
            >
              Cripta
            </span>
            <span
              className={`btn btn-right ${
                screen === "decrypt" ? "active" : ""
              } cursor-pointer`}
              onClick={() => {
                switchScreen("decrypt");
              }}
            >
              Decripta
            </span>
          </div>

          <div className="card">
            {/* Textarea for user input  */}
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={({ target }) => setText(target.value)}
              placeholder={
                screen === "encrypt"
                  ? "Inserire testo da criptare... "
                  : "Inserire testo da DEcriptare..."
              }
              className="border rounded w-full p-2"
            />

            {/* Display error message if there is an error */}
            {errorMessage && <div className="error">{errorMessage}</div>}

            {/* Encrypt or Decrypt button */}
            <span
              className={`btn submit-btn ${
                screen === "encrypt" ? "encrypt-btn" : "decrypt-btn"
              } cursor-pointer`}
              onClick={handleClick}
            >
              {screen === "encrypt" ? "Encrypt" : "Decript"}
            </span>
          </div>

          {/* Display Encrypted or Decrypted data if available */}
          {encryptedData || decryptedData ? (
            <div className="content">
              <label className="text-blue-600">
                {screen === "encrypt" ? "Dati Criptati" : "Dati Decriptati"} DATA:
              </label>
              <p className="break-words">{screen === "encrypt" ? encryptedData : decryptedData}</p>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default EncryptDecrypt;
