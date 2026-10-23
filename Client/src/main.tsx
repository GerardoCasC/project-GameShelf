import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { LibraryProvider } from "./context/LibraryProvider";
import "normalize.css";
import "./styles/variables.css";
import "./styles/index.css";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </HashRouter>
  </StrictMode>,
);
