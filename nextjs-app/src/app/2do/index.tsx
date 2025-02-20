"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { addTaskPrompt, updateTaskPrompt, deleteTaskPrompt } from "./prompts";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

// Add type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

const getTasksFromLocalStorage = () => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
};

export default function TwoDo() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>(getTasksFromLocalStorage());
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarEnabled, setCalendarEnabled] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Initialize speech recognition
  const recognition =
    typeof window !== "undefined"
      ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setNewTaskText(text);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setError("Failed to recognize speech");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const toggleListening = () => {
    if (!recognition) {
      setError("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setError(null);
      recognition.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!calendarEnabled) return;

      try {
        if (session?.user && session.user.accessToken) {
          setIsLoading(true);
          const res = await fetch("/api/calendar", {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          });
          if (!res.ok) {
            throw new Error(`Calendar API error: ${res.status}`);
          }
          const data = await res.json();
          setEvents(data.events);
          setCalendarError(null);
        }
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        setCalendarError(
          error instanceof Error
            ? error.message
            : "Failed to fetch calendar events"
        );
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [session, calendarEnabled]);

  const addTask = async () => {
    if (newTaskText.trim() === "") return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: addTaskPrompt(newTaskText),
        }),
      });
      if (!response.ok) {
        throw new Error(`Llama API request failed: ${response.status}`);
      }
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTaskText, completed: false },
      ]);
      setNewTaskText("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleComplete = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const task = tasks.find((task) => task.id === id);
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }
      const updatedTask = { ...task, completed: !task.completed };
      const response = await fetch("/api/llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: updateTaskPrompt(id, updatedTask.text),
        }),
      });
      if (!response.ok) {
        throw new Error(`Llama API request failed: ${response.status}`);
      }
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: deleteTaskPrompt(id) }),
      });
      if (!response.ok) {
        throw new Error(`Llama API request failed: ${response.status}`);
      }
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div>
        <p>Please sign in to access your calendar events.</p>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">2Do</h1>
      {isLoading && <p className="text-yellow-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {session && (
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={calendarEnabled}
              onChange={(e) => setCalendarEnabled(e.target.checked)}
              className="form-checkbox"
            />
            <span>Enable Calendar Integration</span>
          </label>
          {calendarError && (
            <p className="text-red-500 mt-2">{calendarError}</p>
          )}
        </div>
      )}

      <div className="mb-4 flex">
        <input
          type="text"
          id="newTask"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          title="Add a new task"
          className="border border-gray-300 px-3 py-2 rounded flex-grow"
        />
        <button
          onClick={toggleListening}
          className={`ml-2 ${
            isListening
              ? "bg-red-500 hover:bg-red-700"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
          title={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? "⏹️" : "🎤"}
        </button>
        <button
          id="addTask"
          onClick={addTask}
          disabled={isLoading}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add Task"}
        </button>
      </div>
      <ul className="list-disc list-inside">
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="mr-2"
                title={`Mark "${task.text}" as ${
                  task.completed ? "incomplete" : "complete"
                }`}
              />
              <span
                className={`${task.completed ? "line-through" : ""} ${
                  task.completed ? "text-gray-500" : "text-gray-900"
                }`}
              >
                {task.text}
              </span>
            </label>
            <button
              onClick={() => deleteTask(task.id)}
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              title={`Delete task "${task.text}"`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {calendarEnabled && events.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Calendar Events</h2>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="flex items-center space-x-2">
                <span className="text-blue-500">📅</span>
                <span className="font-medium">{event.summary}</span>
                <span className="text-gray-500">—</span>
                <span className="text-sm">
                  {new Date(event.start.dateTime).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
