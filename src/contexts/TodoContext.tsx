'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Todo } from '@/lib/entities/Todo';
import { Comment } from '@/lib/entities/Comment';
import { parseTodoDates } from '@/utils/dateParser';

interface TodoWithComments extends Todo {
  comments?: Comment[];
}

interface TodoContextType {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  getTodoById: (id: number) => TodoWithComments | undefined;
  updateTodoInCache: (id: number, updates: Partial<Todo>) => void;
  deleteTodoFromCache: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const getTodoById = (id: number): TodoWithComments | undefined => {
    return todos.find(t => t.id === id);
  };

  const updateTodoInCache = (id: number, updates: Partial<Todo>) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => {
        if (todo.id === id) {
          const updated = { ...todo, ...updates };
          return parseTodoDates(updated);
        }
        return todo;
      })
    );
  };

  const deleteTodoFromCache = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, setTodos, getTodoById, updateTodoInCache, deleteTodoFromCache }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}

