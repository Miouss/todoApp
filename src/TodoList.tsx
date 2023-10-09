import styled from "styled-components";
import { TodoItem } from "./TodoItem";
import { Dispatch } from "react";
import { TodoItemAction, TodoItemType } from "./App";

interface TodoListProps {
  todos: TodoItemType[];
  setTodos: Dispatch<TodoItemAction>;
}

export function TodoList({ todos, setTodos }: TodoListProps) {
  const todosItems = todos.map((todo) => (
    <TodoItem key={todo.id} {...todo} setTodos={setTodos} />
  ));

  return <List>{todosItems}</List>;
}

const List = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin-left: 20%;
`;
