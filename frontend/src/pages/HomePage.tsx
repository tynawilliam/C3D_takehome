import React, { useState } from "react";
import StudentForm from "../components/StudentForm";
import StudentList from "../components/StudentList";
import { Student } from "../types";
import styles from "./HomePage.module.css";
import { cleanStudentPayload } from "../utils/cleanStudentPayload";
import { useStudents } from "../hooks/useStudents";
import SearchBar from "../components/SearchBar";

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    students,
    isLoading,
    isError,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents(searchQuery);

  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(
    null
  );

  const handleCreate = (studentData: Partial<Student>) => {
    const createPayload = cleanStudentPayload(studentData);
    createStudent(createPayload);
  };

  const handleUpdate = (studentData: Partial<Student>) => {
    if (!editingStudent?.id) return;

    const { name, email, graduation_year, phone_number, gpa } = studentData;
    const updatePayload = {
      ...(name && { name }),
      ...(email && { email }),
      ...(graduation_year && { graduation_year }),
      ...(phone_number && { phone_number }),
      ...(gpa !== undefined && { gpa }),
    };

    updateStudent({ id: editingStudent.id, data: updatePayload });
    setEditingStudent(null);
  };

  const handleDelete = (id: number) => {
    deleteStudent(id);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchTerm);
  };

  if (isLoading) {
    return <p className={styles.loadingText}>Loading students...</p>;
  }

  if (isError) {
    return (
      <p className={styles.errorText}>
        Failed to load students: {error?.message}
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Student Management System</h1>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onSubmit={handleSearchSubmit}
      />

      <section className={styles.sectionContainer}>
        <div className={styles.formContainer}>
          <h2 className={styles.sectionTitle}>
            {editingStudent ? "Edit Student" : "Add Student"}
          </h2>
          <StudentForm
            initialValues={editingStudent || undefined}
            onSubmit={editingStudent ? handleUpdate : handleCreate}
          />
        </div>

        <div className={styles.listContainer}>
          <h2 className={styles.sectionTitle}>Student List</h2>
          <StudentList
            students={students || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
