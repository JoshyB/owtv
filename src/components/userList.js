import React, { useState, useEffect } from "react";
import SocketContext from "../context/socket-context";
import auth from "./auth";
import styled from "styled-components";

const UserListWrapper = styled.section`
  width: 240px;
  height: 500px;
  background: #663399;
  border-radius: 0 0rem 0.3rem 0.4rem;
  ul {
    list-style: none;
    li {
      color: #ecd444;
      font-size: 1.3rem;
      border-bottom: 1px solid RGB(62, 65, 71);
      padding: 10px;
    }
  }
`;

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
    });

    props.socket.on("updateListOfUsersOnDisconnect", users => {
      updateUserList([...users]);
    });
  }, []);

  return (
    <UserListWrapper>
      <ul>
        {userList.map(user => {
          return <li>{user.username}</li>;
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
