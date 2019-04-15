import React, { Component } from "react";
import { BrowserRouter as router, withRouter } from "react-router-dom";
import styled from "styled-components";
import auth from "./auth";

import SocketContext from "../context/socket-context";

const LogoutButton = styled.button`
  padding: 5px 10px;
  margin: auto 10px;
  border-radius: 0.3rem;
  background: cornflowerblue;
  font-size: 1.4rem;
  color: white;
`;

class Logout extends Component {
  constructor(props) {
    super(props);

    this.logoutUser = this.logoutUser.bind(this);
  }

  logoutUser() {
    auth.deAuthenticateUser();
    this.props.history.push("/login");
    this.props.socket.off();
  }

  // componentWillUnmount() {
  //   this.props.socket.off();
  // }

  render() {
    return <LogoutButton onClick={this.logoutUser}>Logout</LogoutButton>;
  }
}

const LogoutWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Logout {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default withRouter(LogoutWithSocket);
