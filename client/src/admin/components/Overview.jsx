import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", total: 1234 },
  { name: "Feb", total: 2345 },
  { name: "Mar", total: 3456 },
  { name: "Apr", total: 4567 },
  { name: "May", total: 5678 },
  { name: "Jun", total: 6789 },
  { name: "Jul", total: 7890 },
  { name: "Aug", total: 8901 },
  { name: "Sep", total: 9012 },
  { name: "Oct", total: 8901 },
  { name: "Nov", total: 7890 },
  { name: "Dec", total: 6789 },
];

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth Overview</CardTitle>
        <CardDescription>Monthly user growth for the past year</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px] sm:h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
