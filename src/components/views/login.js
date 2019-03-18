import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import styled from "styled-components";
import auth from "../auth";

//component styles
const LoginWrapper = styled.section`
  height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #444;

  form {
    grid-gap: 10px;
    display: grid;
    width: 30vw;
    min-width: 300px;

    input {
      font-size: 1.4rem;
      border-radius: 0.3rem;

      padding: 4px;
    }

    button {
      padding: 10px;
      border-radius: 0.3rem;
      background: cornflowerblue;
      font-size: 1.4rem;
      color: white;
    }
  }
  a {
    color: white;
    text-align: center;
    margin-top: 20px;
    font-size: 1.2rem;
    text-decoration: underline;
  }
  p {
    color: white;
    text-align: center;
    background-color: #663399;
    padding: 10px;
    border: 1px solid white;
    border-radius: 0.3rem;
  }

  ul {
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
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: [],
      toDashboard: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch("/api/userLogin", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    }).then(this.handleRedirect);
  }

  handleRedirect(res) {
    if (res.status === 200) {
      res
        .json()
        .then(res => localStorage.setItem("token", res.token))
        .then(() => {
          this.props.history.push("/");
        });
    } else {
      res.json().then(res => this.setState({ errors: [...res] }));
    }
  }

  componentDidMount() {
    if (auth.userIsAuthenticated()) {
      this.props.history.push("/");
    } else {
      localStorage.clear();
    }
  }

  render() {
    const errMessages = this.state.errors.map((err, index) => {
      return <li key={index}>{err.message}</li>;
    });

    return (
      <LoginWrapper>
        <form onSubmit={this.handleSubmit}>
          <ul>{errMessages}</ul>
          <input
            name="email"
            onChange={this.handleChange}
            type="text"
            placeholder="Email"
            required
          />
          <input
            name="password"
            onChange={this.handleChange}
            type="password"
            placeholder="Password"
            required
          />
          <button>Login ➡</button>
          <a href="/register">Dont have an account? Register Here</a>
        </form>
      </LoginWrapper>
    );
  }
}

export default withRouter(Login);
