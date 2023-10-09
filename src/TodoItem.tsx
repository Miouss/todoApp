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

export function TodoItem(props: TodoItemProps) {
  const { id, isChecked, setTodos } = props;

  const [isUpdating, setIsUpdating] = useState(false);

  const handleCheck = () => {
    setTodos({ type: TodoItemActionType.CHECK, payload: { id } });
  };

  return (
    <ItemWrapper>
      <CheckBox
        type="checkbox"
        checked={isChecked}
        onClick={handleCheck}
        readOnly
      />
      <Item
        {...props}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        handleCheck={handleCheck}
      />
      <UpdateButton onClick={() => setIsUpdating(true)}>?</UpdateButton>
    </ItemWrapper>
  );
}

interface ItemProps extends TodoItemProps {
  isUpdating: boolean;
  setIsUpdating: Dispatch<boolean>;
  handleCheck: (id: string) => void;
}

function Item({
  id,
  title,
  nb,
  isUpdating,
  isChecked,
  setTodos,
  setIsUpdating,
  handleCheck,
}: ItemProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleUpdate = (e: any) => {
    if (e.key !== "Enter") return;

    setTodos({
      type: TodoItemActionType.UPDATE,
      payload: { id, title: e.target.value },
    });
    setIsUpdating(false);
  };

  const handleDelete = () => {
    setTodos({ type: TodoItemActionType.DELETE, payload: { id } });
  };

  const hasMultiple = nb > 1;

  return (
    <FlexCol
      onClick={() => !isUpdating && handleCheck(id)}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isUpdating ? (
        <Input autoFocus type="text" onKeyDown={handleUpdate} />
      ) : (
        <Title checked={isChecked}>
          {title} {hasMultiple && `x${nb}`}
        </Title>
      )}
      {isHovering && !isUpdating && (
        <DeleteButton onClick={handleDelete}>X</DeleteButton>
      )}
    </FlexCol>
  );
}

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FlexCol = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 2rem;
  cursor: pointer;
`;

const Title = styled.span<{ checked?: boolean }>`
  margin-left: 10px;
  text-decoration: ${({ checked }) => (checked ? "line-through" : "none")};
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
`;

const CheckBox = styled("input")`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;
