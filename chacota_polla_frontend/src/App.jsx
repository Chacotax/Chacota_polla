import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MundialPage from "./pages/MundialPage";
import PartidosPage from "./pages/PartidosPage";
import GruposPage from "./pages/GruposPage";
import RankingPage from "./pages/RankingPage";
import AdminPage from "./pages/AdminPage";
import "./styles/global.css";

function AppContent() {
  const { session } = useAuth();
  const [page, setPage] = useState("dashboard");

  if (!session) return <LoginPage />;

  const render = () => {
    if (page === "dashboard") return <DashboardPage onNavigate={setPage} />;
    if (page === "mundial") return <MundialPage />;
    if (page === "partidos") return <PartidosPage />;
    if (page === "grupos") return <GruposPage />;
    if (page === "ranking") return <RankingPage />;
    if (page === "admin") return <AdminPage />;
    return <DashboardPage onNavigate={setPage} />;
  };

  return (
    <Layout active={page} onNavigate={setPage}>
      {render()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
