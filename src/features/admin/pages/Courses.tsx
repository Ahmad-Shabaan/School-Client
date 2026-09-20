import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, ArrowUpRight, Clock, Users, Star } from "lucide-react";
import Toolbar from "../components/Toolbar";
import PageHeader from "@/shared/components/common/PageHeader";

const courses = [
  {
    title: "Advanced Mathematics",
    students: 128,
    duration: "12 weeks",
    rating: 4.8,
    status: "active",
    instructor: "Dr. Sarah Wilson",
    color: "from-primary/20 to-primary/5",
  },
  {
    title: "Physics 101",
    students: 95,
    duration: "10 weeks",
    rating: 4.6,
    status: "active",
    instructor: "Prof. James Miller",
    color: "from-secondary/20 to-secondary/5",
  },
  {
    title: "Computer Science Fundamentals",
    students: 156,
    duration: "14 weeks",
    rating: 4.9,
    status: "active",
    instructor: "Dr. Emily Chen",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    title: "English Literature",
    students: 72,
    duration: "8 weeks",
    rating: 4.5,
    status: "draft",
    instructor: "Prof. Robert Brown",
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    title: "World History",
    students: 88,
    duration: "12 weeks",
    rating: 4.7,
    status: "active",
    instructor: "Dr. Maria Garcia",
    color: "from-primary/20 to-primary/5",
  },
  {
    title: "Introduction to Psychology",
    students: 110,
    duration: "10 weeks",
    rating: 4.4,
    status: "draft",
    instructor: "Prof. David Kim",
    color: "from-secondary/20 to-secondary/5",
  },
];

const Courses = () => {
  return (
    <div className="page-container">
      <div className="space-y-6">
        {/* Header */}

        <PageHeader
          title="Courses"
          description="Manage and organize your course catalog"
        >
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-3.5 w-3.5" />
            Create Course
          </Button>
        </PageHeader>

        {/* Search */}
        <Toolbar />

        {/* Course Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.title}
              className="group relative overflow-hidden border-border/40 hover:border-border/80 transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${course.color} opacity-30`}
              />
              <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 border border-border/30 shadow-sm">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <Badge
                    variant={course.status === "active" ? "success" : "default"}
                  >
                    {course.status === "active" ? "Active" : "Draft"}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground mt-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {course.instructor}
                </p>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {course.students}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    {course.rating}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
