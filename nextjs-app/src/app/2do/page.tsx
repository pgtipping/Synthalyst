"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast-migration";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import VoiceInput from "./components/VoiceInput";
import CalendarView from "./components/CalendarView";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function TodoPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch("/api/2do/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data.tasks);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch tasks";
        setError(errorMessage);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [session?.user?.email]);

  const handleTaskCreate = async (task: Omit<Task, "id">) => {
    try {
      const response = await fetch("/api/2do/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      setTasks((prev) => [data.task, ...prev]);
      toast({
        title: "Success",
        description: "Task created successfully.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create task";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/2do/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const data = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? data.task : task))
      );
      toast({
        title: "Success",
        description: "Task updated successfully.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update task";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/2do/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    try {
      const response = await fetch("/api/2do/process-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error("Failed to process voice input");
      }

      const data = await response.json();
      handleTaskCreate(data.task);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process voice input";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">2Do</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to manage your tasks.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">2Do</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">2Do</h1>
          <Card className="p-4 bg-red-50 text-red-700">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "2Do", href: "/2do", active: true },
          ]}
        />

        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">2Do Task Manager</h1>
          <VoiceInput
            isRecording={isRecording}
            onStart={() => setIsRecording(true)}
            onStop={() => setIsRecording(false)}
            onTranscript={handleVoiceInput}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card className="p-6">
                  <TaskList
                    tasks={tasks}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="today">
                <Card className="p-6">
                  <TaskList
                    tasks={tasks.filter(
                      (task) =>
                        new Date(task.dueDate).toDateString() ===
                        new Date().toDateString()
                    )}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="upcoming">
                <Card className="p-6">
                  <TaskList
                    tasks={tasks.filter(
                      (task) => new Date(task.dueDate) > new Date()
                    )}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="completed">
                <Card className="p-6">
                  <TaskList
                    tasks={tasks.filter((task) => task.status === "completed")}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <TaskForm
                onCreate={handleTaskCreate}
                selectedDate={selectedDate}
              />
            </div>
          </div>

          <div>
            <Card className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              <div className="mt-6">
                <CalendarView
                  tasks={tasks}
                  selectedDate={selectedDate}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
