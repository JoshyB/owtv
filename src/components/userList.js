import React, { useState, useEffect } from "react";
import SocketContext from "../context/socket-context";
import auth from "./auth";
import styled from "styled-components";

const UserListWrapper = styled.section`
  min-width: 240px;
  opacity: ${props => (props.open ? "1" : "0")};
  height: ${props => (props.open ? "0" : "100%")};
  /* max-height: ${props => (props.open ? "0" : "100%")}; */
  position: absolute;
  right: ${props => (props.open ? "0" : "-240px")};
  z-index: -1;
  top: 100%;
  transition: all 0.3s ease-in-out;
  border-radius: 0 0rem 0.3rem 0.4rem;

  ul {
    list-style: none;
    background-color: #663399;
    height: calc(100vh - 64px);
    box-shadow: inset 0 2px 0 0 rgba(0, 0, 0, 0.4);

    li {
      color: #ecd444;
      font-family: "bungee", cursive;
      font-size: 1.3rem;
      /* border-bottom: 1px solid RGBA(188, 188, 188, 0.2); */
      padding: 10px;
    }
  }
`;

const UserList = props => {
  const [userList, updateUserList] = useState([]);

  function getUsers(user) {
    props.socket.emit("addUserOnConnect", {
      username: user.user.username,
      socketId: props.socket.id
    });
  }

  useEffect(() => {
    const user = auth.decodeToken();

    getUsers(user);
    // props.socket.on("connect", () => {
    //   props.socket.emit("addUserOnConnect", {
    //     username: user.user.username,
    //     socketId: props.socket.id
    //   });
    // });

    props.socket.on("addUsersToListOnConnect", users => {
      updateUserList([...users]);
    });

    props.socket.on("updateListOfUsersOnDisconnect", users => {
      updateUserList([...users]);
    });

    return () => {
      props.socket.close();
      props.socket.connect();
    };
  }, []);

  return (
    <UserListWrapper open={props.showList}>
      <ul>
        {userList.map((user, i) => {
          return <li key={i}>{user.username}</li>;
        })}
      </ul>
    </UserListWrapper>
  );
};

const UserListWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <UserList {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default UserListWithSocket;
