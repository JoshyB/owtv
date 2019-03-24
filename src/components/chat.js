import React, { Component } from "react";
import styled from "styled-components";
import io from "socket.io-client";

//components
import ChatMessages from "./chatMessages";

const ChatWrap = styled.section`
  background: RGB(54, 57, 63);
  height: calc(100vh - 64px);
  display: grid;
  grid-template-rows: 1fr auto;

  .messageBox {
    width: 100%;
    padding: 5px 0;
    display: flex;
    border-top: 1px solid #222;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 10px;

    input {
      background: RGB(70, 74, 82);
      width: 90%;
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

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //variable where the text from the input box is stored temporarily until it is submitted to socket.io backend
      addMessage: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.socket = io.connect();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.addMessage) {
      this.socket.emit("chatMessage", {
        userID: this.props.userID,
        username: this.props.username,
        message: this.state.addMessage
      });
      document.getElementById("addMsg").reset();
      this.setState({ addMessage: "" });
    }
  }

  componentWillUnmount() {
    this.socket.off();
  }

  render() {
    return (
      <ChatWrap>
        <ChatMessages />
        <form onSubmit={this.handleSubmit} className="messageBox" id="addMsg">
          <input
            name="addMessage"
            autoComplete="off"
            type="text"
            placeholder="Message"
            onChange={this.handleChange}
          />
        </form>
      </ChatWrap>
    );
  }
}

export default Chat;
