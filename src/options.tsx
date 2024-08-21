import React from "react";
// import ReactDOM from "react-dom";
import DashboardLayout from "./components/dashboard/Dashboard";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

const Options = () => {
  return (
    <>
      <DashboardLayout />
    </>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Options />
  </BrowserRouter>
  // </React.StrictMode>
);
