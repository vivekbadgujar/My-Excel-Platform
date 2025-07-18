"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ZAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type ParsedData = Record<string, string | number>[];
type ChartType = "bar" | "line" | "pie" | "scatter" | "3d";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface ChartDisplayProps {
  chartType: ChartType;
  data: ParsedData;
  config: {
    xAxisKey?: string;
    yAxisKey?: string;
    nameKey?: string;
    valueKey?: string;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartDisplay({ chartType, data, config }: ChartDisplayProps) {
  const { xAxisKey, yAxisKey, nameKey, valueKey } = config;

  // Dynamic height based on data length
  const dynamicHeight = Math.min(600, 300 + Math.log10(data.length + 1) * 100);

  const renderChart = () => {
    if (!data || data.length === 0) {
      return <p className="text-center text-muted-foreground">No data available to display.</p>;
    }

    if (chartType === "bar") {
      if (!xAxisKey || !yAxisKey) {
        return <p className="text-center text-muted-foreground">Please select X and Y axes for the bar chart.</p>;
      }
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            interval={Math.ceil(data.length / 10)} // Show fewer ticks for large data
            angle={data.length > 10 ? -45 : 0} // Rotate labels for large datasets
            textAnchor={data.length > 10 ? "end" : "middle"}
            height={data.length > 10 ? 60 : 30} // Increase height for rotated labels
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsla(var(--muted), 0.5)" }} />
          <Bar dataKey={yAxisKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }

    if (chartType === "line") {
      if (!xAxisKey || !yAxisKey) {
        return <p className="text-center text-muted-foreground">Please select X and Y axes for the line chart.</p>;
      }
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            interval={Math.ceil(data.length / 10)} // Show fewer ticks
            angle={data.length > 10 ? -45 : 0} // Rotate labels
            textAnchor={data.length > 10 ? "end" : "middle"}
            height={data.length > 10 ? 60 : 30} // Adjust height for rotation
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 2 }} />
          <Line
            type="monotone"
            dataKey={yAxisKey}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      );
    }

    if (chartType === "pie") {
      if (!nameKey || !valueKey) {
        return <p className="text-center text-muted-foreground">Please select name and value fields for the pie chart.</p>;
      }
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={data.length > 10 ? "70%" : "80%"} // Adjust radius for large data
            fill="hsl(var(--primary))"
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize={Math.max(10, 14 - Math.log10(data.length))}
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
          />
        </PieChart>
      );
    }

    if (chartType === "scatter") {
      if (!xAxisKey || !yAxisKey) {
        return <p className="text-center text-muted-foreground">Please select X and Y axes for the scatter chart.</p>;
      }
      return (
        <ScatterChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            type="number"
          />
          <YAxis
            dataKey={yAxisKey}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            type="number"
          />
          <ZAxis range={[64, 144]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            name="Data Points"
            data={data}
            fill="hsl(var(--primary))"
          />
        </ScatterChart>
      );
    }

    if (chartType === "3d") {
      // Since Recharts doesn't support true 3D charts, we'll use a enhanced bar chart
      // or show a message for now
      if (!xAxisKey || !yAxisKey) {
        return <p className="text-center text-muted-foreground">Please select X and Y axes for the 3D chart.</p>;
      }
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-muted-foreground mb-4">3D charts are not yet fully supported.</p>
          <p className="text-center text-sm text-muted-foreground">Displaying as enhanced bar chart:</p>
          <div className="w-full mt-4">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
                interval={Math.ceil(data.length / 10)}
                angle={data.length > 10 ? -45 : 0}
                textAnchor={data.length > 10 ? "end" : "middle"}
                height={data.length > 10 ? 60 : 30}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: Math.max(10, 14 - Math.log10(data.length)) }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsla(var(--muted), 0.5)" }} />
              <Bar
                dataKey={yAxisKey}
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                style={{
                  filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))",
                  transform: "perspective(1000px) rotateX(10deg)"
                }}
              />
            </BarChart>
          </div>
        </div>
      );
    }

    return <p className="text-center text-muted-foreground">Invalid chart type.</p>;
  };

  return (
    <CardContent className="p-2" style={{ height: `${dynamicHeight}px`, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </CardContent>
  );
}