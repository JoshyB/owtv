import React, { useState, useEffect } from "react";
import SocketContext from "../context/socket-context";
import auth from "./auth";
import styled from "styled-components";

const UserList = props => {
  const [userList, updateUserList] = useState([]);

  useEffect(() => {
    const user = auth.decodeToken().user;

    props.socket.on("connect", () => {
      props.socket.emit("addUserOnConnect", {
        username: user.username,
        socketId: props.socket.id
      });
    });

    props.socket.on("addUsersToListOnConnect", users => {
      updateUserList([...users]);
      console.log(users);
    });

    props.socket.on("updateListOfUsersOnDisconnect", users => {
      updateUserList([...users]);
      console.log(users);
    });
  }, []);

  return (
    <ul>
      {userList.map(user => {
        return <li>{user.username}</li>;
      })}
    </ul>
  );
};

const UserListWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <UserList {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default UserListWithSocket;
