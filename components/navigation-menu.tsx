"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarDays, Home, Settings, UserCircle } from "lucide-react";

export function NavigationMenu() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/leaves",
      label: "My Leaves",
      icon: CalendarDays,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: UserCircle,
    },
    {
      href: "/admin",
      label: "Admin",
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6" />
            <span className="font-bold">LeaveMS</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn(
                "h-9",
                pathname === route.href && "bg-primary text-primary-foreground"
              )}
              asChild
            >
              <Link href={route.href} className="flex items-center space-x-2">
                <route.icon className="h-4 w-4" />
                <span>{route.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}