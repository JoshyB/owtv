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
import ChatWithSocket from "../chat";

const HomePage = styled.section`
  height: inherit;
  width: 100%;
  background: #333;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
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
        <ChatWithSocket userID={this.state.id} username={this.state.username} />
        <TwitchFeedWithSocket />
      </HomePage>
    );
  }
}

export default Home;
