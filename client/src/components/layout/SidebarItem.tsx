import { NavLink, NavLinkProps } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarItemProps extends NavLinkProps {
  icon: ReactNode;
  label: string;
  badgeCount?: number;
}

export default function SidebarItem({
  icon,
  label,
  badgeCount,
  className,
  ...props
}: SidebarItemProps) {
  return (
    <NavLink
      className={({ isActive, isPending, isTransitioning }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          isActive ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary",
          isPending && "opacity-75", // Example: makes the link semi-transparent while pending
          isTransitioning && "transitioning-class", // Add your transitioning styles
          className
        )
      }
      {...props}
    >
      {icon}
      {label}
      {badgeCount && (
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          {badgeCount}
        </Badge>
      )}
    </NavLink>
  );
}
