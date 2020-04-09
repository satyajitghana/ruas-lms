import React, { Component } from 'react';
import { Container, Row, Button, Col, Table, Card, Spinner, Modal, Form, InputGroup } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from './Api';
import { Formik } from 'formik';
import * as yup from 'yup';

import logo from './msruas_logo_symbol.png'

import './StudentHome.css'

const tranlucentbg = { backgroundColor: 'rgba(74, 177, 157, 0.8)' };

const projectRegisterSchema = yup.object({
    project_leader_regno: yup.string().required(),
    project_name: yup.string().required(),
    mentor_name: yup.string().required(),
    department: yup.string().required(),
    category: yup.string().required(),
    member1: yup.string().required(),
    member2: yup.string().required(),
});

class StudentHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            isLoading: true,
            isRoomDetailsLoading: true,
            roomDetails: null,
            projekt: null,
            error: null,
            showRegisterModal: false
        }
    }


    fetchProjektDetails() {

        const user = JSON.parse(localStorage.getItem('user'));

        if (user != null) {
            axios.get(BASE_URL + 'projekt/from-reg-no/' + user.reg_no)
                .then((res) => {
                    this.setState({
                        projekt: res.data,
                        isLoading: false,
                    });

                    this.getRoomDetails();
                })
                .catch((err) => {
                    this.setState({
                        error: err.response.data.message,
                        isLoading: false,
                    })
                });
        }
    }

    deregisterProject() {
        axios.delete(BASE_URL + 'projekt/' + this.state.projekt.id)
            .then((res) => {
                this.setState({
                    projekt: null
                });
            });
    }

    componentDidMount() {

        const user = JSON.parse(localStorage.getItem('user'));

        if (user == null) {
            this.props.history.replace('/login');
            return;
        }

        this.setState({
            user: user,
        });

        this.fetchProjektDetails();

    }

    registerProjectModal() {
        return (

            <Formik
                validationSchema={projectRegisterSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);

                    const payload = {
                        project_leader_regno: values.project_leader_regno,
                        project_name: values.project_name,
                        mentor_name: values.mentor_name,
                        department: values.department,
                        category: values.category,
                        students: [values.project_leader_regno, values.member1, values.member2]
                    }

                    axios.post(BASE_URL + 'projekt/register', payload)
                        .then((res) => {
                            // fetch the project details now
                            this.fetchProjektDetails();
                            this.setState({ showRegisterModal: false });
                        })
                        .catch((err) => {
                            console.error(err);
                        });

                    setSubmitting(false);
                }}
                initialValues={{
                    project_leader_regno: '',
                    project_name: '',
                    mentor_name: '',
                    department: 'CSE',
                    category: '',
                    member1: '',
                    member2: '',
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

                        <Modal
                            show={this.state.showRegisterModal}
                            onHide={() => this.setState({ showRegisterModal: false })}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">Register your Projekt</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col lg={6} className="border-right px-4">
                                        <Form className="my-2">
                                            <Form.Group>
                                                <Form.Label>Project Name</Form.Label>
                                                <Form.Control type="text" name="project_name" value={values.project_name} onChange={handleChange} placeholder="" />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Mentor Name</Form.Label>
                                                <Form.Control type="text" name="mentor_name" value={values.mentor_name} onChange={handleChange} placeholder="" />
                                            </Form.Group>
                                            <Row>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Department</Form.Label>

                                                        <Form.Control as="select" name="department" value={values.department} onChange={handleChange} >
                                                            <option>CSE</option>
                                                            <option>EEE</option>
                                                            <option>ECE</option>
                                                            <option>CIVIL</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Category</Form.Label>
                                                        <Form.Control type="text" name="category" value={values.category} onChange={handleChange} placeholder="" />
                                                    </Form.Group>
                                                </Col>
                                            </Row>


                                        </Form>
                                    </Col>
                                    <Col lg={6} className="px-4">
                                        <Form className="my-2">
                                            <Form.Group>
                                                <Form.Label >#1 Project Leader USN No</Form.Label>
                                                <Form.Control type="text" name="project_leader_regno" value={values.project_leader_regno} onChange={handleChange} placeholder="" />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>#2 Member USN</Form.Label>
                                                <Form.Control type="text" name="member1" value={values.member1} onChange={handleChange} placeholder="" />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>#3 Member USN</Form.Label>
                                                <Form.Control type="text" name="member2" value={values.member2} onChange={handleChange} placeholder="" />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" className="mr-3" onClick={handleSubmit}>Register</Button>
                                <Button variant="danger" onClick={() => this.setState({ showRegisterModal: false })}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    )}

            </Formik>

        );
    }

    getRoomDetails() {
        if (this.state.user == null)
            return;

        if (this.state.projekt == null)
            this.setState({ isRoomDetailsLoading: false, roomDetails: null })

        axios.get(BASE_URL + 'exhibition/' + this.state.projekt.id)
            .then((res) => {
                console.log('Hi');
                this.setState({
                    isRoomDetailsLoading: false,
                    roomDetails: res.data,
                });
            })
            .catch((err) => {
                this.setState({
                    isRoomDetailsLoading: false,
                    roomDetails: null,
                })
            });
    }

    bookTable() {
        if (this.state.projekt == null)
            return;

        axios.post(BASE_URL + 'exhibition/register/' + this.state.projekt.id)
            .then((res) => {
                this.getRoomDetails();
            });
    }

    RoomDetails() {
        if (this.state.isRoomDetailsLoading) {

            return (
                <Row className="mx-auto">
                    <Col className="mx-auto">
                        <Spinner animation="grow" /> Loading . . .
                                        </Col>
                </Row>
            )
        }

        if (this.state.projekt == null) {

            return (
                <Row>
                    <Col md={6} xl={6} className="">You have not register a project yet </Col>
                </Row>
            )
        }

        if (this.state.roomDetails == null) {
            return (
                <Row>
                    <Col md={6} xl={6} className="">You have not booked a table for the exhibition <Button variant="info" className="ml-5 shadow" onClick={() => { this.bookTable(); }} >Book Now</Button></Col>
                </Row>
            )
        }

        return (
            <div>
                <Card.Text>
                    You have been alloted to <strong>{' '} Room {this.state.roomDetails.room_name}</strong> at <strong>{' '} Table {this.state.roomDetails.table_no}</strong>
                </Card.Text>
                <Button variant="danger" onClick={() => this.deregisterTable()} >Cancel Booking</Button>
            </div>
        );
    }

    deregisterTable() {
        axios.delete(BASE_URL + 'exhibition/deregister/' + this.state.projekt.id)
            .then((res) => {
                this.setState({
                    roomDetails: null,
                });
                this.getRoomDetails();
            });
    }

    ProjektDetails() {

        if (this.state.isLoading)

            return (
                <Row className="mx-auto">
                    <Col className="mx-auto">
                        <Spinner animation="grow" /> Loading . . .
                                        </Col>
                </Row>
            )

        if (this.state.projekt == null) {
            return (
                <Row>
                    <Col md={6} xl={6} className="">You have not registered your group project <Button variant="info" className="ml-5 shadow" onClick={() => this.setState({ showRegisterModal: true })} >Register Now</Button></Col>
                </Row>
            )
        }

        return (
            <Row>
                <Col md={6} xl={6} className="">

                    <h4 className="mb-4" >Details</h4>
                    <Table striped bordered variant="dark">
                        <tbody>
                            <tr>
                                <td>Project Name</td>
                                <td>{this.state.projekt.project_name}</td>
                            </tr>
                            <tr>
                                <td>Team Leader</td>
                                <td>{this.state.projekt.project_leader_regno}</td>
                            </tr>
                            <tr>
                                <td>Mentor Name</td>
                                <td>{this.state.projekt.mentor_name}</td>
                            </tr>
                            <tr>
                                <td>Department</td>
                                <td>{this.state.projekt.department}</td>
                            </tr>
                            <tr>
                                <td>Category</td>
                                <td>{this.state.projekt.category}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col md={6} xl={6} className="">
                    <h4 className="mb-4" >Team Members</h4>
                    <Table striped bordered variant="dark">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>USN</th>
                            </tr>
                        </thead>
                        <tbody>

                            {this.state.projekt.members.map((e, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{e.name}</td>
                                        <td>{e.reg_no}</td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </Table>
                    <Button className="mt-2 warning" onClick={() => this.deregisterProject()} >De-Register Project</Button>
                </Col>
            </Row>
        )
    }

    checkAuthentication() {

    }

    render() {

        const user = JSON.parse(localStorage.getItem('user'));

        if (user == null) {
            this.props.history.replace('/login');

            return (
                <h1>401: UNAUTHORIZED</h1>
            )
        }

        return (
            <div className="home-page meow">
                {this.registerProjectModal()}
                <Container>
                    <Navbar variant="dark" expand="lg" sticky="top" style={tranlucentbg}>
                        <Navbar.Brand href="#home">
                            <img
                                alt=""
                                src={logo}
                                width="25"
                                height="30"
                                className="align-top font-weight-bold"
                            />
                            {' '} RUAS LMS
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Signed in as: <a href="#login">{user.reg_no}</a>
                            </Navbar.Text>

                            <Button variant="danger" className="ml-4" onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');

                                this.props.history.replace('/login');
                            }} >Logout</Button>
                        </Navbar.Collapse>
                    </Navbar>
                </Container>
                <Container className="">
                    <Col lg={8} className="mx-auto mb-5">
                        <Row className="border-bottom">
                            <h1 className="mx-auto my-5">👋 Hi {user.name} !</h1>
                        </Row>
                    </Col>
                    <Col className="mb-5">
                        <Card>
                            <Card.Header as="h1">Projekt Exhibition</Card.Header>
                            <Card.Body>
                                {this.ProjektDetails()}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card bg='primary' text='white'>
                            <Card.Header as="h4">Room Allotment</Card.Header>
                            <Card.Body>
                                {this.RoomDetails()}
                            </Card.Body>
                        </Card>
                    </Col>
                </Container>

                <Container>
                    <Navbar variant="dark" fixed="bottom">
                        <Container>
                            <Col lg={8} className="mx-auto">
                                <Row>
                                    <h5 className="mx-auto">Made with 💖 and ☕ by shadowleaf</h5>
                                </Row>
                            </Col>
                        </Container>

                    </Navbar>
                </Container>
            </div>
        )
    }
}

export default StudentHome;
