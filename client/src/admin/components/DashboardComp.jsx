import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivity } from "../components/RecentActivity";
import { Overview } from "../components/Overview";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardComp() {
  const [data, setData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/dashboard`, {
          withCredentials: true,
        });
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);
  console.log(data);

  return (
    <>
      <h1 className="text-3xl font-semibold">Dashboard Overview</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={"rounded-md"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data.userGrowthPercentage > 0 ? "+" : ""}
              {data.userGrowthPercentage}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className={"rounded-md"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data.activeUsersPercentage}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className={"rounded-md"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.newPosts}</div>
            <p className="text-xs text-muted-foreground">
              {data.newPostsPercentage}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className={"rounded-md"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reports}</div>
            <p className="text-xs text-muted-foreground">
              {data.reportsPercentage}% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Overview rawData={data.userGrowth} />
        <Card className={"rounded-md"}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity rawData={data.recentActivity} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
