import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  AlertTriangle,
  BarChart2,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Page =
  | "dashboard"
  | "students"
  | "attendance"
  | "discipline"
  | "security"
  | "reports"
  | "global-search"
  | "mark-attendance"
  | "discipline-flag"
  | "gate-violations"
  | "my-attendance"
  | "my-discipline";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  pageTitle: string;
}

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    roles: ["admin"],
  },
  {
    id: "students",
    label: "Students",
    icon: <Users size={18} />,
    roles: ["admin"],
  },
  {
    id: "attendance",
    label: "Attendance Reports",
    icon: <CalendarCheck size={18} />,
    roles: ["admin"],
  },
  {
    id: "discipline",
    label: "Discipline Flags",
    icon: <AlertTriangle size={18} />,
    roles: ["admin"],
  },
  {
    id: "global-search",
    label: "Global Search",
    icon: <Search size={18} />,
    roles: ["admin"],
  },
  {
    id: "reports",
    label: "Reports",
    icon: <BarChart2 size={18} />,
    roles: ["admin"],
  },
  {
    id: "mark-attendance",
    label: "Mark Attendance",
    icon: <CalendarCheck size={18} />,
    roles: ["teacher"],
  },
  {
    id: "discipline-flag",
    label: "Discipline Flag",
    icon: <AlertTriangle size={18} />,
    roles: ["teacher"],
  },
  {
    id: "gate-violations",
    label: "Gate Violations",
    icon: <Shield size={18} />,
    roles: ["security"],
  },
  {
    id: "my-attendance",
    label: "My Attendance",
    icon: <ClipboardList size={18} />,
    roles: ["student"],
  },
  {
    id: "my-discipline",
    label: "Discipline History",
    icon: <BookOpen size={18} />,
    roles: ["student"],
  },
];

export function Layout({
  currentPage,
  onNavigate,
  children,
  pageTitle,
}: LayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role),
  );
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <GraduationCap size={18} className="text-primary-foreground" />
        </div>
        <div>
          <p className="font-bold text-sm text-foreground leading-tight">
            Smart College
          </p>
          <p className="text-xs text-muted-foreground">Management System</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
          Modules
        </p>
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            data-ocid={`nav.${item.id}.link`}
            onClick={() => {
              onNavigate(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentPage === item.id
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <button
          type="button"
          data-ocid="nav.logout.button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex flex-col w-[250px] shrink-0 h-full">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              role="button"
              tabIndex={0}
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            />
            <motion.aside
              className="absolute left-0 top-0 h-full w-[250px]"
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Sidebar />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="bg-card border-b border-border px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              data-ocid="nav.menu.button"
            >
              <Menu size={20} />
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-primary">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-muted-foreground">
              Welcome,{" "}
              <span className="font-semibold text-foreground">{roleLabel}</span>
            </span>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export type { Page };
