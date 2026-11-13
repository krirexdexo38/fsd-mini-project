import * as React from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  ShieldCheck,
  Compass,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ProfileDropdown({
  user,
  onLogout,
  className,
  ...props
}) {
  const [, setIsOpen] = React.useState(false);
  const isAdmin = user?.role === "admin";

  const menuItems = [
    {
      label: "Explore Events",
      href: "/events",
      icon: <Compass className="h-4 w-4 text-foreground/70" />,
    },
    {
      label: "My Registrations",
      href: "/dashboard",
      icon: <Ticket className="h-4 w-4 text-foreground/70" />,
    },
    ...(isAdmin
      ? [
          {
            label: "Admin Console",
            href: "/admin",
            icon: <ShieldCheck className="h-4 w-4 text-primary" />,
          },
        ]
      : []),
  ];

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-1.5 transition-colors hover:bg-muted focus:outline-none"
          >
            <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground border border-border flex items-center justify-center text-sm font-bold uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span className="font-medium text-sm text-foreground">
              {user?.name || "Account"}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-64 rounded-xl border border-border bg-card p-2 shadow-lg z-50"
        >
          {/* User Profile Header Card */}
          <div className="px-3 py-2 rounded-lg bg-muted border border-border mb-2">
            <p className="text-sm font-semibold text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
            {user?.department && (
              <p className="text-sm text-muted-foreground/80 mt-1 truncate">
                {user.department}
              </p>
            )}
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <DropdownMenuItem asChild key={item.label}>
                <Link
                  to={item.href}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:bg-muted outline-none"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator className="my-1.5 bg-border" />

          {/* Sign Out Option */}
          <DropdownMenuItem asChild>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-colors outline-none"
            >
              <span>Sign Out</span>
              <LogOut className="h-4 w-4" />
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
