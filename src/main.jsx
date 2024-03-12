import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import "./reset.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { WagmiConfig } from "./wagmiConfig";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiProvider config={WagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </WagmiProvider>
);
