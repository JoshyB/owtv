import React, { Component } from "react";
import styled from "styled-components";

import SocketContext from "../context/socket-context";

const InputWrapper = styled.aside`
  background: #663399;
  border-radius: 0 0 0.3rem 0.3rem;
  position: absolute;
  opacity: ${props => (props.open ? "1" : "0")};
  width: 50%;
  top: 100%;
  right: ${props => (props.open ? "0" : "-100%")};
  box-shadow: inset 0 2px 0 0 rgba(0, 0, 0, 0.4);
  transition: all 0.4s ease-in-out;

  @media (max-width: 1024px) {
    width: 100%;
  }

  #URLInput {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px 8px;
    input {
      background: RGB(70, 74, 82);
      width: 70%;
      margin: 10px auto;
      color: #fff;
      font-size: 1.1rem;
      border: 1px solid #222;
      border-radius: 0.2rem;
      padding: 8px;
      height: 40px;
    }

    button {
      width: 70%;
      padding: 5px 10px;
      margin: auto 10px;
      border-radius: 0.3rem;
      background: cornflowerblue;
      font-size: 1.4rem;
      color: white;
    }
  }
`;

class StreamInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeFeedURL: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateURL = this.validateURL.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    //check to see if value submitted is a URL
    if (this.state.changeFeedURL) {
      if (this.validateURL(this.state.changeFeedURL)) {
        //extract the streamers name from the url.
        // All twitch channel URLs are formated as so "https://www.twitch.tv/<USERNAME>" so we can just split the
        //URL at "/" and grab the last value from the array
        const splitTwitchURL = this.state.changeFeedURL.split("/");
        const streamersName = splitTwitchURL[splitTwitchURL.length - 1];
        //construct the embed stream URL using the streamer name taken from the url
        const twitchEmbedURL = `https://player.twitch.tv/?channel=${streamersName}&muted=true`;
        console.log(twitchEmbedURL);
        //emit the url to the backend
        this.props.socket.emit("changeTwitchFeed", {
          twitchFeedURL: twitchEmbedURL,
          streamersName: streamersName
        });
        document.getElementById("URLInput").reset();
        this.setState({ changeFeedURL: "" });
      } else {
        //if a username was submitted just pop it into the Twitch embed URL
        const twitchEmbedURL = `https://player.twitch.tv/?channel=${
          this.state.changeFeedURL
        }&muted=true`;
        //emit the generated URL to the backend
        this.props.socket.emit("changeTwitchFeed", {
          twitchFeedURL: twitchEmbedURL,
          //if a username was submitted just emit whatever the name in state is
          streamersName: this.state.changeFeedURL
        });
        //clear the form
        document.getElementById("URLInput").reset();
        //clear whatever name is in state so it doesnt get resubmitted
        this.setState({ changeFeedURL: "" });
      }
    }
  }

  validateURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  render() {
    return (
      <InputWrapper open={this.props.showStream}>
        <form onSubmit={this.handleSubmit} id="URLInput">
          <input
            name="changeFeedURL"
            autoComplete="off"
            type="text"
            placeholder="Enter stream URL or Streamer name"
            onChange={this.handleChange}
          />
          <button>Change Stream</button>
        </form>
      </InputWrapper>
    );
  }
}

const StreamInputWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <StreamInput {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default StreamInputWithSocket;
