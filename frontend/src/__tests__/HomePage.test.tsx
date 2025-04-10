import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../pages/HomePage";
import { useStudents } from "../hooks/useStudents";
import { Student } from "../types";

jest.mock("../hooks/useStudents");

const mockStudent: Student = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  graduation_year: 2025,
  phone_number: "1234567890",
  gpa: 3.8,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("HomePage", () => {
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  const setupUseStudents = (
    override?: Partial<ReturnType<typeof useStudents>>
  ) => {
    (useStudents as jest.Mock).mockReturnValue({
      students: [mockStudent],
      isLoading: false,
      isError: false,
      error: null,
      createStudent: mockCreate,
      updateStudent: mockUpdate,
      deleteStudent: mockDelete,
      ...override,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupUseStudents();
  });

  test("renders header, search, form, and list", () => {
    render(<HomePage />);
    const addStudentElements = screen.getAllByText("Add Student");

    expect(screen.getByText("Student Management System")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(addStudentElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Student List")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  test("displays loading state", () => {
    setupUseStudents({ isLoading: true });
    render(<HomePage />);
    expect(screen.getByText("Loading students...")).toBeInTheDocument();
  });

  test("displays error state", () => {
    setupUseStudents({
      isError: true,
      error: new Error("Network error"),
    });
    render(<HomePage />);
    expect(screen.getByText(/failed to load students/i)).toBeInTheDocument();
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  test("submits new student form", async () => {
    render(<HomePage />);
    await userEvent.type(screen.getByLabelText("Name"), "John");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");

    await userEvent.click(screen.getByRole("button", { name: /add student/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John",
          email: "john@example.com",
        }),
        expect.any(Object)
      );
    });
  });

  test("handles form submission error and shows message", async () => {
    mockCreate.mockImplementation((_data, { onError }) => {
      onError({ response: { data: { error: "Bad request" } } });
    });

    render(<HomePage />);
    await userEvent.type(screen.getByLabelText("Name"), "Bad");
    await userEvent.type(screen.getByLabelText("Email"), "fail@example.com");
    await userEvent.click(screen.getByRole("button", { name: /add student/i }));

    expect(await screen.findByText("Bad request")).toBeInTheDocument();
  });

  test("switches to edit mode when edit is clicked", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update student/i })
    ).toBeInTheDocument();
  });

  test("updates student data", async () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("Edit"));

    const nameInput = screen.getByLabelText("Name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Alice Updated");

    await userEvent.click(
      screen.getByRole("button", { name: /update student/i })
    );

    expect(mockUpdate).toHaveBeenCalledWith({
      id: 1,
      data: expect.objectContaining({ name: "Alice Updated" }),
    });
  });

  test("deletes student when delete is clicked", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  test("search input changes query", async () => {
    render(<HomePage />);
    await userEvent.type(screen.getByRole("searchbox"), "bob");
    await userEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("searchbox")).toHaveValue("bob");
  });
});
