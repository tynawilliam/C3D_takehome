import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import StudentForm from "../components/StudentForm";
import { Student } from "../types";

describe("StudentForm", () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    error: "",
  };

  const fillForm = async (overrides = {}) => {
    const defaultValues = {
      name: "Jane Doe",
      email: "jane@example.com",
      graduation_year: new Date().getFullYear(),
      phone_number: "1234567890",
      gpa: 3.5,
      ...overrides,
    };

    await userEvent.type(screen.getByLabelText("Name"), defaultValues.name);
    await userEvent.type(screen.getByLabelText("Email"), defaultValues.email);
    await userEvent.type(
      screen.getByLabelText("Graduation Year"),
      defaultValues.graduation_year.toString()
    );
    await userEvent.type(
      screen.getByLabelText("Phone Number"),
      defaultValues.phone_number
    );
    await userEvent.type(
      screen.getByLabelText("GPA"),
      defaultValues.gpa.toString()
    );

    return defaultValues;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all form fields", () => {
    render(<StudentForm {...defaultProps} />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Graduation Year")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("GPA")).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    render(<StudentForm {...defaultProps} />);
    await fillForm();

    await userEvent.click(screen.getByRole("button", { name: /add student/i }));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      graduation_year: "2025",
      phone_number: "1234567890",
      gpa: "3.5",
    });
  });

  test("shows validation errors on empty required fields", async () => {
    render(<StudentForm {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /add student/i }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  test("Submit fails when email is invalid", async () => {
    render(<StudentForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText("Name"), "Jane Doe");
    await userEvent.type(screen.getByLabelText("Graduation Year"), "2020");
    await userEvent.type(screen.getByLabelText("Phone Number"), "1234567890");
    await userEvent.type(screen.getByLabelText("GPA"), "3.2");

    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "not-an-email");
    fireEvent.blur(emailInput);

    await userEvent.click(screen.getByRole("button", { name: /add student/i }));
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  test("shows phone number pattern error", async () => {
    render(<StudentForm {...defaultProps} />);
    await userEvent.type(screen.getByLabelText("Phone Number"), "abc");
    fireEvent.click(screen.getByRole("button", { name: /add student/i }));

    expect(
      await screen.findByText("Valid phone number required")
    ).toBeInTheDocument();
  });

  test("validates GPA range", async () => {
    render(<StudentForm {...defaultProps} />);
    await userEvent.type(screen.getByLabelText("GPA"), "5");
    fireEvent.click(screen.getByRole("button", { name: /add student/i }));

    expect(await screen.findByText("Maximum GPA is 4.0")).toBeInTheDocument();
  });

  test("validates graduation year boundaries", async () => {
    const year = new Date().getFullYear();
    const tooEarly = year - 51;
    const tooLate = year + 1;

    render(<StudentForm {...defaultProps} />);
    await userEvent.type(
      screen.getByLabelText("Graduation Year"),
      tooEarly.toString()
    );
    fireEvent.click(screen.getByRole("button", { name: /add student/i }));

    expect(
      await screen.findByText(`Graduation year cannot be before ${year - 50}`)
    ).toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText("Graduation Year"));
    await userEvent.type(
      screen.getByLabelText("Graduation Year"),
      tooLate.toString()
    );
    fireEvent.click(screen.getByRole("button", { name: /add student/i }));

    expect(
      await screen.findByText("Graduation year cannot be in the future")
    ).toBeInTheDocument();
  });

  test("renders initial values when provided", () => {
    const student: Partial<Student> = {
      name: "Bob",
      email: "bob@example.com",
      graduation_year: 2022,
      phone_number: "1112223333",
      gpa: 3.2,
    };

    render(<StudentForm {...defaultProps} initialValues={student} />);

    expect(screen.getByLabelText("Name")).toHaveValue(student.name);
    expect(screen.getByLabelText("Email")).toHaveValue(student.email);

    expect(screen.getByLabelText("Graduation Year")).toHaveValue(2022);
    expect(screen.getByLabelText("Phone Number")).toHaveValue(
      student.phone_number
    );
    expect(screen.getByLabelText("GPA")).toHaveValue(3.2);
  });

  test("displays server error if provided", () => {
    render(<StudentForm {...defaultProps} error="Oops, something failed." />);
    expect(screen.getByText("Oops, something failed.")).toBeInTheDocument();
  });

  test('displays "Update Student" when initial values exist', () => {
    render(
      <StudentForm {...defaultProps} initialValues={{ name: "existing" }} />
    );
    expect(screen.getByRole("button")).toHaveTextContent("Update Student");
  });
});
