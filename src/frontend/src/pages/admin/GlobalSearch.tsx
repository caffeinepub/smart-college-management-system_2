import type {
  AttendanceRecord,
  DisciplineFlag,
  GateViolation,
  Student,
} from "@/backend";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { Search, User } from "lucide-react";
import { useState } from "react";

interface Profile {
  student: Student;
  attendance: AttendanceRecord[];
  discipline: DisciplineFlag[];
  violations: GateViolation[];
}

const SK_ITEMS = ["sk-a", "sk-b", "sk-c"];

export function GlobalSearchPage() {
  const { actor } = useActor();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !actor) return;
    setLoading(true);
    setSearched(true);
    setSelected(null);
    try {
      const students = await actor.searchStudentsByName(query);
      const profiles = await Promise.all(
        students.map(async (s) => {
          const [attendance, discipline, violations] = await Promise.all([
            actor.getAttendanceByRegNo(s.regNo),
            actor.getDisciplineFlagsByRegNo(s.regNo),
            actor.getGateViolationsByRegNo(s.regNo),
          ]);
          return { student: s, attendance, discipline, violations };
        }),
      );
      setResults(profiles);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4" data-ocid="search.section">
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search size={16} /> Global Student Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by student name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-sm"
              data-ocid="search.search_input"
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              data-ocid="search.primary_button"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card className="shadow-card" data-ocid="search.loading_state">
          <CardContent className="pt-4 space-y-2">
            {SK_ITEMS.map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      )}

      {!loading && searched && results.length === 0 && (
        <Card className="shadow-card">
          <CardContent
            className="py-10 text-center text-muted-foreground"
            data-ocid="search.empty_state"
          >
            No students found for "{query}".
          </CardContent>
        </Card>
      )}

      {!loading && results.length > 0 && !selected && (
        <Card className="shadow-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Dept</TableHead>
                  <TableHead>Year / Sec</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((p, i) => (
                  <TableRow
                    key={p.student.regNo}
                    data-ocid={`search.item.${i + 1}`}
                  >
                    <TableCell className="font-mono text-xs">
                      {p.student.regNo}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.student.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.student.dept}</Badge>
                    </TableCell>
                    <TableCell>
                      Y{p.student.year} / {p.student.section}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(p)}
                        data-ocid={`search.view.button.${i + 1}`}
                      >
                        <User size={12} className="mr-1" /> View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selected && (
        <Card className="shadow-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {selected.student.name} — Full Profile
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelected(null)}
                data-ocid="search.close_button"
              >
                ← Back
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{selected.student.dept}</Badge>
              <Badge variant="secondary">Year {selected.student.year}</Badge>
              <Badge variant="secondary">Sec {selected.student.section}</Badge>
              <Badge variant="outline">{selected.student.regNo}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="attendance">
              <TabsList>
                <TabsTrigger value="attendance">
                  Attendance ({selected.attendance.length})
                </TabsTrigger>
                <TabsTrigger value="discipline">
                  Discipline ({selected.discipline.length})
                </TabsTrigger>
                <TabsTrigger value="violations">
                  Gate Violations ({selected.violations.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="attendance" className="mt-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Hour</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.attendance.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground py-4"
                        >
                          No records
                        </TableCell>
                      </TableRow>
                    ) : (
                      selected.attendance.map((r) => (
                        <TableRow key={Number(r.id)}>
                          <TableCell>{r.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                r.status === "Present"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell>Hour {r.hour}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="discipline" className="mt-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Violation</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.discipline.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground py-4"
                        >
                          No records
                        </TableCell>
                      </TableRow>
                    ) : (
                      selected.discipline.map((f) => (
                        <TableRow key={Number(f.id)}>
                          <TableCell>
                            <Badge variant="destructive">
                              {f.violationType}
                            </Badge>
                          </TableCell>
                          <TableCell>{f.reportedBy}</TableCell>
                          <TableCell>{f.timestamp.split("T")[0]}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="violations" className="mt-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Violation</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.violations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground py-4"
                        >
                          No records
                        </TableCell>
                      </TableRow>
                    ) : (
                      selected.violations.map((v) => (
                        <TableRow key={Number(v.id)}>
                          <TableCell>
                            <Badge variant="outline">{v.violationType}</Badge>
                          </TableCell>
                          <TableCell>{v.recordedBy}</TableCell>
                          <TableCell>{v.timestamp.split("T")[0]}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
