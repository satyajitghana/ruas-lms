import React, { Component } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faUserCircle, faIdCard, faIndustry, faAward, faPhone } from '@fortawesome/free-solid-svg-icons'
import logo from './msruas_logo_symbol.png'

import axios from 'axios';
import { BASE_URL } from './Api';
import { Formik } from 'formik';
import * as yup from 'yup';

import "./Register.css"
import { Redirect, Link } from 'react-router-dom';

const tranlucentbg = { backgroundColor: 'rgba(77, 94, 114, 0.5)' };

const registerSchema = yup.object({
    user_name: yup.string().required(),
    password: yup.string().required(),
    reg_no: yup.string().required(),
    name: yup.string().required(),
    department: yup.string().required(),
    course: yup.string().required(),
    contact_no: yup.string().required(),
})

class Register extends Component {

    registerUser(user) {
        axios.post(BASE_URL + 'student/register', user)
            .then((res) => {
                this.props.history.replace('/login');
            })
            .catch(console.error);
    }

    RegisterForm() {
        return (
            <Formik
                validationSchema={registerSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    this.registerUser(values);
                    setSubmitting(false);
                }}
                initialValues={{
                    user_name: '',
                    password: '',
                    reg_no: '',
                    name: '',
                    department: 'CSE',
                    course: 'B.Tech',
                    contact_no: '',
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
                        <div>
                            <Row>
                                <Col lg={6} className="border-right">
                                    <Form className="my-2">
                                        <Form.Group>
                                            <Form.Label >Username</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text className="bg-light text-dark" ><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="user_name" value={values.user_name} onChange={handleChange} placeholder="17ETCS002159" />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Password</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text className="bg-light text-dark" > <FontAwesomeIcon icon={faLock} />  </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="password" name="password" value={values.password} onChange={handleChange} placeholder="************" />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col lg={6}>
                                    <Form className="my-2">
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text className="bg-light text-dark" ><FontAwesomeIcon icon={faUserCircle} /></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Satyajit Ghana" />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>USN Number</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text className="bg-light text-dark" ><FontAwesomeIcon icon={faIdCard} /></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="reg_no" value={values.reg_no} onChange={handleChange} placeholder="17ETCS002159" />
                                            </InputGroup>
                                        </Form.Group>
                                        <Row>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>Department</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text className="bg-light text-dark" ><FontAwesomeIcon icon={faIndustry} /></InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <Form.Control as="select" name="department" value={values.department} onChange={handleChange} >
                                                            <option>CSE</option>
                                                            <option>EEE</option>
                                                            <option>ECE</option>
                                                            <option>CIVIL</option>
                                                        </Form.Control>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>Course</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text className="bg-light text-dark" ><FontAwesomeIcon icon={faAward} /></InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <Form.Control as="select" name="course" value={values.course} onChange={handleChange} >
                                                            <option>B.Tech</option>
                                                            <option>M.Tech</option>
                                                        </Form.Control>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group>
                                            <Form.Label>Contact No.</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text className="bg-light text-dark" ><FontAwesomeIcon icon={faPhone} /></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="contact_no" value={values.contact_no} onChange={handleChange} placeholder="7892137665" />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Button variant="dark" className="mt-5 mb-0 mx-auto px-5" onClick={handleSubmit} >Register</Button>
                            </Row>
                        </div>
                    )}
            </Formik>
        );
    }

    render() {
        return (
            <Container className="register-page fill-window" fluid>
                <Container>
                    <Row className="m-auto" >

                        <Col sm={8} md={8} lg={10} className="mx-auto my-auto">
                            <Card className="shadow shadow-lg my-5 p-5 text-white rounded" style={tranlucentbg} text="white">
                                <Row className="mb-3 mx-auto">
                                    <Col sm={2} md={2} lg={2} className="ml-auto"><Card.Img variant="top" src={logo} /></Col>
                                    <Col sm={6} md={6} lg={4} className="h1 my-auto font-weight-bold mr-auto" >RUAS LMS </Col>
                                </Row>
                                <Row className="h1 mx-auto mb-4">Register</Row>
                                {this.RegisterForm()}
                                <Row>
                                    <Button variant="link text-light m-0 p-0 ml-auto text-right mb-0"> <Link to="/login">Back to Login </Link></Button>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Container>
        )
    }
}

export default Register;
