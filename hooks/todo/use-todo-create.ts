import { db } from "@/lib/db/db";
import { createTodoWithTasks } from "@/lib/db/todos";
import type { TodoCategory } from "@/types/todo-types";
import { useState } from "react";

type CreateResultMode = "success" | "failed";

type CreateTodoPayload = {
  category: TodoCategory;
  tasks: string[];
  content: string;
  date: string;
};

type UseTodoCreateParams = {
  refreshTodos: () => void;
  closeCreateModal: () => void;
};

export function useTodoCreate({
  refreshTodos,
  closeCreateModal,
}: UseTodoCreateParams) {
  const [isCreateResultOpen, setIsCreateResultOpen] = useState(false);
  const [createResultMode, setCreateResultMode] =
    useState<CreateResultMode>("success");

  const closeCreateResultModal = () => {
    setIsCreateResultOpen(false);
  };

  const handleCreateTodo = (payload: CreateTodoPayload) => {
    try {
      createTodoWithTasks(db, payload);
      closeCreateModal();
      refreshTodos();
      setCreateResultMode("success");
      setIsCreateResultOpen(true);
    } catch {
      closeCreateModal();
      setCreateResultMode("failed");
      setIsCreateResultOpen(true);
    }
  };

  return {
    isCreateResultOpen,
    createResultMode,
    closeCreateResultModal,
    handleCreateTodo,
  };
}
