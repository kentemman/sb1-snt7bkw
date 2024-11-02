"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, UserCircle } from "lucide-react";

export default function ProfilePage() {
  const leaveBalances = [
    {
      type: "Annual Leave",
      used: 10,
      total: 25,
      color: "bg-blue-500",
    },
    {
      type: "Sick Leave",
      used: 3,
      total: 15,
      color: "bg-red-500",
    },
    {
      type: "Personal Leave",
      used: 2,
      total: 5,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Software Engineer</p>
          </div>
          <Button className="ml-auto" variant="outline">
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Leave Balances</h2>
            <div className="space-y-6">
              {leaveBalances.map((leave) => (
                <div key={leave.type}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{leave.type}</span>
                    <span className="text-muted-foreground">
                      {leave.used} / {leave.total} days used
                    </span>
                  </div>
                  <Progress
                    value={(leave.used / leave.total) * 100}
                    className={leave.color}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Leave History</h2>
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
                      <p className="font-medium">Annual Leave</p>
                      <p className="text-sm text-muted-foreground">
                        Dec 24 - Dec 26, 2024
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}