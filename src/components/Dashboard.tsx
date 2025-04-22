import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  AlertTriangle,
  Truck,
  Gauge,
  BarChart3,
} from "lucide-react";
import { pneuService, Pneu } from "../services/supabase";
import Loader from "./Loader";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, neufs: 0, occasions: 0 });
  const [lowStockPneus, setLowStockPneus] = useState<Pneu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pneuStats = await pneuService.getPneuStats();
        const lowStock = await pneuService.getLowStockPneus();

        setStats(pneuStats);
        setLowStockPneus(lowStock);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          "Impossible de charger les données. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Mettre en place un écouteur pour les mises à jour en temps réel
    let subscription = { unsubscribe: () => {} };

    try {
      subscription = pneuService.subscribeToChanges(
        "public:pneus",
        "pneus",
        fetchData,
      );
    } catch (err) {
      console.error("Erreur lors de l'abonnement aux changements:", err);
    }

    return () => {
      try {
        subscription.unsubscribe();
      } catch (err) {
        console.error("Erreur lors du désabonnement:", err);
      }
    };
  }, []);

  // Données pour le graphique camembert
  const pieData = [
    { name: "Neufs", value: stats.neufs },
    { name: "Occasions", value: stats.occasions },
  ];

  const COLORS = ["#FFCC00", "#FFFFFF"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader size="large" text="Chargement du dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Racing-themed background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 z-0" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <span className="bg-yellow-500 h-8 w-2 mr-3"></span>
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Vue d'ensemble de votre stock de pneus
            </p>
          </div>

          <Link to="/add-tire">
            <Button className="mt-4 md:mt-0 bg-yellow-500 hover:bg-yellow-600 text-black">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un pneu
            </Button>
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Total des pneus */}
          <motion.div variants={itemVariants}>
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 opacity-10 rounded-bl-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                  <Gauge className="mr-2 h-5 w-5 text-yellow-500" />
                  Total des pneus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">
                  {stats.total}
                </div>
                <p className="text-sm text-gray-400 mt-1">pneus en stock</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pneus neufs */}
          <motion.div variants={itemVariants}>
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-10 rounded-bl-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-green-500" />
                  Pneus neufs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">
                  {stats.neufs}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  pneus neufs en stock
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pneus d'occasion */}
          <motion.div variants={itemVariants}>
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-10 rounded-bl-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                  Pneus d'occasion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">
                  {stats.occasions}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  pneus d'occasion en stock
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graphique camembert */}
          <motion.div
            variants={itemVariants}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-yellow-500 h-6 w-2 mr-3"></span>
              Répartition du stock
            </h2>
            <div className="h-[300px] w-full">
              {stats.total > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      animationDuration={1000}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} pneus`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </motion.div>

          {/* Alerte stock faible */}
          <motion.div
            variants={itemVariants}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-red-500 h-6 w-2 mr-3"></span>
              Alerte stock faible
            </h2>
            {lowStockPneus.length > 0 ? (
              <div className="space-y-4">
                {lowStockPneus.map((pneu) => (
                  <Alert key={pneu.id} className="bg-red-900/20 border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription>
                      <div className="font-medium">
                        {pneu.marque} - {pneu.dimensions}
                      </div>
                      <div className="text-sm text-gray-400 flex justify-between">
                        <span>
                          {pneu.saison} - {pneu.etat}
                        </span>
                        <span className="font-bold text-red-500">
                          Quantité: {pneu.quantite}
                        </span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-400">
                Aucun pneu en stock faible
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
