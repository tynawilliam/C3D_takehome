import { Student } from "../types";

export function cleanStudentPayload(data: Partial<Student>): Partial<Student> {
  const cleaned: Partial<Student> = {};

  for (const [key, value] of Object.entries(data)) {
    if (
      value !== undefined &&
      value !== null &&
      (typeof value !== "string" || value.trim() !== "")
    ) {
      cleaned[key as keyof Student] = value as any;
    }
  }

  return cleaned;
}
