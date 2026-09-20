import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  GraduationCap,
  RefreshCw,
  Plus,
  ArrowUpRight,
  Activity,
  Clock,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/shared/components/common/PageHeader";

const stats = [
  {
    title: "Total Students",
    value: "1,245",
    trend: "+12.5%",
    description: "vs last month",
    icon: GraduationCap,
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    trendUp: true,
  },
  {
    title: "Active Courses",
    value: "89",
    trend: "+5.2%",
    description: "vs last month",
    icon: BookOpen,
    color: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
    trendUp: true,
  },
  {
    title: "Monthly Revenue",
    value: "$24,500",
    trend: "+18.7%",
    description: "vs last month",
    icon: DollarSign,
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
    trendUp: true,
  },
  {
    title: "Active Users",
    value: "892",
    trend: "-3.2%",
    description: "vs last month",
    icon: Activity,
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-500",
    trendUp: false,
  },
];

const recentActivities = [
  {
    user: "Sarah Johnson",
    action: "enrolled in",
    target: "Advanced Mathematics",
    time: "2 min ago",
    type: "enrollment",
  },
  {
    user: "Michael Chen",
    action: "completed",
    target: "Physics 101 - Final Exam",
    time: "15 min ago",
    type: "completion",
  },
  {
    user: "Emily Rodriguez",
    action: "submitted",
    target: "Literature Review Paper",
    time: "1 hour ago",
    type: "submission",
  },
  {
    user: "David Kim",
    action: "joined",
    target: "Computer Science Club",
    time: "2 hours ago",
    type: "join",
  },
  {
    user: "Lisa Thompson",
    action: "achieved",
    target: "Perfect Attendance Badge",
    time: "3 hours ago",
    type: "achievement",
  },
];

const Dashboard = () => {
  return (
    <div className="page-container">
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's what's happening today."
        >
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-3.5 w-3.5" />
            New Report
          </Button>
        </PageHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-border/40"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-50`}
              />
              <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 border border-border/30 shadow-sm">
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <Badge
                    variant={stat.trendUp ? "success" : "warning"}
                    className="gap-1"
                  >
                    <TrendingUp
                      className={`h-3 w-3 ${!stat.trendUp ? "rotate-180" : ""}`}
                    />
                    {stat.trend}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground mt-0.5">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts + Activity Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Enrollment Chart */}
          <Card className="lg:col-span-2 border-border/40">
            <CardHeader className="pb-4 flex-row items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Course Enrollment
                </h2>
                <p className="text-sm text-muted-foreground">
                  Last 6 months overview
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View Details
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-52 rounded-xl bg-gradient-to-b from-primary/5 to-transparent border border-border/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-around px-4 pb-6">
                  {[35, 55, 45, 65, 50, 75].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-8 sm:w-10 rounded-lg bg-gradient-to-t from-primary/60 to-primary/30 transition-all duration-500 hover:from-primary/80 hover:to-primary/50"
                        style={{ height: `${h * 0.6}px` }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground relative z-10 bg-background/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-border/30">
                  Enrollment Trend Chart
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/40">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Recent Activity
                  </h2>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      {i < recentActivities.length - 1 && (
                        <div className="absolute top-3 left-1 h-full w-px bg-border/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>{" "}
                        <span className="font-medium text-primary/80">
                          {activity.target}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/40">
          <CardHeader className="pb-4">
            <h2 className="text-base font-semibold text-foreground">
              Quick Actions
            </h2>
            <p className="text-sm text-muted-foreground">
              Common tasks and shortcuts
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                "Add Student",
                "Create Course",
                "Generate Report",
                "Manage Users",
              ].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">{action}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
