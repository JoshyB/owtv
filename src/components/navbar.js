import styled from "styled-components";
import React, { Component } from "react";
import { BrowserRouter as router, withRouter } from "react-router-dom";
import auth from "./auth";
import UserList from "./userList";
import peoplePic from "../images/people.svg";

const Nav = styled.nav`
  display: grid;
  background: #663399;
  align-items: center;
  grid-auto-flow: column;
  padding: 10px;
  justify-content: space-between;
  position: relative;
  z-index: 20;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);

  .navigation {
    list-style: none;
    display: flex;

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

  button {
    width: 50px;
    margin-left: 40px;
    font-size: 1.4rem;
    outline: none;
    background: none;
    border: none;

    &:hover {
      transform: scale(1.4);
    }
  }
`;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserList: false
    };

    this.logout = this.logout.bind(this);
    this.toggleUserList = this.toggleUserList.bind(this);
  }

  toggleUserList() {
    this.setState(prevState => {
      return { showUserList: !prevState.showUserList };
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
          <li>{this.renderLink(this.props.location.pathname)}</li>
          <li>
            <button onClick={this.toggleUserList}>
              <img src={peoplePic} />
            </button>
          </li>
          <li>
            {auth.userIsAuthenticated() ? (
              <a href="#" onClick={this.logout}>
                Logout
              </a>
            ) : null}
          </li>
        </ul>
        <UserList showList={this.state.showUserList} />
      </Nav>
    );
  }
}

export default withRouter(Navbar);
