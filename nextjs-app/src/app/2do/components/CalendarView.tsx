"use client";

import { useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/types/task";

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

export default function CalendarView({
  tasks,
  selectedDate,
  onTaskUpdate,
}: CalendarViewProps) {
  const selectedTasks = useMemo(
    () =>
      tasks.filter((task) => isSameDay(new Date(task.dueDate), selectedDate)),
    [tasks, selectedDate]
  );

  const handleStatusChange = async (taskId: string, completed: boolean) => {
    await onTaskUpdate(taskId, {
      status: completed ? "completed" : "todo",
      completedAt: completed ? new Date().toISOString() : undefined,
    });
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">
        Tasks for {format(selectedDate, "MMMM d, yyyy")}
      </h3>

      {selectedTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No tasks scheduled for this date.
        </p>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {selectedTasks.map((task) => (
              <Card key={task.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={(checked) =>
                          handleStatusChange(task.id, checked as boolean)
                        }
                      />
                      <div>
                        <CardTitle
                          className={`text-sm ${
                            task.status === "completed" ? "line-through" : ""
                          }`}
                        >
                          {task.title}
                        </CardTitle>
                        {task.description && (
                          <CardDescription className="text-xs mt-1">
                            {task.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={getPriorityColor(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                    {task.tags?.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {task.reminderAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Reminder: {format(new Date(task.reminderAt), "h:mm a")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
