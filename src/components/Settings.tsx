import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, Plus, Save, User, Users } from "lucide-react";

const Settings = () => {
  const [stockThreshold, setStockThreshold] = useState(5);
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Mock users for the user management section
  const [users, setUsers] = useState([
    { id: "1", name: "Admin", email: "admin@chronopneus.fr", role: "admin" },
    {
      id: "2",
      name: "Utilisateur",
      email: "user@chronopneus.fr",
      role: "user",
    },
  ]);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to create the user
    setUsers([
      ...users,
      {
        id: (users.length + 1).toString(),
        ...newUser,
      },
    ]);
    setNewUser({ name: "", email: "", role: "user" });
  };

  const handleExportStock = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert("Export du stock en cours...");
  };

  return (
    <div className="w-full bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-yellow-500 h-6 w-2 mr-3"></span>
            Paramètres
          </h1>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="bg-zinc-900 border-b border-zinc-800 w-full justify-start mb-8">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Général
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger
                value="export"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Export
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Paramètres Généraux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stock Threshold Setting */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="threshold" className="text-white">
                        Seuil d'alerte de stock faible
                      </Label>
                      <Badge
                        variant="outline"
                        className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50"
                      >
                        {stockThreshold} pneus
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="threshold"
                        min={1}
                        max={20}
                        step={1}
                        value={[stockThreshold]}
                        onValueChange={(value) => setStockThreshold(value[0])}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-sm text-zinc-400">
                      Une alerte sera affichée lorsque le stock d'un pneu est
                      inférieur ou égal à cette valeur.
                    </p>
                  </div>

                  <div className="border-t border-zinc-800 my-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Mode sombre</Label>
                        <p className="text-sm text-zinc-400">
                          Activer le thème sombre pour l'application
                        </p>
                      </div>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 my-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Notifications</Label>
                        <p className="text-sm text-zinc-400">
                          Recevoir des notifications pour les stocks faibles
                        </p>
                      </div>
                      <Switch
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer les paramètres
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management */}
            <TabsContent value="users">
              <Card className="bg-zinc-900 border-zinc-800 mb-6">
                <CardHeader>
                  <CardTitle>Ajouter un utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Nom
                        </Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          className="bg-zinc-800 border-zinc-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          className="bg-zinc-800 border-zinc-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Ajouter
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                            <User className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-zinc-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className={
                            user.role === "admin"
                              ? "bg-yellow-500 text-black"
                              : ""
                          }
                        >
                          {user.role === "admin" ? "Admin" : "Utilisateur"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Export */}
            <TabsContent value="export">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Exporter les données</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-800/50">
                    <h3 className="text-lg font-medium mb-2">
                      Export du stock
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Téléchargez l'inventaire complet au format CSV ou Excel
                    </p>
                    <div className="flex gap-4">
                      <Button
                        onClick={handleExportStock}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                      >
                        <Download className="mr-2 h-4 w-4" /> Exporter en CSV
                      </Button>
                      <Button
                        onClick={handleExportStock}
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <Download className="mr-2 h-4 w-4" /> Exporter en Excel
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-800/50">
                    <h3 className="text-lg font-medium mb-2">
                      Export de l'historique
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Téléchargez l'historique des mouvements de stock
                    </p>
                    <div className="flex gap-4">
                      <Button
                        onClick={handleExportStock}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                      >
                        <Download className="mr-2 h-4 w-4" /> Exporter en CSV
                      </Button>
                      <Button
                        onClick={handleExportStock}
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <Download className="mr-2 h-4 w-4" /> Exporter en Excel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
