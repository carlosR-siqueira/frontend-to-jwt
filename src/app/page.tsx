"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const API_URL = "http://localhost:3000";

export default function Home() {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
  );
  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const router = useRouter();

  const login = async () => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });

    const data: { auth: boolean; token?: string } = await response.json();
    if (data.auth && data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert("Login falhou");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <input
          className={styles.input}
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} onClick={login}>Entrar</button>
      </div>
    </div>
  );
}