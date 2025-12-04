"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Student } from "@/lib/types";

const studentFormSchema = z.object({
  id: z.string().min(1, "Student ID is required."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gpa: z.coerce.number().min(0, "GPA cannot be negative.").max(10, "GPA must be between 0 and 10."),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Student) => void;
  studentToEdit?: Student | null;
}

export function StudentForm({ isOpen, onOpenChange, onSubmit, studentToEdit }: StudentFormProps) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
  });
  
  React.useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        form.reset(studentToEdit);
      } else {
        form.reset({ id: "", name: "", dob: undefined, gpa: 0 });
      }
    }
  }, [isOpen, studentToEdit, form]);

  const handleFormSubmit = (data: StudentFormValues) => {
    onSubmit(data);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {studentToEdit ? "Edit Student" : "Add New Student"}
          </DialogTitle>
          <DialogDescription>
            {studentToEdit ? "Update the student's details." : "Enter the details for the new student."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 20IT001" {...field} disabled={!!studentToEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1950-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPA (0-10 scale)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Student'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
