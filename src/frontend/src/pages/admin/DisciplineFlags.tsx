import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAllDisciplineFlags,
  useDisciplineFlagsByRegNo,
} from "@/hooks/useQueries";
import { Search } from "lucide-react";
import { useState } from "react";

const SK_ROWS = ["sk-a", "sk-b", "sk-c", "sk-d"];
const SK_COLS4 = ["c1", "c2", "c3", "c4"];

export function DisciplineFlagsPage() {
  const [searchRegNo, setSearchRegNo] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data: allFlags = [], isLoading: allLoading } =
    useAllDisciplineFlags();
  const { data: filtered = [], isLoading: filteredLoading } =
    useDisciplineFlagsByRegNo(submitted);

  const flags = submitted ? filtered : allFlags;
  const isLoading = submitted ? filteredLoading : allLoading;

  return (
    <div className="space-y-4" data-ocid="discipline.section">
      <Card className="shadow-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Discipline Flags</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search by Reg No..."
                  value={searchRegNo}
                  onChange={(e) => setSearchRegNo(e.target.value)}
                  className="pl-8 h-9 w-48"
                  data-ocid="discipline.search_input"
                />
              </div>
              <Button
                size="sm"
                onClick={() => setSubmitted(searchRegNo)}
                data-ocid="discipline.filter.button"
              >
                Search
              </Button>
              {submitted && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSubmitted("");
                    setSearchRegNo("");
                  }}
                  data-ocid="discipline.clear.button"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table data-ocid="discipline.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Violation</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date</TableHead>
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
                ) : flags.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="discipline.empty_state"
                    >
                      No discipline flags found.
                    </TableCell>
                  </TableRow>
                ) : (
                  flags.map((f, i) => (
                    <TableRow
                      key={Number(f.id)}
                      data-ocid={`discipline.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {f.regNo}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="text-xs">
                          {f.violationType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{f.reportedBy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
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
