import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./components/views/login";
import Home from "./components/views/home";
import RegisterUser from "./components/views/register";
import PrivateRoute from "./components/privateRoute";

import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Bungee|Josefin+Sans');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-weight: 900;
    font-size: 1rem;
    overflow-x: hidden;
    height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Bungee', cursive;
    color: #ffffff;
    text-shadow: -2px 2px #4ec0b2;
    -webkit-text-stroke: 1px #4ec0b2;
    font-size: 1.875rem;
    margin: 0 0 0.5rem 0;
  }

  a {
      text-decoration: none;
    }

  p {
    font-family: 'Josefin Sans', sans-serif;
  }
`;

const PageWrapper = styled.section`
  height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "Navigation"
    "Content";
`;

const App = props => (
  <Router>
    <PageWrapper>
      <GlobalStyle />
      <Navbar />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={RegisterUser} />
        <PrivateRoute exact path="/" component={Home} />
      </Switch>
    </PageWrapper>
  </Router>
);

render(<App />, document.getElementById("root"));
