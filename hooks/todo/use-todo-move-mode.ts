import { useCallback, useEffect, useMemo, useState } from "react";

import { db } from "@/lib/db/db";
import { updateTodoOrdersAsync, type TodoForDate } from "@/lib/db/todos";
import type { TodoSummary } from "@/types/calendar-types";

type UseTodoMoveModeParams = {
  todos: TodoForDate[];
  setTodos: React.Dispatch<React.SetStateAction<TodoForDate[]>>;
  visible: boolean;
  dateString?: string;
  onTodoSummaryChanged: (dateString: string, summary: TodoSummary) => void;
};

const buildTodoSummaryFromTodos = (todos: TodoForDate[]): TodoSummary => {
  return {
    count: todos.length,
    previews: todos.slice(0, 3).map((todo) => ({
      categoryName: todo.categoryName,
      categoryColor: todo.categoryColor,
    })),
  };
};

export function useTodoMoveMode({
  todos,
  setTodos,
  visible,
  dateString,
  onTodoSummaryChanged,
}: UseTodoMoveModeParams) {
  const [activeMoveTodoId, setActiveMoveTodoId] = useState<number | null>(null);

  const isMoveMode = useMemo(() => {
    return activeMoveTodoId !== null;
  }, [activeMoveTodoId]);

  const handleActivateMoveMode = useCallback((todoId: number) => {
    setActiveMoveTodoId(todoId);
  }, []);

  const handleExitMoveMode = useCallback(() => {
    setActiveMoveTodoId(null);
  }, []);

  const moveTodoByStep = useCallback(
    (todoId: number, direction: "up" | "down") => {
      const currentIndex = todos.findIndex((todo) => todo.todoId === todoId);
      if (currentIndex === -1) return;

      const nextIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0 || nextIndex >= todos.length) return;

      const nextTodos = [...todos];
      const [movedTodo] = nextTodos.splice(currentIndex, 1);
      nextTodos.splice(nextIndex, 0, movedTodo);

      setTodos(nextTodos);

      if (dateString) {
        onTodoSummaryChanged(dateString, buildTodoSummaryFromTodos(nextTodos));
      }

      void updateTodoOrdersAsync(
        db,
        nextTodos.map((todo) => todo.todoId),
      );
    },
    [todos, setTodos, dateString, onTodoSummaryChanged],
  );

  const handleMoveTodoUp = useCallback(
    (todoId: number) => {
      moveTodoByStep(todoId, "up");
    },
    [moveTodoByStep],
  );

  const handleMoveTodoDown = useCallback(
    (todoId: number) => {
      moveTodoByStep(todoId, "down");
    },
    [moveTodoByStep],
  );

  useEffect(() => {
    if (!visible) {
      setActiveMoveTodoId(null);
    }
  }, [visible]);

  useEffect(() => {
    setActiveMoveTodoId(null);
  }, [dateString]);

  return {
    activeMoveTodoId,
    isMoveMode,
    handleActivateMoveMode,
    handleExitMoveMode,
    handleMoveTodoUp,
    handleMoveTodoDown,
  };
}
