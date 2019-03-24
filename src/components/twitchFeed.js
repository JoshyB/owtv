import React, { Component } from "react";
import styled from "styled-components";
import auth from "./auth";
import io from "socket.io-client";

const TwitchWrapper = styled.section`
  display: grid;
  grid-template-rows: 1fr;
  text-align: center;
`;

const VideoWrapper = styled.section`
  display: flex;
  flex-direction: column;
  padding: 20px;

  h6 {
    font-size: 1.2rem;
    text-align: center;
    color: white;
    margin-bottom: 50px;
  }
`;

const InputWrapper = styled.section`
  padding: 10px;

  #URLInput {
    width: 100%;
    /* padding: px 0; */
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 10px;

    input {
      background: RGB(70, 74, 82);
      width: 70%;
      margin: 10px auto;
      color: #fff;
      font-size: 1.1rem;
      border: 1px solid #222;
      border-radius: 0.2rem;
      padding: 10px;
      height: 50px;
    }
  }
`;

class TwitchFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeFeedURL: "",
      twitchFeed: []
    };

    this.socket = io.connect();
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
        //emit the url to the backend
        this.socket.emit("changeTwitchFeed", {
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
        this.socket.emit("changeTwitchFeed", {
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

  componentDidMount() {
    this.socket.on("getTwitchStream", res => {
      this.setState({ twitchFeed: res });
    });

    this.socket.on("newTwitchFeed", res => {
      this.setState({ twitchFeed: res });
    });
  }

  componentWillUnmount() {
    this.socket.off();
  }

  //check to see if a username or URL was submitted.
  //found this RegEx at https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
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
      <TwitchWrapper>
        {auth.userIsAdmin() ? (
          <InputWrapper>
            <form onSubmit={this.handleSubmit} id="URLInput">
              <input
                name="changeFeedURL"
                autoComplete="off"
                type="text"
                placeholder="Enter the live stream URL or the name of the streamer"
                onChange={this.handleChange}
              />
            </form>
          </InputWrapper>
        ) : null}

        <VideoWrapper>
          <h6>
            {this.state.twitchFeed
              ? `Currently streaming ${
                  this.state.twitchFeed.streamersName
                }'s channel`
              : ""}
          </h6>
          <iframe
            src={this.state.twitchFeed.twitchFeedURL}
            height="500"
            width="890"
            frameBorder="0"
            scrolling="no"
            allowFullScreen={true}
          />
        </VideoWrapper>
      </TwitchWrapper>
    );
  }
}

export default TwitchFeed;
