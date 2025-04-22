import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: "/",
      label: "Tableau de bord",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    { path: "/stock", label: "Stock", icon: <Package className="h-5 w-5" /> },
    {
      path: "/add-tire",
      label: "Ajouter un pneu",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      path: "/history",
      label: "Historique",
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-white">Chrono Pneus</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors relative ${isActive(item.path) ? "bg-yellow-500 text-black" : "text-gray-300 hover:bg-zinc-800 hover:text-white"}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-yellow-500 w-full"
                    layoutId="navbar-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-yellow-500 hover:bg-zinc-800 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-zinc-900">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium flex items-center space-x-3 ${isActive(item.path) ? "bg-yellow-500 text-black" : "text-gray-300 hover:bg-zinc-800 hover:text-white"}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
