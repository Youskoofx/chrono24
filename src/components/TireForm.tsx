import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sun, Snowflake, Calendar, Plus, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { addTire, updateTire, Tire } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  brand: z.string().min(1, { message: "Brand is required" }),
  width: z.string().min(1, { message: "Width is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  diameter: z.string().min(1, { message: "Diameter is required" }),
  season: z.enum(["summer", "winter", "all-season"], {
    required_error: "Season is required",
  }),
  condition: z.boolean(),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type TireFormValues = z.infer<typeof formSchema>;

interface TireFormProps {
  initialData?: TireFormValues;
  onSubmit?: (data: TireFormValues) => void;
  isEditing?: boolean;
  tireId?: string;
  onSuccess?: () => void;
}

const TireForm = ({
  initialData,
  onSubmit,
  isEditing = false,
  tireId,
  onSuccess,
}: TireFormProps = {}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<TireFormValues> = {
    brand: "",
    width: "",
    height: "",
    diameter: "",
    season: "summer",
    condition: true, // true = new, false = used
    quantity: "1",
    reference: "",
    notes: "",
    ...initialData,
  };

  const form = useForm<TireFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: TireFormValues) => {
    try {
      setIsSubmitting(true);

      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Préparer les données pour Supabase
      const tireData: Tire = {
        brand: data.brand,
        width: parseInt(data.width),
        height: parseInt(data.height),
        diameter: parseInt(data.diameter),
        season: data.season,
        condition: data.condition,
        quantity: parseInt(data.quantity),
        reference: data.reference,
        notes: data.notes,
      };

      // Ajouter ou mettre à jour le pneu dans Supabase
      if (isEditing && tireId) {
        await updateTire(tireId, tireData);
        toast({
          title: "Pneu mis à jour",
          description: "Le pneu a été mis à jour avec succès.",
        });
      } else {
        await addTire(tireData);
        toast({
          title: "Pneu ajouté",
          description: "Le pneu a été ajouté avec succès.",
        });
        form.reset(defaultValues); // Réinitialiser le formulaire après l'ajout
      }

      // Appeler le callback onSubmit si fourni
      if (onSubmit) {
        onSubmit(data);
      }

      // Appeler le callback onSuccess si fourni
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement du pneu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const brands = [
    "Michelin",
    "Continental",
    "Pirelli",
    "Bridgestone",
    "Goodyear",
    "Dunlop",
    "Hankook",
    "Yokohama",
    "Firestone",
    "Toyo",
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black border-yellow-500">
      <CardHeader className="border-b border-yellow-500/20">
        <CardTitle className="text-2xl font-bold text-yellow-500">
          {isEditing ? "Modifier un pneu" : "Ajouter un pneu"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {isEditing
            ? "Mettez à jour les informations de ce pneu dans votre inventaire"
            : "Remplissez les détails pour ajouter un nouveau pneu à votre inventaire"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6 pt-6">
            {/* Brand Selection */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Marque</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Sélectionner une marque" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Largeur</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="205"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Hauteur</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="55"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diameter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Diamètre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="16"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Season */}
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-white">Saison</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="summer"
                            className="border-yellow-500 text-yellow-500"
                          />
                        </FormControl>
                        <FormLabel className="flex items-center space-x-2 cursor-pointer text-white">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          <span>Été</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="winter"
                            className="border-blue-500 text-blue-500"
                          />
                        </FormControl>
                        <FormLabel className="flex items-center space-x-2 cursor-pointer text-white">
                          <Snowflake className="h-4 w-4 text-blue-500" />
                          <span>Hiver</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="all-season"
                            className="border-green-500 text-green-500"
                          />
                        </FormControl>
                        <FormLabel className="flex items-center space-x-2 cursor-pointer text-white">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span>4 Saisons</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Condition */}
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4 bg-gray-900">
                  <div className="space-y-0.5">
                    <FormLabel className="text-white">État</FormLabel>
                    <FormDescription className="text-gray-400">
                      {field.value ? "Pneus neufs" : "Pneus d'occasion"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Quantité</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reference (Optional) */}
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Référence (Optionnel)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Code de référence interne"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Notes (Optionnel)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
                      placeholder="Informations supplémentaires sur ce pneu"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t border-yellow-500/20 pt-6">
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Mise à jour..." : "Ajout en cours..."}
                </>
              ) : isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" /> Mettre à jour
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Ajouter
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default TireForm;
