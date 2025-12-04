"use client";

import { MoreHorizontal, Trash2, FilePenLine, UserRoundX } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Student } from "@/lib/types";

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

export function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  return (
    <div className="rounded-lg border bg-card mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Student ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead className="text-right">GPA</TableHead>
            <TableHead className="w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-48 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <UserRoundX className="h-12 w-12" />
                  <p className="font-medium">No students found.</p>
                  <p className="text-sm">Try adjusting your search or adding a new student.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow
                key={student.id}
                className={cn(
                  student.gpa > 8.0 && "bg-accent/30"
                )}
              >
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{format(student.dob, "PPP")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    {student.gpa.toFixed(2)}
                    {student.gpa > 8.0 && <Badge variant="outline" className="border-green-600 bg-green-100 text-green-800">High Achiever</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(student)}>
                        <FilePenLine className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(student.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
