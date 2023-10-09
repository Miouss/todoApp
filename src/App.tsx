import { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { TodoList } from "./TodoList";
import { TodoSearchBar } from "./TodoSearchBar";

export interface TodoItemType {
  id: string;
  title: string;
  isChecked?: boolean;
  nb: number;
}

export interface TodoItemAction {
  type: TodoItemActionType;
  payload?: {
    id?: string;
    title?: string;
  };
}

export enum TodoItemActionType {
  ADD = "ADD",
  CHECK = "CHECK",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  DELETE_ALL = "DELETE_ALL",
}

export function App() {
  const [todos, setTodos] = useReducer(reducer, getSavedTodos());

  return (
    <>
      <TodoSearchBar todos={todos} setTodos={setTodos} />
      <TodoList todos={todos} setTodos={setTodos} />
    </>
  );
}

function reducer(todos: TodoItemType[], action: TodoItemAction) {
  const { ADD, CHECK, UPDATE, DELETE, DELETE_ALL } = TodoItemActionType;

  const saveTodos = (newTodos: TodoItemType[]): TodoItemType[] => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
    return newTodos;
  };

  const deleteAllTodos = (): TodoItemType[] => {
    localStorage.removeItem("todos");
    return [];
  };

  switch (action.type) {
    case ADD:
      const title = action.payload!.title!;

      const isTodoAlreadyExists = todos.some(
        (todo) => todo.title.toLowerCase() === title.toLowerCase()
      );

      let newTodos;

      if (isTodoAlreadyExists) {
        newTodos = todos.map((todo) => {
          if (todo.title.toLowerCase() === title.toLowerCase()) {
            return { ...todo, nb: todo.nb + 1 };
          }
          return todo;
        });
      } else {
        newTodos = [
          ...todos,
          {
            id: uuidv4(),
            title,
            isChecked: false,
            nb: 1,
          },
        ];
      }

      return saveTodos(newTodos);
    case CHECK:
      const checkedId = action.payload!.id!;

      const updatedTodos = todos.map((todo) => {
        if (todo.id === checkedId) {
          return { ...todo, isChecked: !todo.isChecked };
        }
        return todo;
      });

      return saveTodos(reorderTodos(updatedTodos));
    case UPDATE: {
      const newTitle = action.payload!.title!;
      const modifiedId = action.payload!.id!;

      const updatedTodos = todos.map((todo) => {
        const isModifiedTodo = todo.id === modifiedId;

        if (isModifiedTodo) {
          return { ...todo, title: newTitle };
        }

        return todo;
      });

      return saveTodos(updatedTodos);
    }
    case DELETE:
      const deletedId = action.payload!.id!;

      todos.find((todo, i) => {
        const isModifiedTodo = todo.id === deletedId;

        if (isModifiedTodo) {
          todos.splice(i, 1);
          return true;
        }
      });

      return saveTodos([...todos]);
    case DELETE_ALL:
      return deleteAllTodos();
  }
}

function reorderTodos(todos: TodoItemType[]) {
  const checkedTodos = todos.filter((todo) => todo.isChecked);
  const uncheckedTodos = todos.filter((todo) => !todo.isChecked);
  return [...uncheckedTodos, ...checkedTodos];
}

function getSavedTodos(): TodoItemType[] {
  const savedTodos = localStorage.getItem("todos");
  return savedTodos ? JSON.parse(savedTodos) : [];
}
