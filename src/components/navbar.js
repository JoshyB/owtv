import styled from "styled-components";
import React, { Component } from "react";
import { BrowserRouter as router, withRouter } from "react-router-dom";
import auth from "./auth";
import io from "socket.io-client";

const Nav = styled.nav`
  display: grid;
  background: #663399;
  align-items: center;
  grid-auto-flow: column;
  padding: 10px;
  justify-content: space-between;

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
`;

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    auth.deAuthenticateUser();
    this.props.history.push("/login");
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
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            {auth.userIsAuthenticated() ? null : <a href="/login">Login</a>}
          </li>
          <li>
            {auth.userIsAuthenticated() ? (
              <a href="#" onClick={this.logout}>
                Logout
              </a>
            ) : null}
          </li>
        </ul>
      </Nav>
    );
  }
}

export default withRouter(Navbar);
