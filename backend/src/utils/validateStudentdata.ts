import { CreateStudentDTO, UpdateStudentDTO } from "types";

const MIN_GPA = 0.0;
const MAX_GPA = 4.0;
const CURRENT_YEAR = new Date().getFullYear();
const MAX_YEAR = CURRENT_YEAR + 10;
const MIN_YEAR = CURRENT_YEAR - 50;

export function validateCreateStudentData(data: CreateStudentDTO): void {
  const { name, email, graduation_year, phone_number, gpa } = data;

  if (!name || !email) {
    throw new Error("Name and email are required.");
  }

  validateCommonFields({ name, email, graduation_year, phone_number, gpa });
}

export function validateUpdateStudentData(data: UpdateStudentDTO): void {
  validateCommonFields(data);
}

function validateCommonFields(
  data: Partial<CreateStudentDTO | UpdateStudentDTO>
): void {
  const { name, email, graduation_year, phone_number, gpa } = data;

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format.");
    }
  }

  if (name !== undefined) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      throw new Error("Name must contain only letters and spaces.");
    }
  }

  if (graduation_year !== undefined) {
    if (graduation_year < MIN_YEAR || graduation_year > MAX_YEAR) {
      throw new Error(
        `Graduation year must be between ${MIN_YEAR} and ${MAX_YEAR}.`
      );
    }
  }

  if (phone_number !== undefined) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone_number)) {
      throw new Error("Invalid phone number format.");
    }
  }

  if (gpa !== undefined) {
    if (gpa < MIN_GPA || gpa > MAX_GPA) {
      throw new Error(`GPA must be between ${MIN_GPA} and ${MAX_GPA}.`);
    }
  }
}
