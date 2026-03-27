import type { Student } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  useAddStudent,
  useRemoveStudent,
  useSearchStudents,
} from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEPTS = ["CSE", "ECE", "MECH", "CIVIL", "MBA"];
const YEARS = ["1", "2", "3", "4"];
const SECTIONS = ["A", "B", "C"];
const EMPTY: Student = {
  regNo: "",
  name: "",
  dept: "CSE",
  year: "1",
  section: "A",
};
const SK_ROWS = ["sk-a", "sk-b", "sk-c", "sk-d"];
const SK_COLS6 = ["c1", "c2", "c3", "c4", "c5", "c6"];

export function StudentsPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<Student>({ ...EMPTY });

  const { data: students = [], isLoading } = useSearchStudents(search);
  const addMutation = useAddStudent();
  const removeMutation = useRemoveStudent();

  const openAdd = () => {
    setForm({ ...EMPTY });
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (s: Student) => {
    setForm({ ...s });
    setEditing(s);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMutation.mutateAsync(form);
      toast.success(editing ? "Student updated" : "Student added");
      setOpen(false);
    } catch {
      toast.error("Failed to save student");
    }
  };

  const handleDelete = async (regNo: string) => {
    try {
      await removeMutation.mutateAsync(regNo);
      toast.success("Student removed");
    } catch {
      toast.error("Failed to remove student");
    }
  };

  return (
    <div className="space-y-4" data-ocid="students.section">
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Student Management</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                  data-ocid="students.search_input"
                />
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    onClick={openAdd}
                    data-ocid="students.add_button"
                  >
                    <Plus size={14} className="mr-1" /> Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent data-ocid="students.dialog">
                  <DialogHeader>
                    <DialogTitle>
                      {editing ? "Edit Student" : "Add Student"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <Label>Register Number</Label>
                      <Input
                        value={form.regNo}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, regNo: e.target.value }))
                        }
                        placeholder="e.g. ST001"
                        required
                        disabled={!!editing}
                        data-ocid="students.regnno.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Full Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Student name"
                        required
                        data-ocid="students.name.input"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label>Department</Label>
                        <Select
                          value={form.dept}
                          onValueChange={(v) =>
                            setForm((p) => ({ ...p, dept: v }))
                          }
                        >
                          <SelectTrigger data-ocid="students.dept.select">
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
                        <Label>Year</Label>
                        <Select
                          value={form.year}
                          onValueChange={(v) =>
                            setForm((p) => ({ ...p, year: v }))
                          }
                        >
                          <SelectTrigger data-ocid="students.year.select">
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
                        <Label>Section</Label>
                        <Select
                          value={form.section}
                          onValueChange={(v) =>
                            setForm((p) => ({ ...p, section: v }))
                          }
                        >
                          <SelectTrigger data-ocid="students.section.select">
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
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        data-ocid="students.cancel_button"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addMutation.isPending}
                        data-ocid="students.submit_button"
                      >
                        {addMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {editing ? "Update" : "Add"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table data-ocid="students.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Dept</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  SK_ROWS.map((rk) => (
                    <TableRow key={rk}>
                      {SK_COLS6.map((ck) => (
                        <TableCell key={ck}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="students.empty_state"
                    >
                      No students found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s, i) => (
                    <TableRow
                      key={s.regNo}
                      data-ocid={`students.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {s.regNo}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{s.dept}</Badge>
                      </TableCell>
                      <TableCell>Year {s.year}</TableCell>
                      <TableCell>{s.section}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEdit(s)}
                            data-ocid={`students.edit_button.${i + 1}`}
                          >
                            <Pencil size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(s.regNo)}
                            data-ocid={`students.delete_button.${i + 1}`}
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
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
