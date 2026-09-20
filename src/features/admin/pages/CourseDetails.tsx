import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ArrowLeft,
  Users,
  Clock,
  Star,
  Calendar,
  BarChart3,
  Download,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";

const CourseDetails = () => {
  return (
    <div className="page-container">
      <div className="space-y-8">
        {/* Back + Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin/courses"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 hover:bg-accent transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Advanced Mathematics
              </h1>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Course overview and performance metrics
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Students", value: "128", icon: Users, color: "text-primary" },
            { label: "Course Duration", value: "12 Weeks", icon: Clock, color: "text-secondary" },
            { label: "Average Rating", value: "4.8/5.0", icon: Star, color: "text-amber-500" },
            { label: "Completion Rate", value: "87%", icon: BarChart3, color: "text-emerald-500" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/40">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border/30">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Course Info */}
          <Card className="lg:col-span-2 border-border/40">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold text-foreground">About This Course</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This comprehensive course covers advanced mathematical concepts including
                calculus, linear algebra, and differential equations. Designed for students
                who have completed introductory mathematics courses and are ready for
                rigorous mathematical thinking.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                {[
                  { label: "Instructor", value: "Dr. Sarah Wilson" },
                  { label: "Department", value: "Mathematics" },
                  { label: "Start Date", value: "September 1, 2026" },
                  { label: "End Date", value: "November 30, 2026" },
                  { label: "Schedule", value: "Mon, Wed, Fri" },
                  { label: "Credits", value: "4 Units" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <Card className="border-border/40">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="default" size="sm">
                <Users className="mr-2 h-4 w-4" />
                View Enrolled Students
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share Course
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Syllabus Preview */}
        <Card className="border-border/40">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Course Syllabus</h2>
                <p className="text-sm text-muted-foreground">12 modules covering key topics</p>
              </div>
              <Badge variant="default">Coming Soon</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-8 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Syllabus details will be available in the next update
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetails;