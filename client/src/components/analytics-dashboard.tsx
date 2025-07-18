"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, BarChart, LineChartIcon, PieChart, Lightbulb, Moon, Sun, Circle, Box } from "lucide-react";
import ChartDisplay from "./chart-display";
import AiInsights from "./ai-insights";

type ParsedData = Record<string, string | number>[];
export type ChartType = "bar" | "line" | "pie" | "scatter" | "3d";

interface AnalyticsDashboardProps {
  uploadedData?: { data: ParsedData; headers: string[] } | null;
}

export default function AnalyticsDashboard({ uploadedData }: AnalyticsDashboardProps) {
  const [data, setData] = useState<ParsedData | null>(uploadedData?.data || null);
  const [headers, setHeaders] = useState<string[]>(uploadedData?.headers || []);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [xAxisKey, setXAxisKey] = useState<string>("");
  const [yAxisKey, setYAxisKey] = useState<string>("");
  const [nameKey, setNameKey] = useState<string>("");
  const [valueKey, setValueKey] = useState<string>("");
  const [insights, setInsights] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Effect triggered, uploadedData:", uploadedData);
    setData(uploadedData?.data || null);
    setHeaders(uploadedData?.headers || []);
    if (uploadedData?.data && uploadedData?.headers.length > 0) {
      const numericHeaders = uploadedData.headers.filter((h) => typeof uploadedData.data[0][h] === "number");
      setXAxisKey(uploadedData.headers[0] || "");
      setYAxisKey(numericHeaders[0] || "");
    }
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [uploadedData, theme]);

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleGenerateInsights = useCallback(async () => {
    console.log("Button clicked, handleGenerateInsights called, data:", data, "yAxisKey:", yAxisKey);
    if (!data || data.length === 0) {
      console.log("No data available for insights.");
      toast({
        variant: "destructive",
        title: "No Data",
        description: "Please upload data to generate insights.",
      });
      return;
    }
    setIsGenerating(true);
    console.log("isGenerating set to true, starting generation.");
    setInsights(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      console.log("Delay complete, generating insight.");
      if (!yAxisKey) {
        setInsights("Please select a Y-axis field for analysis.");
        return;
      }
      const isNumerical = data.every((row) => row[yAxisKey] !== undefined && typeof row[yAxisKey] === "number");
      if (!isNumerical) {
        setInsights("Error: Please select a numerical field for analysis (e.g., Age, Sales).");
        return;
      }
      const validData = data.filter((row) => row[yAxisKey] !== undefined && typeof row[yAxisKey] === "number");
      if (validData.length === 0) {
        setInsights("No valid numerical data found for analysis.");
        return;
      }
      const values = validData.map((row) => row[yAxisKey] as number);
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const sortedValues = [...values].sort((a, b) => a - b);
      const isIncreasing = sortedValues.length >= 2 && sortedValues.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
      const trend = isIncreasing ? "an upward trend" : "no clear trend";

      let insight = `Insight: The average ${yAxisKey} is ${average.toFixed(2)}. `;
      insight += `The range is from ${minValue} to ${maxValue}. `;
      insight += `The data shows ${trend} over time.`;

      setInsights(insight);
      console.log("Insight set to:", insight);
    } catch (err) {
      console.error("Insight generation error:", err);
      setInsights("Error: Could not generate insights due to an error.");
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate insights. Please try again.",
      });
    } finally {
      setIsGenerating(false);
      console.log("isGenerating set to false, generation complete.");
    }
  }, [data, yAxisKey, toast]);

  const handleExport = useCallback(async () => {
    if (chartContainerRef.current && data && data.length > 0) {
      try {
        const canvas = await html2canvas(chartContainerRef.current, { backgroundColor: null, useCORS: true });
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${chartType}-chart.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: "Chart Exported",
          description: "Your data has been downloaded as a PNG.",
        });
      } catch (err) {
        console.error("Export error:", err);
        toast({
          variant: "destructive",
          title: "Export Error",
          description: "Could not export the chart.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "No chart data to export.",
      });
    }
  }, [chartType, data, toast]);

  const numericHeaders = useMemo(() => {
    if (!data || data.length === 0) return [];
    return headers.filter((h) => typeof data[0][h] === "number");
  }, [data, headers]);

  const chartConfig = useMemo(() => {
    if (chartType === "pie") {
      return { nameKey, valueKey };
    }
    return { xAxisKey, yAxisKey };
  }, [chartType, xAxisKey, yAxisKey, nameKey, valueKey]);

  if (!data || data.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Data Uploaded</h2>
        <p className="text-gray-500">Please upload a file to visualize data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chart Controls</CardTitle>
              <CardDescription>Customize your data visualization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" /> Bar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChartIcon className="h-4 w-4" /> Line Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" /> Pie Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="scatter">
                    <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4" /> Scatter Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="3d">
                    <div className="flex items-center gap-2">
                  <Box className="h-4 w-4" /> 3D Column Chart
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {chartType === "pie" ? (
                <>
                  <Select value={nameKey} onValueChange={setNameKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Name Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={valueKey} onValueChange={setValueKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Value Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericHeaders.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <Select value={xAxisKey} onValueChange={setXAxisKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select X-Axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={yAxisKey} onValueChange={setYAxisKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Y-Axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericHeaders.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Button onClick={handleGenerateInsights} disabled={isGenerating || !data || data.length === 0}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generate Insights
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Insights
                  </>
                )}
              </Button>
              <Button onClick={handleExport} variant="secondary" disabled={!data || data.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Export Chart as PNG
              </Button>
              <Button onClick={handleThemeChange} variant="outline" className="mt-2">
                {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card ref={chartContainerRef}>
            <CardHeader>
              <CardTitle className="capitalize">{chartType} Chart</CardTitle>
              <CardDescription>Visual representation of your selected data.</CardDescription>
            </CardHeader>
            <ChartDisplay chartType={chartType} data={data} config={chartConfig} />
          </Card>
          <AiInsights insights={insights} isLoading={isGenerating} />
        </div>
      </div>
    </div>
  );
}