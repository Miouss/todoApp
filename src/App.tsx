import { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

const List = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin-left: 20%;
`;

const AddBar = styled("input")`
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  gap: 10px;
`;

const Item = styled.div<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 2rem;
  cursor: pointer;
  text-decoration: ${({ checked }) => (checked ? "line-through" : "none")};
`;

const Title = styled.span`
  margin-left: 10px;
`;

const CheckBox = styled("input")`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const DeleteButton = styled("button")`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

interface TodoItemType {
  id: string;
  title: string;
  isChecked?: boolean;
}

interface TodoItemProps extends TodoItemType {
  handleCheck: (id: string) => void;
  handleDelete: (id: string) => void;
}

export function App() {
  const [todos, setTodos] = useState<TodoItemType[]>([]);

  const TodoItem = ({
    id,
    title,
    isChecked,
    handleCheck,
    handleDelete,
  }: TodoItemProps) => {
    return (
      <ItemWrapper>
        <Item onClick={() => handleCheck(id)} checked={isChecked}>
          <CheckBox type="checkbox" checked={isChecked} readOnly />
          <Title>{title}</Title>
        </Item>
        <DeleteButton onClick={() => handleDelete(id)}>X</DeleteButton>
      </ItemWrapper>
    );
  };

  const addTodo = (newTodo: TodoItemType) => {
    setTodos([newTodo, ...todos]);
  };

  const handleCheck = (id: string) => {
    setTodos((todos) => {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isChecked: !todo.isChecked };
        }
        return todo;
      });

      const checkedTodos = updatedTodos.filter((todo) => todo.isChecked);
      const uncheckedTodos = updatedTodos.filter((todo) => !todo.isChecked);

      return [...uncheckedTodos, ...checkedTodos];
    });
  };

  const handleAdd = (e: any) => {
    if (e.key === "Enter") {
      const newTodo: TodoItemType = {
        id: uuidv4(),
        title: e.target.value,
        isChecked: false,
      };

      addTodo(newTodo);
    }
  };

  const handleDelete = (id: string) => {
    setTodos((todos) => {
      todos.find((todo, i) => {
        const isModifiedTodo = todo.id === id;

        if (isModifiedTodo) {
          todos.splice(i, 1);
          return true;
        }
      });

      return [...todos];
    });
  };

  const todosItems = todos.map((todo) => (
    <TodoItem
      key={todo.id}
      {...todo}
      handleCheck={handleCheck}
      handleDelete={handleDelete}
    />
  ));

  console.log(todos);

  return (
    <>
      <AddBar onKeyDown={handleAdd} />
      <List>{todosItems}</List>
    </>
  );
}
