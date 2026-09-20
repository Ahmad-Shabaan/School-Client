import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { userQueryOptions } from "../options/dashboard.options";
import { formatDateFull } from "@/lib/utils/formatDate";
import { ROUTES } from "@/config/routes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  ArrowLeft,
  Activity,
  Award,
} from "lucide-react";

const MemberDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery(userQueryOptions(id ?? ""));

  if (isLoading) {
    return (
      <div className="page-container space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data || isError) {
    return (
      <AppError
        message="Failed to load user. Please try again."
        link="Back to Dashboard"
        to={ROUTES.Admin.basePath}
      />
    );
  }

  const user = data.data;

  return (
    <div className="page-container">
      <div className="space-y-8">
        {/* Back + Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin/members"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 hover:bg-accent transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <Badge variant={user.isActive ? "success" : "destructive"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Member profile and account details
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="border-border/40">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white shadow-lg mb-4">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {user.roles?.map((role) => (
                    <Badge key={role} variant="default" className="capitalize">
                      {role.toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-4 border-t border-border/30">
                <Button className="w-full" variant="default" size="sm">
                  <Activity className="mr-2 h-4 w-4" />
                  View Activity Log
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  <Award className="mr-2 h-4 w-4" />
                  View Achievements
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="lg:col-span-2 border-border/40">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Account Information</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <User className="h-3.5 w-3.5" />
                      First Name
                    </p>
                    <p className="text-sm font-medium text-foreground">{user.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <User className="h-3.5 w-3.5" />
                      Last Name
                    </p>
                    <p className="text-sm font-medium text-foreground">{user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </p>
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Shield className="h-3.5 w-3.5" />
                      Username
                    </p>
                    <p className="text-sm font-medium text-foreground">{user.userName}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Created At
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDateFull(user.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      Last Login
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {user.lastLogin ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Activity className="h-3.5 w-3.5" />
                      Account Status
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      <Badge variant={user.isActive ? "success" : "destructive"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Award className="h-3.5 w-3.5" />
                      Roles
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {user.roles?.map((role) => (
                        <Badge key={role} variant="secondary" className="capitalize">
                          {role.toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;