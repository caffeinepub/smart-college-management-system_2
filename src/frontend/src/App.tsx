import { Layout, type Page } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/pages/LoginPage";
import { AttendanceReportsPage } from "@/pages/admin/AttendanceReports";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { DisciplineFlagsPage } from "@/pages/admin/DisciplineFlags";
import { GlobalSearchPage } from "@/pages/admin/GlobalSearch";
import { ReportsPage } from "@/pages/admin/Reports";
import { StudentsPage } from "@/pages/admin/Students";
import { GateViolationsPage } from "@/pages/security/GateViolations";
import { MyAttendancePage } from "@/pages/student/MyAttendance";
import { MyDisciplinePage } from "@/pages/student/MyDiscipline";
import { DisciplineFlagPage } from "@/pages/teacher/DisciplineFlagPage";
import { MarkAttendancePage } from "@/pages/teacher/MarkAttendance";
import { useState } from "react";

const DEFAULT_PAGES: Record<string, Page> = {
  admin: "dashboard",
  teacher: "mark-attendance",
  security: "gate-violations",
  student: "my-attendance",
};

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Dashboard",
  students: "Students",
  attendance: "Attendance Reports",
  discipline: "Discipline Flags",
  security: "Security",
  reports: "Analytics & Reports",
  "global-search": "Global Search",
  "mark-attendance": "Mark Attendance",
  "discipline-flag": "Record Discipline Flag",
  "gate-violations": "Gate Violations",
  "my-attendance": "My Attendance",
  "my-discipline": "My Discipline History",
};

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState<Page>(
    user ? (DEFAULT_PAGES[user.role] as Page) : "dashboard",
  );

  if (!user) return <LoginPage />;

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <AdminDashboard />;
      case "students":
        return <StudentsPage />;
      case "attendance":
        return <AttendanceReportsPage />;
      case "discipline":
        return <DisciplineFlagsPage />;
      case "global-search":
        return <GlobalSearchPage />;
      case "reports":
        return <ReportsPage />;
      case "mark-attendance":
        return <MarkAttendancePage />;
      case "discipline-flag":
        return <DisciplineFlagPage />;
      case "gate-violations":
        return <GateViolationsPage />;
      case "my-attendance":
        return <MyAttendancePage />;
      case "my-discipline":
        return <MyDisciplinePage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout
      currentPage={page}
      onNavigate={setPage}
      pageTitle={PAGE_TITLES[page]}
    >
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
      <Toaster richColors />
    </AuthProvider>
  );
}
