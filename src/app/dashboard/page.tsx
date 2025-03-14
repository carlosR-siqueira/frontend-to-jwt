"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css"; // Importando a folha de estilo

const API_URL = "http://localhost:3000";

export default function Dashboard() {
  const [user, setUser] = useState<string>(""); // Nome do usuário
  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redireciona para o login se não houver token
    } else {
      // Decodificando o token JWT para obter o nome do usuário
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.userName || "Usuário Autenticado");
      fetchClientes(token);
    }
  }, [router]);

  const fetchClientes = async (token: string) => {
    const response = await fetch(`${API_URL}/clientes`, {
      method: "GET",
      headers: { "x-access-token": token },
    });

    if (response.ok) {
      const data = await response.json();
      setClientes(data);
    } else {
      alert("Falha ao buscar clientes");
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      // Faz uma requisição para a API de logout no backend
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token, // Envia o token no cabeçalho
        },
      });

      if (response.ok) {
        // Se o logout for bem-sucedido, remove o token do localStorage e redireciona
        localStorage.removeItem("token");
        router.push("/"); // Redireciona para a página de login
      } else {
        // Se houver erro no logout (por exemplo, o token não foi revogado corretamente)
        alert("Erro ao realizar logout. Tente novamente.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dashboardBox}>
        <h2 className={styles.welcomeMessage}>Bem-vindo, {user}!</h2>
        <p className={styles.authMessage}>Você está autenticado.</p>
        
        <h3 className={styles.clientTitle}>Clientes:</h3>
        <ul className={styles.clientList}>
          {clientes.map((cliente) => (
              <li key={cliente.id} className={styles.clientItem}>{cliente.nome}</li>
              ))}
        </ul>
              <button className={styles.logoutButton} onClick={logout}>Sair</button>
      </div>
    </div>
  );
}
