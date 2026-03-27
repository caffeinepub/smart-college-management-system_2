import type {
  AttendanceRecord,
  DisciplineFlag,
  GateViolation,
  Student,
} from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const today = () => new Date().toISOString().split("T")[0];

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => actor!.getStats(),
    enabled: !!actor && !isFetching,
  });
}

export function useTodayAttendance() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["todayAttendance"],
    queryFn: async () => actor!.getTodayAttendancePercentage(today()),
    enabled: !!actor && !isFetching,
  });
}

export function useSearchStudents(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["students", query],
    queryFn: async () =>
      query === "__none__" ? [] : actor!.searchStudentsByName(query),
    enabled: !!actor && !isFetching && query !== "__none__",
  });
}

export function useStudentByRegNo(regNo: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["student", regNo],
    queryFn: async () => actor!.getStudentByRegNo(regNo),
    enabled: !!actor && !isFetching && !!regNo,
  });
}

export function useAttendanceByDeptAndDate(dept: string, date: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["attendance", dept, date],
    queryFn: async () => actor!.getAttendanceByDeptAndDate(dept, date),
    enabled: !!actor && !isFetching && !!dept && !!date,
  });
}

export function useAttendanceByRegNo(regNo: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["attendanceByReg", regNo],
    queryFn: async () => actor!.getAttendanceByRegNo(regNo),
    enabled: !!actor && !isFetching && !!regNo,
  });
}

export function useAllDisciplineFlags() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["disciplineFlags"],
    queryFn: async () => actor!.getAllDisciplineFlags(),
    enabled: !!actor && !isFetching,
  });
}

export function useDisciplineFlagsByRegNo(regNo: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["disciplineFlags", regNo],
    queryFn: async () => actor!.getDisciplineFlagsByRegNo(regNo),
    enabled: !!actor && !isFetching && !!regNo,
  });
}

export function useAllGateViolations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["gateViolations"],
    queryFn: async () => actor!.getAllGateViolations(),
    enabled: !!actor && !isFetching,
  });
}

export function useGateViolationsByRegNo(regNo: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["gateViolations", regNo],
    queryFn: async () => actor!.getGateViolationsByRegNo(regNo),
    enabled: !!actor && !isFetching && !!regNo,
  });
}

export function useAddStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (student: Student) => actor!.addOrUpdateStudent(student),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useRemoveStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (regNo: string) => actor!.removeStudent(regNo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useAddAttendance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: AttendanceRecord) =>
      actor!.addAttendanceRecord(record),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
      qc.invalidateQueries({ queryKey: ["todayAttendance"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAddDisciplineFlag() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (flag: DisciplineFlag) => actor!.addDisciplineFlag(flag),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["disciplineFlags"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAddGateViolation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: GateViolation) => actor!.addGateViolation(v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gateViolations"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
