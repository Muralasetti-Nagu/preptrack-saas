import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "ME";

  return (
    <div className="min-h-screen bg-background text-slate-900 font-inter">
      <Sidebar />
      <div className="flex flex-col md:pl-64">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6 lg:px-8 shadow-sm z-10 sticky top-0">
          <div className="flex flex-1" />
          <div className="flex items-center gap-x-4 lg:gap-x-6 relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm hover:ring-2 hover:ring-primary/50 trans-all select-none border border-slate-200 shadow-sm"
            >
              {initials}
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 top-12 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-slate-200 border border-slate-100 z-50 overflow-hidden text-left trans-all transform origin-top-right">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "No email"}</p>
                </div>
                <div className="p-1">
                  <button 
                    onClick={logout}
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 trans-all hover:text-hard text-left"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
