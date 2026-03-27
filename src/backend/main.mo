import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Student {
    public func compare(a : Student, b : Student) : Order.Order {
      Text.compare(a.regNo, b.regNo);
    };
  };

  type Student = {
    regNo : Text;
    name : Text;
    dept : Text;
    year : Text;
    section : Text;
  };

  module AttendanceRecord {
    public func compareByDate(a : AttendanceRecord, b : AttendanceRecord) : Order.Order {
      Text.compare(a.date, b.date);
    };
  };

  type AttendanceRecord = {
    id : Nat;
    regNo : Text;
    status : Text;
    date : Text;
    hour : Text;
  };

  module DisciplineFlag {
    public func compareByTimestamp(a : DisciplineFlag, b : DisciplineFlag) : Order.Order {
      Text.compare(a.timestamp, b.timestamp);
    };
  };

  type DisciplineFlag = {
    id : Nat;
    regNo : Text;
    violationType : Text;
    reportedBy : Text;
    timestamp : Text;
  };

  module GateViolation {
    public func compareByTimestamp(a : GateViolation, b : GateViolation) : Order.Order {
      Text.compare(a.timestamp, b.timestamp);
    };
  };

  type GateViolation = {
    id : Nat;
    regNo : Text;
    violationType : Text;
    recordedBy : Text;
    timestamp : Text;
  };

  type Stats = {
    totalStudents : Nat;
    totalDisciplineFlags : Nat;
    totalGateViolations : Nat;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  let students = Map.empty<Text, Student>();
  let attendance = List.empty<AttendanceRecord>();
  let disciplineFlags = List.empty<DisciplineFlag>();
  let gateViolations = List.empty<GateViolation>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var attendanceId = 0;
  var disciplineFlagId = 0;
  var gateViolationId = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared func addOrUpdateStudent(student : Student) : async () {
    students.add(student.regNo, student);
  };

  public shared func removeStudent(regNo : Text) : async () {
    students.remove(regNo);
  };

  public query func getStudentByRegNo(regNo : Text) : async ?Student {
    students.get(regNo);
  };

  public query func searchStudentsByName(nameSubstring : Text) : async [Student] {
    students.values().toArray().filter(
      func(s) { s.name.contains(#text nameSubstring) }
    ).sort();
  };

  public shared func addAttendanceRecord(record : AttendanceRecord) : async () {
    let newRecord : AttendanceRecord = { record with id = attendanceId };
    attendance.add(newRecord);
    attendanceId += 1;
  };

  public query func getAttendanceByRegNo(regNo : Text) : async [AttendanceRecord] {
    attendance.values().toArray().filter(
      func(r) { r.regNo == regNo }
    ).sort(AttendanceRecord.compareByDate);
  };

  public query func getAttendanceByDeptAndDate(dept : Text, date : Text) : async [AttendanceRecord] {
    attendance.values().toArray().filter(
      func(r) {
        switch (students.get(r.regNo)) {
          case (null) { false };
          case (?student) { student.dept == dept and r.date == date };
        };
      }
    ).sort(AttendanceRecord.compareByDate);
  };

  public query func getTodayAttendancePercentage(date : Text) : async Nat {
    let dailyRecords = attendance.values().toArray().filter(
      func(r) { r.date == date }
    );
    let presentCount = dailyRecords.foldLeft(
      0, func(acc, r) { if (r.status == "Present") { acc + 1 } else { acc } }
    );
    if (dailyRecords.size() == 0) { return 0 };
    (presentCount * 100) / dailyRecords.size();
  };

  public shared func addDisciplineFlag(flag : DisciplineFlag) : async () {
    let newFlag : DisciplineFlag = { flag with id = disciplineFlagId };
    disciplineFlags.add(newFlag);
    disciplineFlagId += 1;
  };

  public query func getDisciplineFlagsByRegNo(regNo : Text) : async [DisciplineFlag] {
    disciplineFlags.values().toArray().filter(
      func(f) { f.regNo == regNo }
    ).sort(DisciplineFlag.compareByTimestamp);
  };

  public query func getAllDisciplineFlags() : async [DisciplineFlag] {
    disciplineFlags.values().toArray().sort(DisciplineFlag.compareByTimestamp);
  };

  public query func getTotalDisciplineFlags() : async Nat {
    disciplineFlags.size();
  };

  public shared func addGateViolation(violation : GateViolation) : async () {
    let newViolation : GateViolation = { violation with id = gateViolationId };
    gateViolations.add(newViolation);
    gateViolationId += 1;
  };

  public query func getGateViolationsByRegNo(regNo : Text) : async [GateViolation] {
    gateViolations.values().toArray().filter(
      func(v) { v.regNo == regNo }
    ).sort(GateViolation.compareByTimestamp);
  };

  public query func getAllGateViolations() : async [GateViolation] {
    gateViolations.values().toArray().sort(GateViolation.compareByTimestamp);
  };

  public query func getStats() : async Stats {
    {
      totalStudents = students.size();
      totalDisciplineFlags = disciplineFlags.size();
      totalGateViolations = gateViolations.size();
    };
  };
};
