import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAllDisciplineFlags,
  useAllGateViolations,
  useStats,
  useTodayAttendance,
} from "@/hooks/useQueries";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const VIOLATION_TYPES = ["Improper Dress Code", "Shaving/Grooming Issues"];
const GATE_TYPES = ["No ID", "No Helmet", "Late Entry"];

export function ReportsPage() {
  const { data: stats } = useStats();
  const { data: todayPct } = useTodayAttendance();
  const { data: flags = [] } = useAllDisciplineFlags();
  const { data: violations = [] } = useAllGateViolations();

  const flagData = VIOLATION_TYPES.map((t) => ({
    name: t.length > 15 ? `${t.slice(0, 15)}...` : t,
    count: flags.filter((f) => f.violationType === t).length,
  }));

  const gateData = GATE_TYPES.map((t) => ({
    name: t,
    count: violations.filter((v) => v.violationType === t).length,
  }));

  const summary = [
    { label: "Total Students", value: Number(stats?.totalStudents ?? 0) },
    {
      label: "Discipline Flags",
      value: Number(stats?.totalDisciplineFlags ?? 0),
    },
    {
      label: "Gate Violations",
      value: Number(stats?.totalGateViolations ?? 0),
    },
    { label: "Today Attendance %", value: `${Number(todayPct ?? 0)}%` },
  ];

  return (
    <div className="space-y-6" data-ocid="reports.section">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm">Discipline Flag Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={flagData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#EF4444" name="Flags" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm">Gate Violation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2B6CB0" name="Violations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
