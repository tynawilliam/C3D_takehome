export interface Student {
  id: number;
  name: string;
  email: string;
  graduation_year?: number;
  phone_number?: string;
  gpa?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateStudentDTO {
  name: string;
  email: string;
  graduation_year?: number;
  phone_number?: string;
  gpa?: number;
}

export interface UpdateStudentDTO {
  name?: string;
  email?: string;
  graduation_year?: number;
  phone_number?: string;
  gpa?: number;
}
