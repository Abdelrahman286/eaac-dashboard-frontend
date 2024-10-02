import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContextProvider from "./contexts/AppContext.jsx";
import UserContextProvider from "./contexts/UserContext.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({});
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AppContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </AppContextProvider>
  </QueryClientProvider>
);
