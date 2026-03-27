import type { AttendanceRecord } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttendanceByDeptAndDate } from "@/hooks/useQueries";
import { Download, Filter } from "lucide-react";
import { useState } from "react";

const DEPTS = ["CSE", "ECE", "MECH", "CIVIL", "MBA"];
const SK_ROWS = ["sk-a", "sk-b", "sk-c", "sk-d"];
const SK_COLS4 = ["c1", "c2", "c3", "c4"];

function exportCSV(records: AttendanceRecord[], dept: string, date: string) {
  const headers = ["ID", "Reg No", "Status", "Date", "Hour"];
  const rows = records.map((r) => [
    String(r.id),
    r.regNo,
    r.status,
    r.date,
    r.hour,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_${dept}_${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AttendanceReportsPage() {
  const today = new Date().toISOString().split("T")[0];
  const [dept, setDept] = useState("CSE");
  const [date, setDate] = useState(today);
  const [filtered, setFiltered] = useState(false);

  const { data: records = [], isLoading } = useAttendanceByDeptAndDate(
    filtered ? dept : "",
    filtered ? date : "",
  );

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  return (
    <div className="space-y-4" data-ocid="attendance.section">
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter size={16} /> Attendance Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Department</Label>
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger
                  className="w-32"
                  data-ocid="attendance.dept.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-40"
                data-ocid="attendance.date.input"
              />
            </div>
            <Button
              onClick={() => setFiltered(true)}
              data-ocid="attendance.filter.button"
            >
              Fetch Report
            </Button>
            {records.length > 0 && (
              <Button
                variant="outline"
                onClick={() => exportCSV(records, dept, date)}
                data-ocid="attendance.export.button"
              >
                <Download size={14} className="mr-2" /> Export CSV
              </Button>
            )}
          </div>
          {filtered && !isLoading && (
            <div className="flex gap-4 mt-4">
              <span className="text-sm">
                Present:{" "}
                <strong className="text-green-600">{presentCount}</strong>
              </span>
              <span className="text-sm">
                Absent: <strong className="text-red-500">{absentCount}</strong>
              </span>
              <span className="text-sm">
                Total: <strong>{records.length}</strong>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {filtered && (
        <Card className="shadow-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table data-ocid="attendance.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg No</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hour</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    SK_ROWS.map((rk) => (
                      <TableRow key={rk}>
                        {SK_COLS4.map((ck) => (
                          <TableCell key={ck}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : records.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-8"
                        data-ocid="attendance.empty_state"
                      >
                        No attendance records for this filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((r, i) => (
                      <TableRow
                        key={Number(r.id)}
                        data-ocid={`attendance.item.${i + 1}`}
                      >
                        <TableCell className="font-mono text-xs">
                          {r.regNo}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              r.status === "Present" ? "default" : "destructive"
                            }
                          >
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>Hour {r.hour}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
