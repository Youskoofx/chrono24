import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import AddTire from "./components/AddTire";
import routes from "tempo-routes";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./components/Dashboard"));
const Stock = lazy(() => import("./components/Stock"));
const History = lazy(() => import("./components/HistoryLog"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-black text-white">
          <Loader size="medium" text="Chargement..." />
        </div>
      }
    >
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/add-tire" element={<AddTire />} />
            <Route path="/history" element={<History />} />
            {/* Fallback route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </main>
        <footer className="py-4 px-6 border-t border-zinc-800 text-center text-sm text-gray-400">
          © Chrono Pneus – Tous droits réservés – 2025
        </footer>
      </div>
    </Suspense>
  );
}

export default App;
