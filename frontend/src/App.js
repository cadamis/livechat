import React, { Component } from 'react';
import { Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import Header from './components/header';
import Login from './components/login';
import ChatRoom from './components/chatroom';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            room: "Room 1",
        };
        this.socket = new WebSocket('ws://localhost:8000/chat/');

        this.nameSubmit = this.nameSubmit.bind(this);
        this.setRoom = this.setRoom.bind(this);
    }

    nameSubmit(name) {
        this.setState({username: name}, this.setRoom("Room 1"));

    }

    setRoom(room) {
        this.setState({room: room});
        this.socket.send(JSON.stringify({
            type: "JOIN_ROOM",
            data: {
                room: room,
            }
        }));
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
                                <ListGroup>
                                    <ListGroupItem onClick={this.setRoom.bind(this, "Room 1")}>
                                    Room 1
                                    </ListGroupItem>
                                    <ListGroupItem onClick={this.setRoom.bind(this, "Room 2")}>
                                    Room 2
                                    </ListGroupItem>
                                    <ListGroupItem onClick={this.setRoom.bind(this, "Room 3")}>
                                    Room 3
                                    </ListGroupItem>
                                </ListGroup>
                            </Col>
                            <Col xs={10}>
                                <ChatRoom socket={this.socket} username={this.state.username} room={this.state.room}
                                ref="chatroom"/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );

        }
    }
}

export default App;
