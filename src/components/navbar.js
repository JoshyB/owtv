import styled from "styled-components";
import React, { Component } from "react";
import { BrowserRouter as router, withRouter } from "react-router-dom";
import auth from "./auth";
import UserList from "./userList";
import StreamInput from "./streamInput";
import LogoutWithSocket from "./logoutButton";
import peoplePic from "../images/people.svg";
import tvPic from "../images/livetv.svg";

import SocketContext from "../context/socket-context";

const Nav = styled.nav`
  height: auto;
  display: flex;
  background: #663399;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);

  .navigation {
    list-style: none;
    display: flex;
    z-index: 900;

    a {
      color: white;
      margin: auto 10px;
      font-size: 1.2rem;

      &:hover {
        color: #e6e6e6;
      }
    }
  }

  .logo {
    display: flex;
  }
`;

const UserListButton = styled.button`
  font-size: 1.4rem;
  margin: 5px 20px auto auto;
  outline: none;
  background: none;
  border: none;

  img {
    margin-bottom: 3px;
  }

  &:hover {
    transform: scale(1.4);
  }
`;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserList: false,
      showStreamInput: false
    };

    this.logout = this.logout.bind(this);
    this.toggleUserList = this.toggleUserList.bind(this);
    this.toggleStreamInput = this.toggleStreamInput.bind(this);
  }

  toggleUserList() {
    this.setState(prevState => {
      return { showUserList: !prevState.showUserList };
    });
  }

  toggleStreamInput() {
    this.setState(prevState => {
      return { showStreamInput: !prevState.showStreamInput };
    });
  }

  logout() {
    auth.deAuthenticateUser();
    this.props.history.push("/login");
  }

  //check the route location and render the appropriate link in the navbar
  // I.E. If you are on the login view, change the link to the register view and vice versa
  renderLink(location) {
    switch (location) {
      case "/login":
        return <a href="/register">Register</a>;
      case "/register":
        return <a href="/login">Login</a>;
      case "/":
        return null;
    }
  }

  render() {
    return (
      <Nav>
        <div className="logo">
          <a href="/">
            <h1>OWTV</h1>
          </a>
        </div>
        <ul className="navigation">
          {auth.userIsAdmin() ? (
            <li>
              <UserListButton onClick={this.toggleStreamInput}>
                <img src={tvPic} />
              </UserListButton>
            </li>
          ) : null}
          <li>
            {auth.userIsAuthenticated() ? (
              <UserListButton onClick={this.toggleUserList}>
                <img src={peoplePic} />
              </UserListButton>
            ) : null}
          </li>
          <li>{this.renderLink(this.props.location.pathname)}</li>
          <li>{auth.userIsAuthenticated() ? <LogoutWithSocket /> : null}</li>
        </ul>
        {auth.userIsAdmin() ? (
          <StreamInput showStream={this.state.showStreamInput} />
        ) : null}
        {auth.userIsAuthenticated() ? (
          <UserList showList={this.state.showUserList} />
        ) : null}
      </Nav>
    );
  }
}

export default withRouter(Navbar);
