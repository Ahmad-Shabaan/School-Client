import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import PageHeader from "@/shared/components/common/PageHeader";

const plans = [
  {
    name: "Free",
    users: 245,
    price: "$0",
    status: "active",
    features: ["Basic access", "5 courses", "Community support"],
  },
  {
    name: "Basic",
    users: 380,
    price: "$9.99",
    status: "active",
    features: [
      "All Free features",
      "20 courses",
      "Email support",
      "Progress tracking",
    ],
  },
  {
    name: "Pro",
    users: 156,
    price: "$19.99",
    status: "active",
    features: [
      "All Basic features",
      "Unlimited courses",
      "Priority support",
      "Advanced analytics",
      "Certificates",
    ],
  },
  {
    name: "Enterprise",
    users: 28,
    price: "$49.99",
    status: "active",
    features: [
      "All Pro features",
      "Dedicated manager",
      "Custom integrations",
      "API access",
      "Team dashboard",
    ],
  },
];

const Subscriptions = () => {
  return (
    <div className="page-container">
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          title="Subscriptions"
          description="Manage plans and billing"
        >
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-3.5 w-3.5" />
            New Plan
          </Button>
        </PageHeader>


        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              label: "Total Subscribers",
              value: "809",
              icon: Users,
              change: "+12%",
              color: "text-primary",
            },
            {
              label: "Monthly Revenue",
              value: "$8,450",
              icon: DollarSign,
              change: "+18%",
              color: "text-emerald-500",
            },
            {
              label: "Avg. Retention",
              value: "94%",
              icon: TrendingUp,
              change: "+5%",
              color: "text-secondary",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/40">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border/30">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <Badge variant="success" className="text-[10px]">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="relative border-border/40 hover:border-border/80 transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 border border-border/30">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {plan.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mt-3">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {plan.users} subscribers
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-border/30">
                  <Button
                    variant={plan.name === "Pro" ? "default" : "outline"}
                    className="w-full"
                    size="sm"
                  >
                    {plan.name === "Free" ? "Current Plan" : "Manage Plan"}
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

export default Subscriptions;
