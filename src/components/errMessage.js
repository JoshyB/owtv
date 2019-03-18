import { React } from "react";
import styled from "styled-components";

const ErrMessageList = styled.ul`
  list-style: none;
  margin: 0 auto;
  padding: 0;

  li {
    margin: 10px auto;
    color: white;
    text-align: center;
    background-color: #663399;
    padding: 10px;
    border: 2px solid red;
    border-radius: 0.3rem;
  }
`;

const ErrMessages = props => {
  return this.props.errors.map((err, index) => {
    return <li ley={index}>{err.message}</li>;
  });
};

export default ErrMessages;
