import React, { Component } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import SplitPane from "react-split-pane";
import SocketContext from "../../context/socket-context";
import auth from "../auth";

//imported components
import Chat from "../chat";
// import TwitchFeed from "../twitchFeed";
import TwitchFeedWithSocket from "../twitchFeed";

const HomePage = styled.section`
  height: 100%;
  width: 100%;
  background: #333;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
`;

// const socket = io.connect();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      id: ""
    };

    this.socket = io.connect();
  }

  componentDidMount() {
    const user = auth.decodeToken().user;
    this.setState({ username: user.username, id: user.userID });
  }

  render() {
    return (
      <SocketContext.Provider value={this.socket}>
        <HomePage>
          <SplitPane split="vertical" defaultSize="50%">
            <Chat userID={this.state.id} username={this.state.username} />
            <section>
              <TwitchFeedWithSocket />
            </section>
          </SplitPane>
        </HomePage>
      </SocketContext.Provider>
    );
  }
}

export default Home;
