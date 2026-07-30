import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Users2,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="page-container p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold text-foreground mb-4 lg:mb-0">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="px-4">
              Refresh
              <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="default" size="sm">
              New Report
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Students */}
          <StatCard
            title="Total Students"
            value="1,245"
            trend="+12% from last month"
            icon={<Users2 className="h-5 w-5" />}
          />

          {/* Active Courses */}
          <StatCard
            title="Active Courses"
            value="89"
            trend="+5% from last month"
            icon={<BookOpen className="h-5 w-5" />}
          />

          {/* Revenue */}
          <StatCard
            title="Monthly Revenue"
            value="$24,500"
            trend="+18% from last month"
            icon={<DollarSign className="h-5 w-5" />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Enrollment Chart */}
          <Card className="h-full">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold">Course Enrollment</h2>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </CardHeader>
            <CardContent>
              {/* Chart would go here - placeholder */}
              <div className="h-48 bg-muted rounded-lg">
                {/* Placeholder for chart */}
              </div>
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card className="h-full">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold">User Activity</h2>
              <p className="text-sm text-muted-foreground">Today</p>
            </CardHeader>
            <CardContent>
              {/* Chart would go here - placeholder */}
              <div className="h-48 bg-muted rounded-lg">
                {/* Placeholder for chart */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for the dashboard
const StatCard = ({
  title,
  value,
  trend,
  icon,
  className = "",
}: {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {trend.startsWith("+") ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span className="text-xs font-medium">{trend}</span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);


export default Dashboard;
