"use client";

import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Available Leave Days",
      value: "15",
      icon: CalendarDays,
      description: "Annual leave balance",
    },
    {
      title: "Pending Requests",
      value: "2",
      icon: Clock,
      description: "Awaiting approval",
    },
    {
      title: "Approved Leaves",
      value: "8",
      icon: CheckCircle2,
      description: "This year",
    },
    {
      title: "Rejected Leaves",
      value: "1",
      icon: XCircle,
      description: "This year",
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-24">
      <h1 className="text-4xl font-bold mb-8">Welcome Back, John</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
            <h3 className="font-semibold text-lg mb-1">{stat.title}</h3>
            <p className="text-muted-foreground text-sm">{stat.description}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Leave Requests</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-muted"
              >
                <div>
                  <p className="font-medium">Annual Leave</p>
                  <p className="text-sm text-muted-foreground">
                    Dec 24 - Dec 26, 2024
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Leave Calendar</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-muted"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Team Holiday</p>
                    <p className="text-sm text-muted-foreground">
                      Christmas Break
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Dec 25, 2024</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}