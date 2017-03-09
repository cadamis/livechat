import React from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            chatInput: "",
        };

        this.chatSubmit = this.chatSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onSocketData = this.onSocketData.bind(this);
        this.clearChat = this.clearChat.bind(this);
        this.setMessages = this.setMessages.bind(this);

        this.props.socket.onmessage = (m) => this.onSocketData(m);
    }

    chatSubmit(ev) {
        ev.preventDefault();
        this.props.socket.send(JSON.stringify({
            type: "MESSAGE",
            data: {
                username: this.props.username,
                room: this.props.room,
                message: this.state.chatInput,
            }
        }));
        this.setState({chatInput: ""});
    }

    onInputChange(ev) {
        this.setState({chatInput: ev.target.value});
    }

    onSocketData(message_event) {
        let data = JSON.parse(message_event.data);
        if (data['type'] === "MESSAGE_UPDATE") {
            let messages = this.state.messages;
            messages.unshift(data['data']);
            while(messages.length > 15) {
                messages.pop();
            }
            this.setState({messages: messages});
        }
        else if (data['type'] === "RECENT_MESSAGES") {
            this.setMessages(data['data'].messages);
        }
        else {
            console.log("Got unknown message event type: ", data['type']);
        }
    }

    setMessages(messages) {
        this.setState({messages: messages});
    }

    clearChat(messages) {
        this.setState({messages: []});
    }

    render() {
        let messageWindow = this.state.messages.map( (line, index) => (
            <ListGroupItem key={index}>
                <div><strong>{line.username}</strong>: {line.message}</div>
            </ListGroupItem>
        ));
        return (
            <div>
                <Form inline onSubmit={this.chatSubmit}>
                    <FormGroup controlId="formInlineName">
                      <ControlLabel>Message</ControlLabel>
                      {' '}
                      <FormControl type="text" onChange={this.onInputChange} value={this.state.chatInput} autoFocus/>
                    </FormGroup>
                    {' '}
                    <Button type="submit">Send to {this.props.room}</Button>
                </Form>
                <Panel header={this.props.room}>
                    <ListGroup>
                        {messageWindow}
                    </ListGroup>
                </Panel>
            </div>
        )
    }
}

export default ChatRoom;