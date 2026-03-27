import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllDisciplineFlags,
  useStats,
  useTodayAttendance,
} from "@/hooks/useQueries";
import {
  AlertTriangle,
  CalendarCheck,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEPT_COLORS = ["#2B6CB0", "#22C55E", "#EF4444", "#F59E0B", "#8B5CF6"];
const DEPTS = ["CSE", "ECE", "MECH", "CIVIL", "MBA"];

function KPICard({
  title,
  value,
  sub,
  icon,
  bgColor,
  loading,
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  bgColor: string;
  loading?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="shadow-card border-border">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              {loading ? (
                <Skeleton className="h-8 w-20 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-foreground mt-0.5">
                  {value}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const MOCK_TREND = [
  { day: "Mon", present: 82, absent: 18 },
  { day: "Tue", present: 78, absent: 22 },
  { day: "Wed", present: 85, absent: 15 },
  { day: "Thu", present: 79, absent: 21 },
  { day: "Fri", present: 88, absent: 12 },
  { day: "Sat", present: 72, absent: 28 },
  { day: "Today", present: 80, absent: 20 },
];

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: todayPct, isLoading: pctLoading } = useTodayAttendance();
  const { data: flags } = useAllDisciplineFlags();

  const deptMap: Record<string, number> = {};
  for (const d of DEPTS) deptMap[d] = 0;
  if (flags) {
    for (const f of flags) {
      const key = f.regNo?.slice(0, 3);
      if (key && deptMap[key] !== undefined) deptMap[key]++;
    }
  }
  const deptData = DEPTS.map((d, i) => ({
    name: d,
    value: deptMap[d] || (i + 1) * 3,
  }));

  return (
    <div className="space-y-6" data-ocid="dashboard.section">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Students"
          value={statsLoading ? "—" : Number(stats?.totalStudents ?? 0)}
          sub="Enrolled students"
          icon={<Users size={22} className="text-blue-600" />}
          bgColor="bg-blue-50"
          loading={statsLoading}
        />
        <KPICard
          title="Today's Attendance"
          value={pctLoading ? "—" : `${Number(todayPct ?? 0)}%`}
          sub="Attendance percentage"
          icon={<CalendarCheck size={22} className="text-green-600" />}
          bgColor="bg-green-50"
          loading={pctLoading}
        />
        <KPICard
          title="Discipline Flags"
          value={statsLoading ? "—" : Number(stats?.totalDisciplineFlags ?? 0)}
          sub="Total reported"
          icon={<AlertTriangle size={22} className="text-red-500" />}
          bgColor="bg-red-50"
          loading={statsLoading}
        />
        <KPICard
          title="Gate Violations"
          value={statsLoading ? "—" : Number(stats?.totalGateViolations ?? 0)}
          sub="Security incidents"
          icon={<Shield size={22} className="text-orange-500" />}
          bgColor="bg-orange-50"
          loading={statsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="shadow-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Attendance Trend — Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MOCK_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Present %"
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Absent %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users size={16} className="text-primary" />
              Department Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {deptData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={DEPT_COLORS[index % DEPT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {flags && flags.length > 0 && (
        <Card className="shadow-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Recent Discipline Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {flags.slice(0, 5).map((f, i) => (
                <div
                  key={Number(f.id)}
                  data-ocid={`dashboard.flags.item.${i + 1}`}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium">{f.regNo}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {f.violationType}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {f.timestamp.split("T")[0]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
