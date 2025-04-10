import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentList from "../components/StudentList";
import { Student } from "../types";

const baseStudent: Student = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  graduation_year: 2025,
  phone_number: "1234567890",
  gpa: 3.75,
  created_at: new Date("2023-01-01").toISOString(),
  updated_at: new Date("2023-01-01").toISOString(),
};

describe("StudentList", () => {
  test("renders empty state", () => {
    render(
      <StudentList students={[]} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.getByText("No students found.")).toBeInTheDocument();
  });

  test("renders a list of students with all fields", () => {
    render(
      <StudentList
        students={[baseStudent]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText(baseStudent.name)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${baseStudent.email}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Graduation Year: ${baseStudent.graduation_year}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Phone: ${baseStudent.phone_number}`)
    ).toBeInTheDocument();
    expect(screen.getByText("GPA: 3.75")).toBeInTheDocument();
    const expectedDate = new Date(baseStudent.created_at).toLocaleDateString();
    expect(screen.getByText(`Created: ${expectedDate}`)).toBeInTheDocument();
  });

  test("handles missing optional fields gracefully", () => {
    const partialStudent: Student = {
      ...baseStudent,
      graduation_year: undefined,
      phone_number: "",
      gpa: undefined,
    };

    render(
      <StudentList
        students={[partialStudent]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.queryByText(/Graduation Year:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Phone:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/GPA:/)).not.toBeInTheDocument();
  });

  test("calls onEdit with correct student when edit is clicked", () => {
    const onEdit = jest.fn();
    render(
      <StudentList
        students={[baseStudent]}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledWith(baseStudent);
  });

  test("calls onDelete with correct ID when delete is clicked", () => {
    const onDelete = jest.fn();
    render(
      <StudentList
        students={[baseStudent]}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledWith(baseStudent.id);
  });

  test("does not call edit or delete without interaction", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(
      <StudentList
        students={[baseStudent]}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(onEdit).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  test("renders multiple students correctly", () => {
    const students = [
      { ...baseStudent, id: 1, name: "Alice" },
      { ...baseStudent, id: 2, name: "Bob" },
    ];
    render(
      <StudentList
        students={students}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("renders GPA with 2 decimal places", () => {
    const student: Student = { ...baseStudent, gpa: 3.123456 };
    render(
      <StudentList
        students={[student]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("GPA: 3.12")).toBeInTheDocument();
  });

  test("renders created date in user-readable format", () => {
    const student: Student = {
      ...baseStudent,
      created_at: "2024-06-01T00:00:00.000Z",
    };
    render(
      <StudentList
        students={[student]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText(/Created: /)).toBeInTheDocument();
  });
});
