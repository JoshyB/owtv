import React, { Component } from "react";
import styled from "styled-components";
import SocketContext from "../context/socket-context";

const ChatMessagesWrap = styled.section`
  grid-area: chat;
  height: 100%;
  overflow: scroll;

  ul {
    padding: 0;
    margin: 0;
    li {
      height: auto;
      border-bottom: 1px solid RGB(62, 65, 71);
      padding: 10px;

      p.user {
        font-family: "bungee", cursive;
        font-size: 0.9rem;
        color: #ecd444;
        margin-bottom: 10px;
      }
      p.msg {
        color: white;
        margin-top: 5px;
      }
    }
  }
`;

class ChatMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };

    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  getMessages() {
    this.props.socket.emit("getChatMessages");
  }

  componentDidMount() {
    this.scrollToBottom();

    //when initially logging in socket.io doesnt connect or fire within the componentDidMount lifecycle method
    //but adding this function which emits an event that tells that server to send back all current messages works
    // *shrug*
    this.getMessages();

    this.props.socket.on("receiveChatMessages", messages => {
      this.setState({
        messages: [...messages]
      });
    });

    this.props.socket.on("addChatMessage", chatMessage => {
      this.setState({
        messages: [...this.state.messages, chatMessage]
      });
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const chatMsg = this.state.messages.map((msg, i) => {
      return (
        <li key={i}>
          <p className="user">{msg.username}</p>
          <p className="msg">{msg.message}</p>
        </li>
      );
    });

    return (
      <ChatMessagesWrap>
        <ul>{chatMsg}</ul>
        <div
          style={{ float: "left", clear: "both" }}
          ref={el => {
            this.messagesEnd = el;
          }}
        />
      </ChatMessagesWrap>
    );
  }
}

const ChatMessagesWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <ChatMessages {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatMessagesWithSocket;
