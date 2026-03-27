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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAddGateViolation, useAllGateViolations } from "@/hooks/useQueries";
import { Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const VIOLATION_TYPES = ["No ID", "No Helmet", "Late Entry"];

export function GateViolationsPage() {
  const today = new Date().toISOString().split("T")[0];
  const [regNo, setRegNo] = useState("");
  const [violation, setViolation] = useState(VIOLATION_TYPES[0]);

  const { data: allViolations = [] } = useAllGateViolations();
  const addViolation = useAddGateViolation();

  const todayViolations = allViolations.filter((v) =>
    v.timestamp.startsWith(today),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim()) return;
    try {
      await addViolation.mutateAsync({
        id: BigInt(Date.now()),
        regNo: regNo.trim(),
        violationType: violation,
        recordedBy: "Security",
        timestamp: new Date().toISOString(),
      });
      toast.success("Gate violation recorded");
      setRegNo("");
    } catch {
      toast.error("Failed to record violation");
    }
  };

  return (
    <div className="space-y-5" data-ocid="gate.section">
      <Card className="shadow-card border-border max-w-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield size={16} /> Record Gate Violation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Student Reg No</Label>
              <Input
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. ST001"
                required
                data-ocid="gate.regno.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Violation Type</Label>
              <Select value={violation} onValueChange={setViolation}>
                <SelectTrigger data-ocid="gate.violation.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIOLATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="p-2 bg-muted rounded">
                <span className="font-medium">Recorded By:</span> Security
              </div>
              <div className="p-2 bg-muted rounded">
                <span className="font-medium">Time:</span>{" "}
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={addViolation.isPending}
              data-ocid="gate.submit_button"
            >
              {addViolation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Record Violation
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-sm">
            Today's Gate Violations — {today}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table data-ocid="gate.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Violation</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayViolations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-6"
                      data-ocid="gate.empty_state"
                    >
                      No violations recorded today.
                    </TableCell>
                  </TableRow>
                ) : (
                  todayViolations.map((v, i) => (
                    <TableRow
                      key={Number(v.id)}
                      data-ocid={`gate.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {v.regNo}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{v.violationType}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(v.timestamp).toLocaleTimeString()}
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
