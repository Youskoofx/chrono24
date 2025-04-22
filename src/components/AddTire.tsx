import React, { useState } from "react";
import { motion } from "framer-motion";
import TireForm from "./TireForm";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "./ui/alert";
import { pneuService, Pneu } from "../services/supabase";

const AddTire = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Pneu) => {
    try {
      await pneuService.addPneu(data);
      setSuccess(true);
      setError(null);

      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de l'ajout du pneu:", err);
      setError("Impossible d'ajouter le pneu. Veuillez réessayer plus tard.");
      setSuccess(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Racing-themed background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 z-0" />

      <div className="relative z-10">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-yellow-500 hover:text-yellow-400 mr-4"
            onClick={() => navigate("/stock")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au stock
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <span className="bg-yellow-500 h-8 w-2 mr-3"></span>
            Ajouter un pneu
          </h1>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert className="bg-green-900/20 border-green-800">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-400">
                Le pneu a été ajouté avec succès au stock !
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6"
        >
          <TireForm
            onSubmit={handleSubmit}
            submitButtonText="Ajouter au stock"
            resetOnSubmit={true}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AddTire;
