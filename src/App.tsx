import { useReducer } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { TodoItem } from "./TodoItem";

export interface TodoItemType {
  id: string;
  title: string;
  isChecked?: boolean;
}

export interface TodoItemAction {
  type: TodoItemActionType;
  payload?: any;
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

  const handleAdd = (e: any) => {
    if (e.key === "Enter") {
      setTodos({
        type: TodoItemActionType.ADD,
        payload: { title: e.target.value },
      });
    }
  };

  const todosItems = todos.map((todo) => (
    <TodoItem key={todo.id} {...todo} setTodos={setTodos} />
  ));

  const handleDelTodos = () => {
    const choice = confirm("Are you sure you want to delete all todos ?");
    choice && setTodos({ type: TodoItemActionType.DELETE_ALL });
  };

  const hasTodos = todos.length > 0;

  return (
    <>
      <BarWrapper>
        <AddBar onKeyDown={handleAdd} />
        {hasTodos && <DeleteButton onClick={handleDelTodos}>X</DeleteButton>}
      </BarWrapper>
      <List>{todosItems}</List>
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
      const { title } = action.payload;
      return saveTodos([
        ...todos,
        {
          id: uuidv4(),
          title,
          isChecked: false,
        },
      ]);
    case CHECK:
      const { id: checkedId } = action.payload;

      const updatedTodos = todos.map((todo) => {
        if (todo.id === checkedId) {
          return { ...todo, isChecked: !todo.isChecked };
        }
        return todo;
      });

      return saveTodos(reorderTodos(updatedTodos));
    case UPDATE: {
      const { id: modifiedId, title: newTitle } = action.payload;

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
      const { id: deletedId } = action.payload;

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

const List = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin-left: 20%;
`;

const BarWrapper = styled("div")`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddBar = styled("input")`
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
`;

const Button = styled("button")`
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

export const DeleteButton = styled(Button)`
  background-color: red;
  &:hover {
    background-color: darkred;
  }
`;

export const UpdateButton = styled(Button)`
  background-color: green;
  &:hover {
    background-color: darkgreen;
  }
`;
