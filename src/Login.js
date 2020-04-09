import React, { Component } from 'react';

import './Login.css';
import { Row, Container, Card, Form, Col, InputGroup, Button, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import * as yup from 'yup';
import logo from './msruas_logo_symbol.png'
import { Redirect, Link } from 'react-router-dom';
import { Formik } from 'formik';
import axios from 'axios';
import { BASE_URL } from './Api';

const tranlucentbg = { backgroundColor: 'rgba(77, 94, 114, 0.5)' };

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
});

class Login extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user != null) {
            this.props.history.replace('/home');
            return;
        }
    }

    render() {
        return (
            <Container className="login-page fill-window" fluid>
                <Row className="m-auto" >
                    <Col sm={9} md={7} lg={6} className="mx-auto my-auto">
                        <Card className="login-card shadow shadow-lg my-5 p-5 text-white rounded" style={tranlucentbg} text="white">
                            <Row className="mb-3">
                                <Col sm={4} md={4} className="my-auto"><Card.Img variant="top" src={logo} /></Col>
                                <Col sm={8} md={8} lg={8} className="h1 my-auto font-weight-bold text-right" >RUAS LMS </Col>
                            </Row>
                            <Row className="h1 mx-auto"> Login </Row>

                            <Formik
                                validationSchema={schema}
                                onSubmit={(values, { setSubmitting, resetForm }) => {

                                    setSubmitting(true);

                                    axios.post(BASE_URL + 'student/login', { user_name: values.username, password: values.password })
                                        .then((res) => {
                                            console.log(res);

                                            localStorage.setItem('user', JSON.stringify(res.data.user));
                                            localStorage.setItem('token', res.data.token);

                                            resetForm();

                                            this.props.history.replace('/home');

                                        })
                                        .catch((err) => {
                                            console.error(err.response.data.message);
                                        });


                                    setSubmitting(false);
                                }}
                                initialValues={{
                                    username: '',
                                    password: '',
                                }}
                            >
                                {({
                                    handleSubmit,
                                    handleChange,
                                    handleBlur,
                                    values,
                                    touched,
                                    isValid,
                                    errors,
                                }) => (
                                        <Form className="my-2">
                                            <Form.Group>
                                                <Form.Label className="h6 mb-3" >Username</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text className="bg-light text-dark" ><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control type="text" name="username" value={values.username} onChange={handleChange} isInvalid={!!errors.username} placeholder="17ETCS002159" />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.username}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label className="h6 mb-3">Password</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text className="bg-light text-dark" > <FontAwesomeIcon icon={faLock} />  </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control type="password" name="password" values={values.password} onChange={handleChange} isInvalid={!!errors.password} placeholder="************" />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                            <Row className="mx-auto">
                                                <Button variant="dark" className="px-5 mt-3 mb-0 mx-auto" onClick={handleSubmit}>Login</Button>
                                            </Row>
                                        </Form>
                                    )}
                            </Formik>
                            <Button variant="link text-light ml-auto text-right mb-0"><Link to="/register">Register</Link> </Button>
                        </Card>
                    </Col>
                </Row>

            </Container>
        );
    }
}


export default Login;
