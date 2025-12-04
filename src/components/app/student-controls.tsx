"use client";

import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StudentControlsProps {
  onAdd: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function StudentControls({ onAdd, searchQuery, onSearch }: StudentControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or ID..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="w-full md:w-auto flex-grow " />
      <Button onClick={onAdd} className="w-full md:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Student
      </Button>
    </div>
  );
}
