import { useEffect, useMemo, useState } from "react";

import { db } from "@/lib/db/db";
import type { TodoForDate } from "@/lib/db/todos";
import { updateAllTodoTasksDone, updateTodoTaskDone } from "@/lib/db/todos";

type UseTodoCardTasksParams = {
  todoId: number;
  initialTasks: TodoForDate["tasks"];
  interactionLocked: boolean;
};

export function useTodoCardTasks({
  todoId,
  initialTasks,
  interactionLocked,
}: UseTodoCardTasksParams) {
  const [tasks, setTasks] = useState(initialTasks);

  const completedCount = useMemo(() => {
    return tasks.filter((task) => task.isDone).length;
  }, [tasks]);

  const totalCount = tasks.length;

  const isAllDone = useMemo(() => {
    return totalCount > 0 && completedCount === totalCount;
  }, [completedCount, totalCount]);

  const handleToggleAllTasks = () => {
    if (interactionLocked) return;

    const nextDone = !isAllDone;

    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        isDone: nextDone,
      })),
    );

    updateAllTodoTasksDone(db, todoId, nextDone);
  };

  const handleToggleTask = (taskId: number) => {
    if (interactionLocked) return;

    const targetTask = tasks.find((task) => task.id === taskId);
    if (!targetTask) return;

    const nextDone = !targetTask.isDone;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isDone: nextDone } : task,
      ),
    );

    updateTodoTaskDone(db, todoId, taskId, nextDone);
  };

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  return {
    tasks,
    completedCount,
    totalCount,
    isAllDone,
    handleToggleAllTasks,
    handleToggleTask,
  };
}
