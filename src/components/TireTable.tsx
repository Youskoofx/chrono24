import React, { useState } from "react";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Tire {
  id: string;
  brand: string;
  width: number;
  height: number;
  diameter: number;
  season: "summer" | "winter" | "all-season";
  condition: "new" | "used";
  quantity: number;
  reference?: string;
  notes?: string;
}

interface TireTableProps {
  tires?: Tire[];
  onEdit?: (tire: Tire) => void;
  onDelete?: (id: string) => void;
}

const TireTable = ({ tires = mockTires, onEdit, onDelete }: TireTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [seasonFilter, setSeasonFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Tire>("brand");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tireToDelete, setTireToDelete] = useState<string | null>(null);

  // Filter and sort tires
  const filteredTires = tires
    .filter((tire) => {
      const matchesSearch =
        tire.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${tire.width}/${tire.height} R${tire.diameter}`.includes(searchTerm) ||
        (tire.reference &&
          tire.reference.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBrand = brandFilter === "all" || tire.brand === brandFilter;
      const matchesSeason =
        seasonFilter === "all" || tire.season === seasonFilter;
      const matchesCondition =
        conditionFilter === "all" || tire.condition === conditionFilter;

      return matchesSearch && matchesBrand && matchesSeason && matchesCondition;
    })
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof Tire) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (id: string) => {
    setTireToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tireToDelete && onDelete) {
      onDelete(tireToDelete);
    }
    setDeleteDialogOpen(false);
    setTireToDelete(null);
  };

  const uniqueBrands = Array.from(new Set(tires.map((tire) => tire.brand)));

  const getSortIcon = (field: keyof Tire) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getSeasonBadge = (season: "summer" | "winter" | "all-season") => {
    switch (season) {
      case "summer":
        return <Badge className="bg-yellow-500">Été</Badge>;
      case "winter":
        return <Badge className="bg-blue-500">Hiver</Badge>;
      case "all-season":
        return <Badge className="bg-green-500">4 Saisons</Badge>;
    }
  };

  const getConditionBadge = (condition: "new" | "used") => {
    return condition === "new" ? (
      <Badge className="bg-emerald-500">Neuf</Badge>
    ) : (
      <Badge className="bg-amber-500">Occasion</Badge>
    );
  };

  return (
    <div className="w-full bg-background rounded-xl border shadow-md p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par marque, dimensions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Marque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les marques</SelectItem>
              {uniqueBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={seasonFilter} onValueChange={setSeasonFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Saison" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les saisons</SelectItem>
              <SelectItem value="summer">Été</SelectItem>
              <SelectItem value="winter">Hiver</SelectItem>
              <SelectItem value="all-season">4 Saisons</SelectItem>
            </SelectContent>
          </Select>

          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="État" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les états</SelectItem>
              <SelectItem value="new">Neuf</SelectItem>
              <SelectItem value="used">Occasion</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setBrandFilter("all");
              setSeasonFilter("all");
              setConditionFilter("all");
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("brand")}
              >
                <div className="flex items-center">
                  Marque {getSortIcon("brand")}
                </div>
              </TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("season")}
              >
                <div className="flex items-center">
                  Saison {getSortIcon("season")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("condition")}
              >
                <div className="flex items-center">
                  État {getSortIcon("condition")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("quantity")}
              >
                <div className="flex items-center justify-end">
                  Quantité {getSortIcon("quantity")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTires.length > 0 ? (
              filteredTires.map((tire) => (
                <TableRow key={tire.id}>
                  <TableCell className="font-medium">{tire.brand}</TableCell>
                  <TableCell>{`${tire.width}/${tire.height} R${tire.diameter}`}</TableCell>
                  <TableCell>{getSeasonBadge(tire.season)}</TableCell>
                  <TableCell>{getConditionBadge(tire.condition)}</TableCell>
                  <TableCell className="text-right">{tire.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit && onEdit(tire)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteClick(tire.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Aucun pneu trouvé avec ces critères
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce pneu de l'inventaire ? Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Mock data for development
const mockTires: Tire[] = [
  {
    id: "1",
    brand: "Michelin",
    width: 205,
    height: 55,
    diameter: 16,
    season: "summer",
    condition: "new",
    quantity: 8,
  },
  {
    id: "2",
    brand: "Continental",
    width: 225,
    height: 45,
    diameter: 17,
    season: "winter",
    condition: "new",
    quantity: 4,
  },
  {
    id: "3",
    brand: "Pirelli",
    width: 195,
    height: 65,
    diameter: 15,
    season: "all-season",
    condition: "used",
    quantity: 2,
  },
  {
    id: "4",
    brand: "Bridgestone",
    width: 215,
    height: 60,
    diameter: 16,
    season: "summer",
    condition: "used",
    quantity: 6,
  },
  {
    id: "5",
    brand: "Goodyear",
    width: 235,
    height: 40,
    diameter: 18,
    season: "winter",
    condition: "new",
    quantity: 3,
  },
  {
    id: "6",
    brand: "Dunlop",
    width: 185,
    height: 65,
    diameter: 15,
    season: "all-season",
    condition: "used",
    quantity: 5,
  },
  {
    id: "7",
    brand: "Hankook",
    width: 225,
    height: 50,
    diameter: 17,
    season: "summer",
    condition: "new",
    quantity: 7,
  },
  {
    id: "8",
    brand: "Yokohama",
    width: 205,
    height: 55,
    diameter: 16,
    season: "winter",
    condition: "used",
    quantity: 2,
  },
];

export default TireTable;
