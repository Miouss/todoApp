import { Dispatch, useState } from "react";
import {
  TodoItemAction,
  TodoItemType,
  TodoItemActionType,
  UpdateButton,
  DeleteButton,
} from "./App";
import styled from "styled-components";

interface TodoItemProps extends TodoItemType {
  setTodos: Dispatch<TodoItemAction>;
}

export function TodoItem({ id, title, isChecked, setTodos }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleCheck = (id: string) => {
    setTodos({ type: TodoItemActionType.CHECK, payload: { id } });
  };

  const handleDelete = (id: string) => {
    setTodos({ type: TodoItemActionType.DELETE, payload: { id } });
  };

  const handleUpdate = (e: any, id: string) => {
    if (e.key !== "Enter") return;

    setTodos({
      type: TodoItemActionType.UPDATE,
      payload: { id, title: e.target.value },
    });
    setIsUpdating(false);
  };

  return (
    <ItemWrapper>
      <CheckBox type="checkbox" checked={isChecked} readOnly />

      <Item
        onClick={() => !isUpdating && handleCheck(id)}
        checked={isChecked}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isUpdating ? (
          <Input autoFocus type="text" onKeyDown={(e) => handleUpdate(e, id)} />
        ) : (
          <Title>{title}</Title>
        )}
        {isHovering && !isUpdating && (
          <DeleteButton onClick={() => handleDelete(id)}>X</DeleteButton>
        )}
      </Item>
      <UpdateButton onClick={() => setIsUpdating(true)}>?</UpdateButton>
    </ItemWrapper>
  );
}

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Item = styled.div<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 2rem;
  cursor: pointer;
  text-decoration: ${({ checked }) => (checked ? "line-through" : "none")};
`;

const Title = styled("span")`
  margin-left: 10px;
`;

const Input = styled("input")`
  width: 100%;
  height: 100%;
`;

const CheckBox = styled("input")`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;
