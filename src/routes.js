import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Profile from "./pages/Profile";

// verifica se está autenticado
const isAuthenticated = () => !!localStorage.getItem("token");

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/produtos"
        element={isAuthenticated() ? <Products /> : <Navigate to="/" />}
      />
      <Route
        path="/usuario"
        element={isAuthenticated() ? <Profile /> : <Navigate to="/" />}
      />
    </Routes>
  );
}
