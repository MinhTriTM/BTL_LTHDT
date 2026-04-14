import { Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Student } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

function getInitials(name: string) {
  if (!name) return "??";
  let initials = "";
  let isWordStart = true;
  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    if (char === ' ') {
      isWordStart = true;
    } else if (isWordStart) {
      initials += char.toUpperCase();
      isWordStart = false;
      if (initials.length === 2) {
        break;
      }
    }
  }
  return initials || "??";
}

export function TopStudentCard({ students }: { students: Student[] }) {

  const topStudent = useMemo(() => {
    if (students.length === 0) return null;
    return students.reduce((prev, current) => (prev.gpa >= current.gpa ? prev : current));
  }, [students]);

  if (!topStudent) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Trophy className="w-8 h-8 text-muted-foreground" />
          <div>
            <CardTitle className="font-headline">Top Student</CardTitle>
            <CardDescription>No students in the list yet.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add students to see who has the highest GPA.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                Top Student
                </CardTitle>
                <CardDescription>The student with the highest GPA.</CardDescription>
            </div>
             <div className="font-bold text-primary text-2xl bg-primary/10 rounded-lg px-3 py-1">
                {topStudent.gpa.toFixed(2)}
                <span className="text-sm ml-1">GPA</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/50">
          <AvatarImage asChild src={`https://api.dicebear.com/8.x/initials/svg?seed=${topStudent.name}`}>
            <Image
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${topStudent.name}`}
                alt={topStudent.name}
                width={64}
                height={64}
            />
          </AvatarImage>
          <AvatarFallback>{getInitials(topStudent.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{topStudent.name}</p>
          <p className="text-sm text-muted-foreground">ID: {topStudent.id}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Add useMemo to avoid re-calculating on every render
import { useMemo } from 'react';
