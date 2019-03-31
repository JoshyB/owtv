import styled from "styled-components";
import React, { Component } from "react";
import { BrowserRouter as router, withRouter } from "react-router-dom";
import auth from "./auth";

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
          <li>
            <a href="/">Home</a>
          </li>
          <li>{this.renderLink(this.props.location.pathname)}</li>
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
