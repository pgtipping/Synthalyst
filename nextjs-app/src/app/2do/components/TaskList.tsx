"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Calendar, Clock, Tag } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, completed: boolean) => {
    await onUpdate(taskId, {
      status: completed ? "completed" : "todo",
      completedAt: completed ? new Date().toISOString() : undefined,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`transition-shadow hover:shadow-md ${
            task.status === "completed" ? "opacity-75" : ""
          }`}
        >
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
                    className={`text-lg ${
                      task.status === "completed" ? "line-through" : ""
                    }`}
                  >
                    {task.title}
                  </CardTitle>
                  {task.description && (
                    <CardDescription className="mt-1">
                      {task.description}
                    </CardDescription>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      setExpandedTaskId(
                        expandedTaskId === task.id ? null : task.id
                      )
                    }
                  >
                    {expandedTaskId === task.id ? "Collapse" : "Expand"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onUpdate(task.id, {
                        priority:
                          task.priority === "high"
                            ? "low"
                            : task.priority === "low"
                            ? "medium"
                            : "high",
                      })
                    }
                  >
                    Change Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </Badge>
              {task.reminderAt && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(task.reminderAt)}
                </Badge>
              )}
              {task.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>

          {expandedTaskId === task.id && (
            <CardFooter className="flex flex-col items-start pt-4">
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="w-full mb-4">
                  <h4 className="font-semibold mb-2">Subtasks</h4>
                  <div className="space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={(checked) =>
                            onUpdate(task.id, {
                              subtasks: task.subtasks?.map((st) =>
                                st.id === subtask.id
                                  ? { ...st, completed: checked as boolean }
                                  : st
                              ),
                            })
                          }
                        />
                        <span
                          className={
                            subtask.completed
                              ? "line-through text-gray-500"
                              : ""
                          }
                        >
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {task.attachments && task.attachments.length > 0 && (
                <div className="w-full">
                  <h4 className="font-semibold mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {task.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
