import { Dispatch } from "react";
import { TodoItemAction, TodoItemActionType, TodoItemType } from "./App";

import { DeleteButton } from "./styled";

import styled from "styled-components";

interface TodoSearchBarProps {
  todos: TodoItemType[];
  setTodos: Dispatch<TodoItemAction>;
}
export function TodoSearchBar({ todos, setTodos }: TodoSearchBarProps) {
  const handleAdd = (e: any) => {
    if (e.key === "Enter") {
      setTodos({
        type: TodoItemActionType.ADD,
        payload: { title: e.target.value },
      });
    }
  };

  const handleDelTodos = () => {
    const choice = confirm("Are you sure you want to delete all todos ?");
    choice && setTodos({ type: TodoItemActionType.DELETE_ALL });
  };

  const hasTodos = todos.length > 0;

  return (
    <BarWrapper>
      <AddBar onKeyDown={handleAdd} />
      {hasTodos && <DeleteButton onClick={handleDelTodos}>X</DeleteButton>}
    </BarWrapper>
  );
}

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
