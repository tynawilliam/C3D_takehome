import {
  validateCreateStudentData,
  validateUpdateStudentData,
} from "utils/validateStudentdata";
import db from "../db/knex";
import { Student, CreateStudentDTO, UpdateStudentDTO } from "types";
import { AppError, ConflictError, NotFoundError } from "../errors/AppErrors";

export class StudentService {
  public async createStudent(data: CreateStudentDTO): Promise<Student> {
    validateCreateStudentData(data);

    try {
      const [insertId] = await db("students").insert(data);
      const newStudent = await db("students").where({ id: insertId }).first();
      return newStudent;
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY" || error.message.includes("UNIQUE")) {
        throw new ConflictError("Student email already exists");
      }
      throw new AppError("Failed to create student");
    }
  }

  public async getAllStudents(): Promise<Student[]> {
    const students = await db("students");
    return students;
  }

  public async getStudentById(id: number): Promise<Student> {
    const student = await db("students").where({ id }).first();

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    return student;
  }

  public async updateStudent(
    id: number,
    updates: UpdateStudentDTO
  ): Promise<Student> {
    const existingStudent = await db("students").where({ id }).first();
    if (!existingStudent) {
      throw new NotFoundError(`Student with id ${id} does not exist.`);
    }

    validateUpdateStudentData(updates);

    try {
      await db("students").where({ id }).update(updates);
      const updatedStudent = await db("students").where({ id }).first();
      return updatedStudent;
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY" || error.message.includes("UNIQUE")) {
        throw new ConflictError("Student email already exists");
      }
      throw new AppError("Failed to update student");
    }
  }

  public async deleteStudent(id: number): Promise<void> {
    const deleted = await db("students").where({ id }).del();
    if (deleted === 0) {
      throw new NotFoundError("Student not found");
    }
  }

  public async searchStudents(searchTerm: string): Promise<Student[]> {
    if (!searchTerm || searchTerm.trim() === "") {
      return this.getAllStudents();
    }

    const formattedTerm = `%${searchTerm}%`;

    try {
      const students = await db("students")
        .where("name", "like", formattedTerm)
        .orWhere("email", "like", formattedTerm)
        .orderBy("name", "asc");

      return students;
    } catch (error) {
      throw new AppError("Failed to search students");
    }
  }
}

export const studentService = new StudentService();
