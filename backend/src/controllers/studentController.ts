import { NextFunction, Request, Response } from "express";
import { studentService } from "services/studentService";
import { CreateStudentDTO, UpdateStudentDTO } from "../types";
import { ValidationError } from "errors/AppErrors";

//wrap async controller functions and forward errors to the error handler
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class StudentController {
  public createStudent = asyncHandler(async (req: Request, res: Response) => {
    const studentData: CreateStudentDTO = req.body;
    const newStudent = await studentService.createStudent(studentData);
    res.status(201).json(newStudent);
  });

  public getAllStudents = asyncHandler(async (req: Request, res: Response) => {
    const students = await studentService.getAllStudents();
    res.status(200).json(students);
  });

  public getStudentById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new ValidationError("Invalid student ID format");
    }

    const student = await studentService.getStudentById(id);
    res.status(200).json(student);
  });

  public updateStudent = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updateData: UpdateStudentDTO = req.body;

    if (isNaN(id)) {
      throw new ValidationError("Invalid student ID format");
    }

    if (Object.keys(updateData).length === 0) {
      throw new ValidationError("No update data provided");
    }

    const updatedStudent = await studentService.updateStudent(id, updateData);
    res.status(200).json(updatedStudent);
  });

  public deleteStudent = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new ValidationError("Invalid student ID format");
    }

    await studentService.deleteStudent(id);
    res.status(204).send();
  });
}

export const studentController = new StudentController();
