import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";

// Importare i componenti di Redux
import { Provider } from "react-redux";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import store from "./redux/Store";
import ThemeProvider from "./components/ThemeProvider";

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Avvolgere tutta l'applicazione con il Provider di Redux */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
            {" "}
            {/* Provider di Context */}
            <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
    <Toaster
      toastOptions={{
        className: "toast-style",
        style: {
          fontSize: "16px",
        },
      }}
    />
  </StrictMode>
);
