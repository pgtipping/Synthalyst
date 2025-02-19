// Prompt template for adding a new task.
export const addTaskPrompt = (taskText: string) =>
  `Add the following task to the task list: ${taskText}`;

// Prompt template for deleting a task.
export const deleteTaskPrompt = (taskId: number) =>
  `Delete the task with ID ${taskId} from the task list`;

// Prompt template for updating a task.
export const updateTaskPrompt = (taskId: number, newTaskText: string) =>
  `Update the task with ID ${taskId} to: ${newTaskText}`;

// Interface for the LLM response.
export interface LlamaResponse {
  completion: string;
}
