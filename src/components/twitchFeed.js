import React, { Component } from "react";
import styled from "styled-components";
import auth from "./auth";

import SocketContext from "../context/socket-context";

const TwitchWrapper = styled.section`
  width: 100%;
  height: 100%;

  @media (max-width: 1024px) {
  }

  h6 {
    font-size: 1.2em;
    text-align: center;
    color: white;
    margin: 50px auto;

    @media (max-width: 1024px) {
      display: none;
    }
  }
`;

const VideoWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 500px;

  @media (max-width: 1024px) {
    width: 100%;
    height: 40vh;
    margin-top: 5px;
  }

  iframe {
    padding: 10px;
    width: 100%;
    max-height: 500px;
  }
`;

class TwitchFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      twitchFeed: []
    };
  }

  componentDidMount() {
    this.props.socket.emit("getCurrentTwitchStream");

    this.props.socket.on("receiveTwitchStream", res => {
      this.setState({ twitchFeed: res });
    });

    this.props.socket.on("newTwitchFeed", res => {
      this.setState({ twitchFeed: res });
    });
  }

  componentWillUnmount() {
    this.props.socket.off();
  }

  render() {
    return (
      <TwitchWrapper>
        <h6>
          {this.state.twitchFeed
            ? `Currently streaming ${
                this.state.twitchFeed.streamersName
              }'s channel`
            : ""}
        </h6>
        <VideoWrapper>
          <iframe
            src={this.state.twitchFeed.twitchFeedURL}
            height="100%" //500
            width="100%" //890
            frameBorder="0"
            scrolling="no"
            allowFullScreen={true}
          />
        </VideoWrapper>
      </TwitchWrapper>
    );
  }
}

const TwitchFeedWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <TwitchFeed {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default TwitchFeedWithSocket;
