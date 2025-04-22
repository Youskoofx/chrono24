import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  User,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StockOverview from "./StockOverview";
import TireTable from "./TireTable";
import Logo from "./Logo";

interface HomeProps {
  onLogout?: () => void;
}

const Home = ({ onLogout }: HomeProps) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Racing-themed background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 z-0" />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/90 border-b border-yellow-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo size="medium" />

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span>Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <ul className="flex">
            <li>
              <Button
                variant="ghost"
                className="rounded-none border-b-2 border-yellow-500 text-yellow-500"
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="rounded-none border-b-2 border-transparent hover:border-yellow-500/50"
              >
                Stock
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="rounded-none border-b-2 border-transparent hover:border-yellow-500/50"
                onClick={() => navigate("/add-tire")}
              >
                Ajouter un pneu
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="rounded-none border-b-2 border-transparent hover:border-yellow-500/50"
              >
                Historique
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="rounded-none border-b-2 border-transparent hover:border-yellow-500/50"
                onClick={() => navigate("/settings")}
              >
                Paramètres
              </Button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-yellow-500 h-6 w-2 mr-3"></span>
            Dashboard
          </h2>

          {/* Stock Overview Component */}
          <StockOverview />
        </div>

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => navigate("/add-tire")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-racing hover:shadow-racing-hover"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un pneu
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-yellow-500 h-6 w-2 mr-3"></span>
            Aperçu du stock
          </h2>

          {/* Tire Table Component */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <TireTable />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-6">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>© 2023 Chrono Pneus - Application de Gestion de Stock Interne</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
