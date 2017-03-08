import React from 'react';
import { Jumbotron, Button, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formInput: "",
        };

        this.nameSubmit = this.nameSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    nameSubmit(ev) {
        ev.preventDefault();
        this.props.nameSubmit(this.state.formInput);
    }

    onInputChange(ev) {
        this.setState({formInput: ev.target.value});
    }

    render() {
        return (
            <Jumbotron>
                <h3>Please enter your name</h3>
                <Form inline onSubmit={this.nameSubmit}>
                    <FormGroup controlId="formInlineName">
                      <ControlLabel>Name</ControlLabel>
                      {' '}
                      <FormControl type="text" onChange={this.onInputChange} value={this.state.formInput} autoFocus/>
                    </FormGroup>
                    {' '}
                    <Button type="submit">
                      Join Chat
                    </Button>
                </Form>
            </Jumbotron>
        )
    }
}

export default Login;