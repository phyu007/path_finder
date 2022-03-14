import styled from "styled-components";

export const InputGroup = styled.div`
  display: flex;
  max-width: 350px;
`;

export const InputGroupLabel = styled.div`
  display: flex;
  flex-grow: 0;
  border: 0.5px solid #1a252f;
  background-color: #1a252f;
  padding: 7px 15px;
  height: 34px;
`;

export const InputGroupText = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  > div {
    width: 100%;
    position: relative;
    input {
      border: 0;
      display: block;
      width: 100%;
      padding: 7px 12px;
      color: #333;
      font-size: 1em;
      line-height: 1.3em;
      background-color: #f8f8f8;
    }
  }
`;

export const ListItem = styled.div`
  padding: 10px 15px;
  background-color: #f8f8f8;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #e1e1e1;
  }
`;

export const ListHeader = styled(ListItem)`
  background-color: #e3e3e3;
  cursor: text;
  &:hover {
    background-color: #e3e3e3;
  }
`;

export const Container = styled.div`
  display: flex;
  > div {
    padding: 0 10px 20px 10px;
  }
`;
