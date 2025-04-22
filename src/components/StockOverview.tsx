import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PieChart, BarChart3, AlertTriangle } from "lucide-react";

interface StockOverviewProps {
  totalTires?: number;
  newTires?: number;
  usedTires?: number;
  seasonDistribution?: {
    summer: number;
    winter: number;
    allSeason: number;
  };
  lowStockAlerts?: {
    id: string;
    brand: string;
    dimensions: string;
    season: "summer" | "winter" | "all-season";
    condition: "new" | "used";
    quantity: number;
    threshold: number;
  }[];
}

const StockOverview: React.FC<StockOverviewProps> = ({
  totalTires = 156,
  newTires = 98,
  usedTires = 58,
  seasonDistribution = {
    summer: 72,
    winter: 54,
    allSeason: 30,
  },
  lowStockAlerts = [
    {
      id: "1",
      brand: "Michelin",
      dimensions: "205/55 R16",
      season: "summer",
      condition: "new",
      quantity: 2,
      threshold: 5,
    },
    {
      id: "2",
      brand: "Continental",
      dimensions: "225/45 R17",
      season: "winter",
      condition: "new",
      quantity: 1,
      threshold: 3,
    },
    {
      id: "3",
      brand: "Pirelli",
      dimensions: "195/65 R15",
      season: "all-season",
      condition: "used",
      quantity: 2,
      threshold: 4,
    },
    {
      id: "4",
      brand: "Goodyear",
      dimensions: "215/60 R16",
      season: "summer",
      condition: "used",
      quantity: 1,
      threshold: 3,
    },
  ],
}) => {
  // Calculate percentages for progress bars
  const newTiresPercentage = Math.round((newTires / totalTires) * 100);
  const usedTiresPercentage = Math.round((usedTires / totalTires) * 100);

  // Calculate percentages for season distribution
  const summerPercentage = Math.round(
    (seasonDistribution.summer / totalTires) * 100,
  );
  const winterPercentage = Math.round(
    (seasonDistribution.winter / totalTires) * 100,
  );
  const allSeasonPercentage = Math.round(
    (seasonDistribution.allSeason / totalTires) * 100,
  );

  return (
    <div className="w-full bg-background p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Stock Overview
      </h2>

      {/* Stock Counter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Tires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{totalTires}</span>
              <span className="text-muted-foreground text-sm">in stock</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">New Tires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold">{newTires}</span>
              <span className="text-muted-foreground text-sm">
                {newTiresPercentage}% of stock
              </span>
            </div>
            <Progress value={newTiresPercentage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Used Tires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold">{usedTires}</span>
              <span className="text-muted-foreground text-sm">
                {usedTiresPercentage}% of stock
              </span>
            </div>
            <Progress value={usedTiresPercentage} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Condition Distribution Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              <span>Condition Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              {/* Placeholder for actual chart - would use a real chart library in production */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border border-border">
                <div
                  className="absolute bg-blue-500"
                  style={{
                    width: "100%",
                    height: "100%",
                    clipPath: `polygon(50% 50%, 50% 0%, ${newTiresPercentage > 50 ? "100%" : `${50 + newTiresPercentage}%`} 0%, 100% ${newTiresPercentage > 75 ? "100%" : `${(newTiresPercentage * 4) / 3}%`})`,
                  }}
                />
                <div
                  className="absolute bg-amber-500"
                  style={{
                    width: "100%",
                    height: "100%",
                    clipPath: `polygon(50% 50%, 100% ${newTiresPercentage > 75 ? "100%" : `${(newTiresPercentage * 4) / 3}%`}, 100% 100%, ${usedTiresPercentage > 50 ? "0%" : `${50 - usedTiresPercentage}%`} 100%)`,
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">New ({newTiresPercentage}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm">Used ({usedTiresPercentage}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Season Distribution Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>Season Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex flex-col justify-center space-y-4">
              {/* Placeholder for actual chart - would use a real chart library in production */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Summer</span>
                  <span>{summerPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{ width: `${summerPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Winter</span>
                  <span>{winterPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-blue-400 h-3 rounded-full"
                    style={{ width: `${winterPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>All Season</span>
                  <span>{allSeasonPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${allSeasonPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Low Stock Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] pr-4">
              {lowStockAlerts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      variant="destructive"
                      className="bg-yellow-500/10 border-yellow-500/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <AlertTitle className="text-yellow-500">
                            {alert.brand} - {alert.dimensions}
                          </AlertTitle>
                          <AlertDescription className="text-sm mt-1">
                            Only{" "}
                            <span className="font-bold">{alert.quantity}</span>{" "}
                            left in stock
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {alert.season}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {alert.condition}
                              </Badge>
                            </div>
                          </AlertDescription>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Threshold: {alert.threshold}
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No low stock alerts</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockOverview;
