import styled, { css } from "styled-components";

export const BaseButton = css`
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  ${BaseButton}
  background-color: red;

  &:hover {
    background-color: darkred;
    text-decoration: none !important;
  }
`;
