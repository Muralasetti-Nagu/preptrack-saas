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
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col md:pl-64">
        <header className="flex h-16 shrink-0 items-center gap-y-4 border-b border-border bg-surface px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6 relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-surface transition-all select-none"
              >
                {initials}
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-surface shadow-lg ring-1 ring-border border border-border z-50 overflow-hidden text-left">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-textMain truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-textDim truncate">{user?.email || "No email"}</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={logout}
                      className="flex w-full items-center px-4 py-2 text-sm text-hard hover:bg-border transition-colors text-left"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

