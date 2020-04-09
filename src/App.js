import React from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Login from './Login'
import Register from './Register'
import StudentHome from './StudentHome'
import { Container, Navbar, Col, Row } from 'react-bootstrap';

function Footer() {
  return (

    <Container>
      <Navbar variant="dark" fixed="bottom">
        <Container>
          <Col lg={8} className="mx-auto">
            <Row>
              <h5 className="mx-auto">Made with <span role="img">💖</span> and <span role="img">☕</span> by shadowleaf</h5>
            </Row>
          </Col>
        </Container>

      </Navbar>
    </Container>
  )
}

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/home' component={StudentHome} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
