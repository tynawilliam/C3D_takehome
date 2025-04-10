import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";

describe("SearchBar Component", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders with correct placeholder text", () => {
      render(<SearchBar {...defaultProps} />);
      expect(
        screen.getByPlaceholderText("Search students…")
      ).toBeInTheDocument();
    });

    test("renders search button with correct text", () => {
      render(<SearchBar {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Search" })
      ).toBeInTheDocument();
    });

    test("renders input with correct aria-label", () => {
      render(<SearchBar {...defaultProps} />);
      expect(screen.getByLabelText("Search students")).toBeInTheDocument();
    });

    test("displays the provided value in the input", () => {
      const value = "test query";
      render(<SearchBar {...defaultProps} value={value} />);
      expect(screen.getByLabelText("Search students")).toHaveValue(value);
    });

    test("applies the correct CSS classes", () => {
      render(<SearchBar {...defaultProps} />);
      expect(screen.getByTestId("search-form")).toHaveClass("wrapper");
      expect(screen.getByLabelText("Search students")).toHaveClass("input");
      expect(screen.getByRole("button", { name: "Search" })).toHaveClass(
        "button"
      );
    });
  });

  describe("Interactions", () => {
    test("calls onChange handler when input value changes", async () => {
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByLabelText("Search students");

      await userEvent.type(input, "a");
      expect(defaultProps.onChange).toHaveBeenCalledWith("a");

      await userEvent.type(input, "bc");
      expect(defaultProps.onChange).toHaveBeenCalledTimes(3);
      expect(defaultProps.onChange).toHaveBeenLastCalledWith("c");
    });

    test("calls onSubmit handler when form is submitted via button click", () => {
      render(<SearchBar {...defaultProps} />);
      const button = screen.getByRole("button", { name: "Search" });

      fireEvent.click(button);
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    test("calls onSubmit handler when form is submitted via Enter key", () => {
      render(<SearchBar {...defaultProps} />);
      const form = screen.getByRole("form");

      fireEvent.submit(form);
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    test("prevents default form submission behavior", () => {
      render(<SearchBar {...defaultProps} />);
      const form = screen.getByRole("form");

      const event = new Event("submit", { bubbles: true, cancelable: true });

      jest.spyOn(event, "preventDefault");

      form.dispatchEvent(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty search value", () => {
      render(<SearchBar {...defaultProps} value="" />);
      const form = screen.getByRole("form");

      fireEvent.submit(form);
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    test("handles whitespace-only search value", () => {
      render(<SearchBar {...defaultProps} value="   " />);
      const form = screen.getByRole("form");

      fireEvent.submit(form);
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    test("handles extremely long search query", () => {
      const longText = "a".repeat(1000);
      render(<SearchBar {...defaultProps} value={longText} />);

      expect(screen.getByLabelText("Search students")).toHaveValue(longText);

      const form = screen.getByRole("form");
      fireEvent.submit(form);
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    test('input type is "search"', () => {
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByLabelText("Search students");
      expect(input).toHaveAttribute("type", "search");
    });

    test("handles rapid consecutive submissions correctly", () => {
      render(<SearchBar {...defaultProps} />);
      const form = screen.getByRole("form");

      fireEvent.submit(form);
      fireEvent.submit(form);
      fireEvent.submit(form);

      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    test("search input has accessible name", () => {
      render(<SearchBar {...defaultProps} />);
      expect(
        screen.getByRole("searchbox", { name: "Search students" })
      ).toBeInTheDocument();
    });

    test("form has correct role", () => {
      render(<SearchBar {...defaultProps} />);
      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    test("form submits on Enter key from input", async () => {
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByLabelText("Search students");

      await userEvent.type(input, "{enter}");
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
