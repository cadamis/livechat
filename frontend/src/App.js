import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Header from './components/header';
import Login from './components/login';
import ChatRoom from './components/chatroom';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            channel: "Room 1",
            chatLog: [],
        };
        this.socket = new WebSocket('ws://localhost:8000/chat/');
        this.socket.onopen = () => this.onConnect();

        this.nameSubmit = this.nameSubmit.bind(this);
    }

    onConnect() {
        this.socket.send(JSON.stringify({
            type: "Connection",
            data: {
                message: "You need to print this"
            }
        }));
    }

    nameSubmit(name) {
        console.log("Setting name to", name);
        this.setState({username: name});
    }

    render() {
        if (this.state.username === "") {
            return (
                <div>
                    <Header/>
                    <Grid>
                        <Login nameSubmit={this.nameSubmit}/>
                    </Grid>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <Header/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={2}>
                                Channel List
                            </Col>
                            <Col xs={10}>
                                <ChatRoom socket={this.socket} username={this.state.username} channel={this.state.channel}/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );

        }
    }
}

export default App;
