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
import { useAddAttendance, useSearchStudents } from "@/hooks/useQueries";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEPTS = ["CSE", "ECE", "MECH", "CIVIL", "MBA"];
const YEARS = ["1", "2", "3", "4"];
const SECTIONS = ["A", "B", "C"];
const HOURS = ["1", "2", "3", "4", "5", "6"];

type AttendanceStatus = "Present" | "Absent" | "Late";

export function MarkAttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const [dept, setDept] = useState("CSE");
  const [year, setYear] = useState("1");
  const [section, setSection] = useState("A");
  const [hour, setHour] = useState("1");
  const [date, setDate] = useState(today);
  const [step, setStep] = useState<1 | 2>(1);
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const { data: allStudents = [], isLoading } = useSearchStudents(
    step === 2 ? "" : "__none__",
  );
  const addAttendance = useAddAttendance();

  const deptStudents = allStudents.filter(
    (s) => s.dept === dept && s.year === year && s.section === section,
  );

  const handleNext = () => {
    setStep(2);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    const records = deptStudents.map((s, i) => ({
      id: BigInt(Date.now() + i),
      regNo: s.regNo,
      status: attendanceMap[s.regNo] || "Present",
      date,
      hour,
    }));
    try {
      await Promise.all(records.map((r) => addAttendance.mutateAsync(r)));
      toast.success(`Attendance saved for ${records.length} students`);
      setSubmitted(true);
    } catch {
      toast.error("Failed to save attendance");
    }
  };

  if (step === 2 && isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent
          className="py-10 flex items-center justify-center"
          data-ocid="attendance.loading_state"
        >
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (step === 2 && !isLoading) {
    if (deptStudents.length === 0) {
      return (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Mark Attendance — {dept} / Year {year} / Sec {section}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                data-ocid="attendance.back.button"
              >
                ← Back
              </Button>
            </div>
          </CardHeader>
          <CardContent
            className="py-10 text-center text-muted-foreground"
            data-ocid="attendance.empty_state"
          >
            No students found. Add students in the Admin panel first.
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="shadow-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Mark Attendance — {dept} / Y{year} / Sec {section} / Hr {hour}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(1)}
              data-ocid="attendance.back.button"
            >
              ← Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div
              className="flex flex-col items-center justify-center py-10 gap-3"
              data-ocid="attendance.success_state"
            >
              <CheckCircle size={40} className="text-green-500" />
              <p className="font-medium text-green-700">
                Attendance Saved Successfully!
              </p>
              <Button
                onClick={() => {
                  setStep(1);
                  setSubmitted(false);
                }}
                data-ocid="attendance.reset.button"
              >
                Mark Another
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {deptStudents.map((s, i) => (
                  <div
                    key={s.regNo}
                    data-ocid={`attendance.item.${i + 1}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <span className="font-medium text-sm">{s.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {s.regNo}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {(
                        ["Present", "Absent", "Late"] as AttendanceStatus[]
                      ).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            setAttendanceMap((prev) => ({
                              ...prev,
                              [s.regNo]: status,
                            }))
                          }
                          className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                            (attendanceMap[s.regNo] || "Present") === status
                              ? status === "Present"
                                ? "bg-green-500 text-white"
                                : status === "Absent"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-white"
                              : "bg-card border border-border text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {deptStudents.length} students
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={addAttendance.isPending}
                  data-ocid="attendance.submit_button"
                >
                  {addAttendance.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Attendance
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">Mark Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Department</Label>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger data-ocid="attendance.dept.select">
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
            <Label className="text-xs">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger data-ocid="attendance.year.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    Year {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger data-ocid="attendance.section.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Hour</Label>
            <Select value={hour} onValueChange={setHour}>
              <SelectTrigger data-ocid="attendance.hour.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h}>
                    Hour {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-ocid="attendance.date.input"
          />
        </div>
        <Button
          className="w-full"
          onClick={handleNext}
          data-ocid="attendance.next.button"
        >
          Next — Load Students
        </Button>
      </CardContent>
    </Card>
  );
}
