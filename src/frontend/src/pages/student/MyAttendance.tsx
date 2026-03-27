import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useAttendanceByRegNo } from "@/hooks/useQueries";
import { CalendarCheck } from "lucide-react";

const SK_ROWS = ["sk-a", "sk-b", "sk-c", "sk-d"];
const SK_COLS3 = ["c1", "c2", "c3"];

export function MyAttendancePage() {
  const { user } = useAuth();
  const regNo = user?.regNo || "ST001";
  const { data: records = [], isLoading } = useAttendanceByRegNo(regNo);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const percentage =
    records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

  return (
    <div className="space-y-4" data-ocid="my_attendance.section">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-5 text-center">
            <p className="text-3xl font-bold text-primary">{percentage}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Overall Attendance
            </p>
            <Progress value={percentage} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 text-center">
            <p className="text-3xl font-bold text-green-600">{presentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Days Present</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 text-center">
            <p className="text-3xl font-bold text-red-500">
              {records.length - presentCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Days Absent</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarCheck size={16} /> Attendance Records — {regNo}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hour</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  SK_ROWS.map((rk) => (
                    <TableRow key={rk}>
                      {SK_COLS3.map((ck) => (
                        <TableCell key={ck}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="my_attendance.empty_state"
                    >
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((r, i) => (
                    <TableRow
                      key={Number(r.id)}
                      data-ocid={`my_attendance.item.${i + 1}`}
                    >
                      <TableCell>{r.date}</TableCell>
                      <TableCell>Hour {r.hour}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.status === "Present" ? "default" : "destructive"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
