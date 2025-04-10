import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "../types";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentService";

export function useStudents(searchTerm: string) {
  const queryClient = useQueryClient();

  const {
    data: students,
    error,
    isLoading,
    isError,
  } = useQuery<Student[], Error>({
    queryKey: ["students", searchTerm],
    queryFn: () => getStudents(searchTerm),
    enabled: searchTerm.trim().length === 0 ? true : !!searchTerm,
  });

  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: number; data: Partial<Student> }) =>
      updateStudent(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: any) => {
      console.error("Update failed:", error.response?.data || error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  return {
    students,
    error,
    isLoading,
    isError,
    createStudent: createMutation.mutate,
    updateStudent: updateMutation.mutate,
    deleteStudent: deleteMutation.mutate,
  };
}
