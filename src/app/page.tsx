"use client";

import { useState, useMemo } from "react";
import type { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/app/header";
import { StudentControls } from "@/components/app/student-controls";
import { StudentList } from "@/components/app/student-list";
import { StudentForm } from "@/components/app/student-form";
import { TopStudentCard } from "@/components/app/top-student-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialStudents: Student[] = [
  { id: "20IT001", name: "Nguyen Van A", dob: new Date("2002-05-15"), gpa: 8.5 },
  { id: "20IT025", name: "Tran Thi B", dob: new Date("2002-11-20"), gpa: 7.2 },
  { id: "19IT150", name: "Le Van C", dob: new Date("2001-01-30"), gpa: 9.1 },
  { id: "21CS010", name: "Pham My D", dob: new Date("2003-08-10"), gpa: 6.8 },
];

export default function Home() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const lowerQuery = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowerQuery) ||
        student.id.toLowerCase().includes(lowerQuery)
    );
  }, [students, searchQuery]);

  const handleAddClick = () => {
    setStudentToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setStudentToEdit(student);
    setIsFormOpen(true);
  };
  
  const handleDeleteConfirm = (studentId: string) => {
    setStudentToDelete(studentId);
  }

  const handleDelete = () => {
    if (!studentToDelete) return;
    setStudents(students.filter((s) => s.id !== studentToDelete));
    toast({
      title: "Student Deleted",
      description: "The student record has been successfully removed.",
    });
    setStudentToDelete(null);
  };

  const handleFormSubmit = (data: Student) => {
    if (studentToEdit) {
      setStudents(students.map((s) => (s.id === data.id ? data : s)));
      toast({
        title: "Student Updated",
        description: `${data.name}'s details have been updated.`,
      });
    } else {
      if (students.some(s => s.id === data.id)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Student with ID ${data.id} already exists.`,
        });
        return;
      }
      setStudents([data, ...students].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Student Added",
        description: `${data.name} has been added to the list.`,
      });
    }
    setIsFormOpen(false);
    setStudentToEdit(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid gap-8">
          <section>
            <TopStudentCard students={students} />
          </section>

          <section className="space-y-6">
             <StudentControls
              onAdd={handleAddClick}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
            />
            <StudentList
              students={filteredStudents}
              onEdit={handleEditClick}
              onDelete={handleDeleteConfirm}
            />
          </section>
        </div>
      </main>

      <StudentForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        studentToEdit={studentToEdit}
      />
      
      <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
