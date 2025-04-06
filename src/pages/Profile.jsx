import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.post("/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  return user ? (
    <div>
      <h2>Bem-vindo, {user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  ) : (
    <p>Carregando...</p>
  );
}
