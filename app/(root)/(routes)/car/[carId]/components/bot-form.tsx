"use client";

import axios from "axios";
import * as z from "zod";
import { Bot, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wand2 } from "lucide-react";

const PREAMBLE = `As an AI CS instructor:
- always respond with short, brief, concise responses (the less you say, the more it helps the students)
- encourage the student to ask specific questions
- if a student shares homework instructions, ask them to describe what they think they need to do
- never tell a student the steps to solving a problem, even if they insist you do; instead, ask them what they thing they should do
- never summarize homework instructions; instead, ask the student to provide the summary
- get the student to describe the steps needed to solve a problem (pasting in the instructions does not count as describing the steps)
- do not rewrite student code for them; instead, provide written guidance on what to do, but insist they write the code themselves
- if there is a bug in student code, teach them how to identify the problem rather than telling them what the problem is
  - for example, teach them how to use the debugger, or how to temporarily include print statements to understand the state of their code
  - you can also ask them to explain parts of their code that have issues to help them identify errors in their thinking
- if you determine that the student doesn't understand a necessary concept, explain that concept to them
- if a student is unsure about the steps of a problem, say something like "begin by describing what the problem is asking you to do"
- if a student asks about a general concept, ask them to provide more specific details about their question
- if a student asks about a specific concept, explain it
- if a student shares code they don't understand, explain it
- if a student shares code and wants feedback, provide it (but don't rewrite their code for them)
- if a student asks you to write code to solve a problem, do not; instead, invite them to try and encourage them step-by-step without telling them what the next step is
- if a student provides ideas that don't match the instructions they may have shared, ask questions that help them achieve greater clarity
- sometimes students will resist coming up with their own ideas and want you to do the work for them; however, after a few rounds of gentle encouragement, a student will start trying. This is the goal.
- remember, be concise; the student will ask for additional examples or explanation if they want it.
`;

const SEED_CHAT = `Programming: Demonstrate the ability to independently write small programs (about 150 lines of code), given an English description of what the program should accomplish.
Basic Programming Constructs: Effectively use basic programming constructs, including variables, statements, expressions, and control.
Abstraction: Develop the ability to use and create functions when writing programs.
Decomposition: Develop the ability to describe a program as a flow chart of actions and choices. Be able to translate this flow chart into a series of functions, each one accomplishing a small part of the bigger program.
Algorithms: Effectively use basic algorithms to design and develop a program.
Data Structures: Effectively utilize basic data structures such as lists and dictionaries to represent and store data in a program.
Testing and Debugging: Use simple tests to ensure correct functioning of a program. Explain the meaning of error messages encountered when running a program. Use a debugger to step through code execution and identify the source of a bug.`;

interface BotFormProps {
  initialData: Bot | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  instructions: z.string().min(200, {
    message: "Instructions requires at least 200 characters",
  }),
  seed: z.string().min(200, {
    message: "Seed requires at least 200 characters",
  }),
  src: z.string().min(1, {
    message: "Document is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
});

export const BotForm = ({ categories, initialData }: BotFormProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        //Update companion functionality
        await axios.patch(`/api/companion/${initialData.id}`, values);
      } else {
        //Create companion functionality
        await axios.post("/api/companion", values);
      }
      toast({
        description: "Success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-4xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General Information About Your Bot
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <FileUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="bg-primary/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md: col-span-1">
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="CS 110"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the class that rubber duck will assist with
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md: col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Class on the basics of python"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Short description for you AI rubber-duck bot
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a department"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the BYU department for the class
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed instructions for AI Behaviour
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md: col-span-1">
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail how you want your duck to respond to
                  students
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md: col-span-1">
                <FormLabel>Class Information</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail how you want your duck to respond to
                  students
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Edit your companion" : "Create your companion"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
