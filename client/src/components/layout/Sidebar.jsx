import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, PlusCircle, LogOut, BarChart2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Problems", href: "/problems", icon: ListTodo },
    { label: "Add Problem", href: "/add-problem", icon: PlusCircle },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-background md:flex">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Prep<span className="text-primary">Track</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium trans-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-textDim hover:bg-slate-200/50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "mr-3 h-5 w-5 shrink-0 trans-all",
                  isActive ? "text-primary" : "text-textDim group-hover:text-slate-900"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={logout}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-textDim trans-all hover:bg-slate-200/50 hover:text-hard"
        >
          <LogOut className="mr-3 h-5 w-5 shrink-0 text-textDim trans-all group-hover:text-hard" />
          Logout
        </button>
      </div>
    </aside>
  );
};
