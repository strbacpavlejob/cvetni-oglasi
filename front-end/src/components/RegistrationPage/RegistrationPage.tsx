import React from 'react';
import { Container, Card, Form, Col, Alert, Button, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse } from '../../api/api';
import { Link } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface RegistrationPageState {
    isRegistrationComplete: boolean;
    message: string;
    formData: {
        email: string;
        password: string;
        forename: string;
        surname: string;
        phoneNumber: string;
        city: string;
    };
}

export default class RegistrationPage extends React.Component {
    state: RegistrationPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isRegistrationComplete: false,
            message: '',
            formData: {
                email: '',
                password: '',
                forename: '',
                surname: '',
                phoneNumber: '',
                city: '',
            },
        };
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setRegistrationCompleteState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isRegistrationComplete: state,
        }));
    }

    private setFormDataField(fieldName: string, value: any) {
        const newFormData = Object.assign(this.state.formData, {
            [ fieldName ]: value,
        });

        this.setState(Object.assign(this.state, {
            formData: newFormData,
        }));
    }

    private handleFormInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        let fieldName = '';

        switch (event.target.id) {
            case 'email': fieldName = 'email'; break;
            case 'password': fieldName = 'password'; break;
            case 'forename': fieldName = 'forename'; break;
            case 'surname': fieldName = 'surname'; break;
            case 'phoneNumber': fieldName = 'phoneNumber'; break;
            case 'city': fieldName = 'city'; break;
        }

        if (fieldName === '') {
            return;
        }

        this.setFormDataField(fieldName, event.target.value);
    }

    render() {
        return (
            <Container>
                <RoledMainMenu role="visitor"/>
                <Col md={ { span: 8, offset: 2 } }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={ faUserPlus } /> Registracija 
                            </Card.Title>

                            {
                                this.state.isRegistrationComplete ?
                                this.renderRegistrationComplete() :
                                this.renderRegistrationForm()
                            }
                            <Alert variant="danger"
                                   className={ this.state.message ? '' : 'd-none' }>
                                { this.state.message }
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        );
    }

    private renderRegistrationComplete() {
        return (
            <>
                <p>Registrovanje uspesno obavljeno.</p>
                <p>
                    <Link to="/login/">Klikni ovde</Link> da odes na stranicu za prijavljivanje.
                </p>
            </>
        );
    }

    private renderRegistrationForm() {
        return (
            <Form>
                <Row>
                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="email">E-mail:</Form.Label>
                            <Form.Control type="email" id="email"
                                        value={ this.state.formData.email }
                                        onChange={ (event) => this.handleFormInputChange(event as any) } />
                        </Form.Group>
                    </Col>

                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="password">Lozinka:</Form.Label>
                            <Form.Control type="password" id="password"
                                        value={ this.state.formData.password }
                                        onChange={ (event) => this.handleFormInputChange(event as any) } />
                        </Form.Group>
                    </Col>
                </Row>
                
                <Row>
                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="forename">Ime:</Form.Label>
                            <Form.Control type="text" id="forename"
                                        value={ this.state.formData.forename }
                                        onChange={ (event) => this.handleFormInputChange(event as any) } />
                        </Form.Group>
                    </Col>

                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="surname">Prezime:</Form.Label>
                            <Form.Control type="text" id="surname"
                                        value={ this.state.formData.surname }
                                        onChange={ (event) => this.handleFormInputChange(event as any) } />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group>
                    <Form.Label htmlFor="phoneNumber">Broj telefona:</Form.Label>
                    <Form.Control type="phone" id="phoneNumber"
                                  value={ this.state.formData.phoneNumber }
                                  onChange={ (event) => this.handleFormInputChange(event as any) } />
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="city">Grad:</Form.Label>
                    <Form.Control type="text" id="city"
                                  value={ this.state.formData.city }
                                  onChange={ (event) => this.handleFormInputChange(event as any) } />
                </Form.Group>

                <Form.Group>
                    <Button variant="primary" block
                            onClick={ () => this.doRegister() }>
                        <FontAwesomeIcon icon={ faUserPlus } /> Registruj se
                    </Button>
                </Form.Group>
            </Form>
        );
    }

    private doRegister() {
        const data = {
            email: this.state.formData.email,
            password: this.state.formData.password,
            forename: this.state.formData.forename,
            surname: this.state.formData.surname,
            phoneNumber: this.state.formData.phoneNumber,
            city: this.state.formData.city,
        };

        api('/auth/register', 'post', data)
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setMessage('Došlo je do greške. Molimo Vas pokušajte ponovo.');
                return;
            }

            if (res.data.statusCode !== undefined) {
                switch (res.data.statusCode) {
                    case -2001:  this.setMessage("Korisnik već postoji!"); break;
                   
                }
                return;
            }

            this.setMessage('');
            this.setRegistrationCompleteState(true);
        });
    }
}
