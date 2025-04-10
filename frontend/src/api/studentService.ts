import { Student } from "../types";
import axios from "./axiosConfig";

export async function getStudents(searchTerm = ""): Promise<Student[]> {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
  const response = await axios.get(`/api/students${query}`);

  return response.data.map((student: any) => ({
    ...student,
    gpa:
      student.gpa !== undefined && student.gpa !== null
        ? parseFloat(student.gpa)
        : undefined,
  }));
}

export async function createStudent(
  studentData: Partial<Student>
): Promise<Student> {
  const response = await axios.post("/api/students", studentData);
  return response.data;
}

export async function updateStudent(
  id: number,
  studentData: Partial<Student>
): Promise<Student> {
  const response = await axios.put(`/api/students/${id}`, studentData);
  return response.data;
}

export async function deleteStudent(id: number): Promise<void> {
  await axios.delete(`/api/students/${id}`);
}
