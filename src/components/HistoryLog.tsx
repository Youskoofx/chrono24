import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon, SearchIcon, UserIcon } from "lucide-react";

interface HistoryEntry {
  id: string;
  date: Date;
  actionType: "add" | "remove" | "edit";
  tireDetails: {
    brand: string;
    dimensions: string;
    season: string;
    condition: string;
  };
  quantityChanged: number;
  user: string;
}

const HistoryLog = ({
  entries = mockHistoryEntries,
}: {
  entries?: HistoryEntry[];
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");

  // Filter entries based on selected filters
  const filteredEntries = entries.filter((entry) => {
    // Filter by date if selected
    if (
      selectedDate &&
      format(entry.date, "yyyy-MM-dd") !== format(selectedDate, "yyyy-MM-dd")
    ) {
      return false;
    }

    // Filter by action type if not 'all'
    if (actionFilter !== "all" && entry.actionType !== actionFilter) {
      return false;
    }

    // Filter by user if not 'all'
    if (userFilter !== "all" && entry.user !== userFilter) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !(
        entry.tireDetails.brand
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        entry.tireDetails.dimensions
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        entry.user.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  // Get unique users for filter dropdown
  const uniqueUsers = Array.from(new Set(entries.map((entry) => entry.user)));

  return (
    <Card className="w-full bg-background border-border shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="bg-yellow-500 w-1 h-6 rounded-full mr-2"></span>
          History Log
        </CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by brand, dimensions or user..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <CalendarIcon className="h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="add">Add</SelectItem>
                <SelectItem value="remove">Remove</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(selectedDate ||
              actionFilter !== "all" ||
              userFilter !== "all" ||
              searchQuery) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedDate(undefined);
                  setActionFilter("all");
                  setUserFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg relative overflow-hidden"
              >
                {/* Action type indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${getActionColor(entry.actionType)}`}
                ></div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getActionVariant(entry.actionType)}
                        className="capitalize"
                      >
                        {entry.actionType}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(entry.date, "PPP")} at {format(entry.date, "p")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{entry.user}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm">
                      <span className="font-medium">
                        {entry.tireDetails.brand}
                      </span>{" "}
                      - {entry.tireDetails.dimensions} (
                      {entry.tireDetails.season}, {entry.tireDetails.condition})
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Quantity changed:{" "}
                      <span
                        className={
                          entry.quantityChanged > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {entry.quantityChanged > 0
                          ? `+${entry.quantityChanged}`
                          : entry.quantityChanged}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No history entries match your filters.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions for styling
const getActionColor = (actionType: string) => {
  switch (actionType) {
    case "add":
      return "bg-green-500";
    case "remove":
      return "bg-red-500";
    case "edit":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const getActionVariant = (
  actionType: string,
): "default" | "destructive" | "outline" | "secondary" => {
  switch (actionType) {
    case "add":
      return "default";
    case "remove":
      return "destructive";
    case "edit":
      return "secondary";
    default:
      return "outline";
  }
};

// Mock data for preview
const mockHistoryEntries: HistoryEntry[] = [
  {
    id: "1",
    date: new Date("2023-06-15T09:30:00"),
    actionType: "add",
    tireDetails: {
      brand: "Michelin",
      dimensions: "205/55 R16",
      season: "Summer",
      condition: "New",
    },
    quantityChanged: 10,
    user: "John Doe",
  },
  {
    id: "2",
    date: new Date("2023-06-14T14:45:00"),
    actionType: "remove",
    tireDetails: {
      brand: "Continental",
      dimensions: "195/65 R15",
      season: "Winter",
      condition: "Used",
    },
    quantityChanged: -2,
    user: "Jane Smith",
  },
  {
    id: "3",
    date: new Date("2023-06-13T11:20:00"),
    actionType: "edit",
    tireDetails: {
      brand: "Pirelli",
      dimensions: "225/45 R17",
      season: "All-Season",
      condition: "New",
    },
    quantityChanged: 5,
    user: "Mike Johnson",
  },
  {
    id: "4",
    date: new Date("2023-06-12T16:10:00"),
    actionType: "add",
    tireDetails: {
      brand: "Bridgestone",
      dimensions: "185/60 R14",
      season: "Summer",
      condition: "Used",
    },
    quantityChanged: 8,
    user: "John Doe",
  },
  {
    id: "5",
    date: new Date("2023-06-11T10:05:00"),
    actionType: "remove",
    tireDetails: {
      brand: "Goodyear",
      dimensions: "215/65 R16",
      season: "Winter",
      condition: "New",
    },
    quantityChanged: -3,
    user: "Jane Smith",
  },
];

export default HistoryLog;
