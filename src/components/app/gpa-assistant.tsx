"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BrainCircuit, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { getGpaSuggestion } from "@/lib/actions";
import type { GpaCalculationAssistantOutput } from "@/ai/flows/gpa-calculation-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  grades: z.string().min(1, "Please enter at least one grade."),
});

export function GpaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<GpaCalculationAssistantOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grades: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setResult(null);
      const { output, error } = await getGpaSuggestion({ grades: values.grades });
      if (error) {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: error.message,
        });
        return;
      }
      setResult(output);
    });
  }
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setResult(null);
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BrainCircuit className="mr-2 h-4 w-4" />
          GPA Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">GPA Calculation Assistant</DialogTitle>
          <DialogDescription>
            Enter comma-separated grades (e.g., A, B+, C-) to get an AI-suggested GPA range.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="grades"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grades</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A+, B, C-, B+" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Suggest GPA Range"
              )}
            </Button>
          </form>
        </Form>
        {result && (
          <Card className="mt-4 animate-in fade-in">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Suggestion Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <h4 className="font-semibold">Suggested GPA Range:</h4>
                <p className="text-primary font-bold">{result.suggestedGpaRange}</p>
              </div>
              <div>
                <h4 className="font-semibold">Reasoning:</h4>
                <p className="text-sm text-muted-foreground">{result.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
