import React from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

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

        this.props.socket.onmessage = (m) => this.onSocketData(m);
    }

    chatSubmit(ev) {
        ev.preventDefault();
        this.props.socket.send(JSON.stringify({
            type: "MESSAGE",
            data: {
                username: this.props.username,
                channel: this.props.channel,
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
            this.state.messages.push(data['data']);
            this.setState({messages: this.state.messages});
        }
        else {
            console.log("Got unknown message event type: ", data['type']);
        }
    }

    render() {
        let messageWindow = this.state.messages.map( (line, index) => (
            <li key={index}>
                <div>{line.username}</div>
                <div>{line.message}</div>
            </li>
        ));
        return (
            <div>
                <ul>
                    {messageWindow}
                </ul>
                <Form inline onSubmit={this.chatSubmit}>
                    <FormGroup controlId="formInlineName">
                      <ControlLabel>Message</ControlLabel>
                      {' '}
                      <FormControl type="text" onChange={this.onInputChange} value={this.state.chatInput} autoFocus/>
                    </FormGroup>
                    {' '}
                    <Button type="submit">Send</Button>
                </Form>
            </div>
        )
    }
}

export default ChatRoom;