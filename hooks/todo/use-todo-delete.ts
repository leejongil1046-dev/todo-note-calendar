import { db } from "@/lib/db/db";
import { deleteTodo, type TodoForDate } from "@/lib/db/todos";
import { useState } from "react";

type DeleteResultMode = "success" | "failed";

type UseTodoDeleteParams = {
  refreshTodos: () => void;
};

export function useTodoDelete({ refreshTodos }: UseTodoDeleteParams) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteResultOpen, setIsDeleteResultOpen] = useState(false);
  const [deleteResultMode, setDeleteResultMode] =
    useState<DeleteResultMode>("success");
  const [targetTodo, setTargetTodo] = useState<TodoForDate | null>(null);

  const handleRequestDeleteTodo = (todo: TodoForDate) => {
    setTargetTodo(todo);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmOpen(false);
  };

  const closeDeleteResultModal = () => {
    setIsDeleteResultOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!targetTodo) return;

    setIsDeleteConfirmOpen(false);

    requestAnimationFrame(() => {
      const deletedCount = deleteTodo(db, targetTodo.todoId);

      if (deletedCount > 0) {
        refreshTodos();
        setDeleteResultMode("success");
      } else {
        setDeleteResultMode("failed");
      }

      setIsDeleteResultOpen(true);
      setTargetTodo(null);
    });
  };

  return {
    isDeleteConfirmOpen,
    isDeleteResultOpen,
    deleteResultMode,
    handleRequestDeleteTodo,
    handleConfirmDelete,
    closeDeleteConfirmModal,
    closeDeleteResultModal,
  };
}
