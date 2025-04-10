import React from "react";
import { Student } from "../types";
import styles from "./StudentList.module.css";

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  onEdit,
  onDelete,
}) => {
  if (students.length === 0) {
    return <p className={styles.label}>No students found.</p>;
  }

  return (
    <div className={styles.listContainer}>
      {students.map((student) => (
        <div key={student.id} className={styles.card}>
          <div className={styles.infoGroup}>
            <p className={styles.name}>{student.name}</p>
            <p className={styles.label}>Email: {student.email}</p>
            {student.graduation_year && (
              <p className={styles.label}>
                Graduation Year: {student.graduation_year}
              </p>
            )}
            {student.phone_number && (
              <p className={styles.label}>Phone: {student.phone_number}</p>
            )}
            {student.gpa !== undefined && (
              <p className={styles.label}>GPA: {student.gpa.toFixed(2)}</p>
            )}
            {student.created_at && (
              <p className={styles.meta}>
                Created: {new Date(student.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => onEdit(student)}
              className={`${styles.button} ${styles.edit}`}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(student.id)}
              className={`${styles.button} ${styles.delete}`}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
