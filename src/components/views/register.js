import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

const RegisterWrapper = styled.section`
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
    a {
      color: white;
      text-align: center;
      margin-top: 20px;
      font-size: 1.2rem;
      text-decoration: underline;
    }
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

class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      errors: [],
      otherError: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(e) {
    event.preventDefault();
    fetch("/api/registerUser", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
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
    }
    if (res.status === 422) {
      res
        .json()
        .then(res => this.setState({ errors: [...res.details] }))
        .then(this.clearForm);
    } else if (res.status === 433) {
      res
        .json()
        .then(res => this.setState({ errors: [...res] }))
        .then(this.clearForm);
    }
  }

  clearForm() {
    document.getElementById("registration").reset();
  }

  render() {
    //map over each error message in the errors [] and return an <li> with the message inside
    const errMessages = this.state.errors.map((err, index) => {
      //using the index as a unique key as it is predictable enough
      return <li key={index}>{err.message}</li>;
    });

    return (
      <RegisterWrapper>
        <form id="registration" onSubmit={this.handleSubmit}>
          <ul>{errMessages}</ul>
          <input
            name="email"
            type="text"
            placeholder="Email"
            onChange={this.handleChange}
            required
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            onChange={this.handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={this.handleChange}
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Re-enter Password"
            onChange={this.handleChange}
            required
          />
          <button>Register ➡</button>
          <a href="/">Already have an account? Login Here</a>
        </form>
      </RegisterWrapper>
    );
  }
}

export default withRouter(RegisterUser);
