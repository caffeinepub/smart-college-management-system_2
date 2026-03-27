import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DisciplineFlag {
    id: bigint;
    reportedBy: string;
    timestamp: string;
    regNo: string;
    violationType: string;
}
export interface Stats {
    totalDisciplineFlags: bigint;
    totalGateViolations: bigint;
    totalStudents: bigint;
}
export interface GateViolation {
    id: bigint;
    recordedBy: string;
    timestamp: string;
    regNo: string;
    violationType: string;
}
export interface AttendanceRecord {
    id: bigint;
    status: string;
    date: string;
    hour: string;
    regNo: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface Student {
    dept: string;
    name: string;
    year: string;
    section: string;
    regNo: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAttendanceRecord(record: AttendanceRecord): Promise<void>;
    addDisciplineFlag(flag: DisciplineFlag): Promise<void>;
    addGateViolation(violation: GateViolation): Promise<void>;
    addOrUpdateStudent(student: Student): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllDisciplineFlags(): Promise<Array<DisciplineFlag>>;
    getAllGateViolations(): Promise<Array<GateViolation>>;
    getAttendanceByDeptAndDate(dept: string, date: string): Promise<Array<AttendanceRecord>>;
    getAttendanceByRegNo(regNo: string): Promise<Array<AttendanceRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDisciplineFlagsByRegNo(regNo: string): Promise<Array<DisciplineFlag>>;
    getGateViolationsByRegNo(regNo: string): Promise<Array<GateViolation>>;
    getStats(): Promise<Stats>;
    getStudentByRegNo(regNo: string): Promise<Student | null>;
    getTodayAttendancePercentage(date: string): Promise<bigint>;
    getTotalDisciplineFlags(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeStudent(regNo: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchStudentsByName(nameSubstring: string): Promise<Array<Student>>;
}
