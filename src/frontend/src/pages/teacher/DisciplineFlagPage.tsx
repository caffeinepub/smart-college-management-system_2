import type { Student } from "@/backend";
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
import { useActor } from "@/hooks/useActor";
import { useAddDisciplineFlag } from "@/hooks/useQueries";
import { CheckCircle, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const VIOLATIONS = ["Improper Dress Code", "Shaving/Grooming Issues"];

export function DisciplineFlagPage() {
  const { actor } = useActor();
  const [regNo, setRegNo] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [violation, setViolation] = useState(VIOLATIONS[0]);
  const [submitted, setSubmitted] = useState(false);

  const addFlag = useAddDisciplineFlag();

  const handleSearch = async () => {
    if (!regNo.trim() || !actor) return;
    setSearching(true);
    setNotFound(false);
    setStudent(null);
    try {
      const s = await actor.getStudentByRegNo(regNo.trim());
      if (s) setStudent(s);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    }
    setSearching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    try {
      await addFlag.mutateAsync({
        id: BigInt(Date.now()),
        regNo: student.regNo,
        violationType: violation,
        reportedBy: "Teacher",
        timestamp: new Date().toISOString(),
      });
      toast.success("Discipline flag recorded");
      setSubmitted(true);
    } catch {
      toast.error("Failed to record flag");
    }
  };

  const reset = () => {
    setRegNo("");
    setStudent(null);
    setNotFound(false);
    setSubmitted(false);
  };

  return (
    <div className="max-w-lg space-y-4" data-ocid="discipline_flag.section">
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Record Discipline Flag</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitted ? (
            <div
              className="flex flex-col items-center justify-center py-8 gap-3"
              data-ocid="discipline_flag.success_state"
            >
              <CheckCircle size={40} className="text-green-500" />
              <p className="font-medium text-green-700">
                Discipline flag recorded!
              </p>
              <Button onClick={reset} data-ocid="discipline_flag.reset.button">
                Record Another
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <Label>Register Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. ST001"
                    data-ocid="discipline_flag.regno.input"
                  />
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={searching}
                    data-ocid="discipline_flag.search.button"
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search size={16} />
                    )}
                  </Button>
                </div>
              </div>

              {notFound && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="discipline_flag.error_state"
                >
                  Student not found.
                </p>
              )}

              {student && (
                <div className="p-3 rounded-lg bg-accent/30 border border-border">
                  <p className="font-medium text-sm">{student.name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{student.dept}</Badge>
                    <Badge variant="outline">
                      Year {student.year} / Sec {student.section}
                    </Badge>
                  </div>
                </div>
              )}

              {student && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label>Violation Type</Label>
                    <Select value={violation} onValueChange={setViolation}>
                      <SelectTrigger data-ocid="discipline_flag.violation.select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VIOLATIONS.map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="p-2 bg-muted rounded">
                      <span className="font-medium">Reported By:</span> Teacher
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <span className="font-medium">Timestamp:</span>{" "}
                      {new Date().toLocaleString()}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={addFlag.isPending}
                    data-ocid="discipline_flag.submit_button"
                  >
                    {addFlag.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Record Flag
                  </Button>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
