import React, { Component } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import UserList from "../userList";
import SocketContext from "../../context/socket-context";
import auth from "../auth";

//imported components
import Chat from "../chat";
// import TwitchFeed from "../twitchFeed";
import TwitchFeedWithSocket from "../twitchFeed";

const HomePage = styled.section`
  height: calc(100vh - 64px);
  width: 100%;
  background: #333;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
  position: relative;
  z-index: -2;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 1fr;
  }
`;

// const socket = io.connect();

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
          <TwitchFeedWithSocket />
        </section>
      </HomePage>
    );
  }
}

export default Home;
