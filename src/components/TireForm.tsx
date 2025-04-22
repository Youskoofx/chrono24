import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Snowflake, Calendar, Plus, Save, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Pneu } from "../services/supabase";

const formSchema = z.object({
  marque: z.string().min(1, { message: "La marque est requise" }),
  dimensions: z.string().min(1, { message: "Les dimensions sont requises" }),
  saison: z.string().min(1, { message: "La saison est requise" }),
  etat: z.string().min(1, { message: "L'état est requis" }),
  quantite: z.coerce
    .number()
    .min(1, { message: "La quantité doit être d'au moins 1" }),
  reference: z.string().optional(),
  commentaire: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TireFormProps {
  initialData?: Pneu;
  onSubmit: (data: Pneu) => Promise<void>;
  submitButtonText?: string;
  resetOnSubmit?: boolean;
}

const TireForm = ({
  initialData,
  onSubmit,
  submitButtonText = "Enregistrer",
  resetOnSubmit = false,
}: TireFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<FormValues> = {
    marque: initialData?.marque || "",
    dimensions: initialData?.dimensions || "",
    saison: initialData?.saison || "été",
    etat: initialData?.etat || "neuf",
    quantite: initialData?.quantite || 1,
    reference: initialData?.reference || "",
    commentaire: initialData?.commentaire || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data as Pneu);

      if (resetOnSubmit) {
        form.reset(defaultValues);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const marques = [
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
    "BFGoodrich",
    "Falken",
    "Cooper",
    "Kumho",
    "General",
    "Nankang",
    "Nexen",
    "Vredestein",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Marque */}
        <FormField
          control={form.control}
          name="marque"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Marque</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  {marques.map((marque) => (
                    <SelectItem key={marque} value={marque}>
                      {marque}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dimensions */}
        <FormField
          control={form.control}
          name="dimensions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Dimensions</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="205/55 R16"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                Format: Largeur/Hauteur RDiamètre (ex: 205/55 R16)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Saison */}
        <FormField
          control={form.control}
          name="saison"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Saison</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="été"
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
                        value="hiver"
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
                        value="4 saisons"
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

        {/* État */}
        <FormField
          control={form.control}
          name="etat"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">État</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="neuf"
                        className="border-green-500 text-green-500"
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-white">
                      Neuf
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="occasion"
                        className="border-blue-500 text-blue-500"
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-white">
                      Occasion
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantité */}
        <FormField
          control={form.control}
          name="quantite"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Quantité</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="1"
                  className="bg-zinc-800 border-zinc-700 text-white w-full md:w-1/4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Référence */}
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
                  placeholder="Référence interne"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Commentaire */}
        <FormField
          control={form.control}
          name="commentaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                Commentaire (Optionnel)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Informations supplémentaires"
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bouton de soumission */}
        <Button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours...
            </>
          ) : initialData ? (
            <>
              <Save className="mr-2 h-4 w-4" /> {submitButtonText}
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> {submitButtonText}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TireForm;
