import React from 'react';
import { Grid, Navbar } from 'react-bootstrap';

class Header extends React.Component {
    render() {
        return (
            <Navbar>
                <Grid>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">PyWasatch Livechat</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                </Grid>
            </Navbar>
        )
    }
}

export default Header;