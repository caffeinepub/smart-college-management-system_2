import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useDisciplineFlagsByRegNo } from "@/hooks/useQueries";
import { AlertTriangle } from "lucide-react";

const SK_ROWS = ["sk-a", "sk-b", "sk-c"];
const SK_COLS3 = ["c1", "c2", "c3"];

export function MyDisciplinePage() {
  const { user } = useAuth();
  const regNo = user?.regNo || "ST001";
  const { data: flags = [], isLoading } = useDisciplineFlagsByRegNo(regNo);

  return (
    <div className="space-y-4" data-ocid="my_discipline.section">
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle size={16} className="text-destructive" />
            Discipline History — {regNo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && flags.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm font-medium text-red-700">
                {flags.length} violation{flags.length > 1 ? "s" : ""} recorded
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                Please maintain proper conduct.
              </p>
            </div>
          )}
        </CardContent>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Violation</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date</TableHead>
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
                ) : flags.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="my_discipline.empty_state"
                    >
                      No discipline flags. Keep it up! ✓
                    </TableCell>
                  </TableRow>
                ) : (
                  flags.map((f, i) => (
                    <TableRow
                      key={Number(f.id)}
                      data-ocid={`my_discipline.item.${i + 1}`}
                    >
                      <TableCell>
                        <Badge variant="destructive" className="text-xs">
                          {f.violationType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{f.reportedBy}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {f.timestamp.split("T")[0]}
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
