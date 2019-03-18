import React, { Component } from "react";
import styled from "styled-components";
import auth from "../auth";

//imported components
import Chat from "../chat";
import TwitchFeed from "../twitchFeed";

const HomePage = styled.section`
  height: 100%;
  width: 100%;
  background: #333;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      id: ""
    };
  }

  componentDidMount() {
    const user = auth.decodeToken().user;
    this.setState({ username: user.username, id: user.userID });
  }

  render() {
    return (
      <HomePage>
        <Chat userID={this.state.id} username={this.state.username} />
        <section>
          <TwitchFeed />
        </section>
      </HomePage>
    );
  }
}

export default Home;
