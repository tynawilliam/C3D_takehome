import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Student } from "../types";
import styles from "./StudentForm.module.css";

interface StudentFormProps {
  initialValues?: Partial<Student>;
  onSubmit: (data: Partial<Student>) => void;
  error?: string;
}

const StudentForm: React.FC<StudentFormProps> = ({
  initialValues,
  onSubmit,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<Student>>();

  const currentYear = new Date().getFullYear();
  const minGraduationYear = currentYear - 50;

  useEffect(() => {
    reset(
      initialValues ?? {
        name: "",
        email: "",
        graduation_year: undefined,
        phone_number: "",
        gpa: undefined,
      }
    );
  }, [initialValues, reset]);

  const handleFormSubmit: SubmitHandler<Partial<Student>> = (data) => {
    onSubmit(data);
    if (!initialValues) {
      reset({
        name: "",
        email: "",
        graduation_year: undefined,
        phone_number: "",
        gpa: undefined,
      });
    }
  };

  return (
    <>
      {error && <div className={styles.formError}>{error}</div>}

      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        {/* Name */}
        <div className={styles.fieldGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
            className={styles.input}
          />
          {errors.name && (
            <p className={styles.errorText}>{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Invalid email format",
              },
            })}
            className={styles.input}
          />
          {errors.email && (
            <p className={styles.errorText}>{errors.email.message}</p>
          )}
        </div>

        {/* Graduation Year */}
        <div className={styles.fieldGroup}>
          <label htmlFor="graduation_year" className={styles.label}>
            Graduation Year
          </label>
          <input
            id="graduation_year"
            type="number"
            {...register("graduation_year", {
              min: {
                value: minGraduationYear,
                message: `Graduation year cannot be before ${minGraduationYear}`,
              },
              max: {
                value: currentYear,
                message: `Graduation year cannot be in the future`,
              },
            })}
            className={styles.input}
          />
          {errors.graduation_year && (
            <p className={styles.errorText}>{errors.graduation_year.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className={styles.fieldGroup}>
          <label htmlFor="phone_number" className={styles.label}>
            Phone Number
          </label>
          <input
            id="phone_number"
            type="tel"
            {...register("phone_number", {
              pattern: {
                value: /^\d{10}$/,
                message: "Valid phone number required",
              },
            })}
            className={styles.input}
          />
          {errors.phone_number && (
            <p className={styles.errorText}>{errors.phone_number.message}</p>
          )}
        </div>

        {/* GPA */}
        <div className={styles.fieldGroup}>
          <label htmlFor="gpa" className={styles.label}>
            GPA
          </label>
          <input
            id="gpa"
            type="number"
            step="0.01"
            {...register("gpa", {
              min: { value: 0, message: "Minimum GPA is 0.0" },
              max: { value: 4.0, message: "Maximum GPA is 4.0" },
            })}
            className={styles.input}
          />
          {errors.gpa && (
            <p className={styles.errorText}>{errors.gpa.message}</p>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          {initialValues ? "Update Student" : "Add Student"}
        </button>
      </form>
    </>
  );
};

export default StudentForm;
