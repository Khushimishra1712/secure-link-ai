"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Activity, History, Settings, LogOut, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Scan URL",
    href: "/",
    icon: Activity,
  },
  {
    title: "Scan History",
    href: "/history",
    icon: History,
  },
];

export function DashboardNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const navItems = [...items];
  if (isAdmin) {
    navItems.push({
      title: "Admin",
      href: "/admin",
      icon: Users,
    });
  }

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/dashboard" className="flex items-center gap-2 mr-6">
        <Shield className="h-6 w-6 text-primary" />
        <span className="font-bold">SecureLink AI</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            {item.title}
          </span>
        </Link>
      ))}
    </nav>
  );
}
