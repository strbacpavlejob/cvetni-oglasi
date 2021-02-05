import React from 'react';
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken, saveUserId } from '../../api/api';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface UserLoginPageState {
    isLoggedIn: boolean;
    message: string;
    email: string;
    password: string;
}

export default class UserLoginPage extends React.Component {
    state: UserLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isLoggedIn: false,
            message: '',
            email: '',
            password: '',
        };
    }

    private handleFormInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        let stateFieldName = '';

        if (event.target.id === 'email') {
            stateFieldName = 'email';
        } else if (event.target.id === 'password') {
            stateFieldName = 'password';
        }

        if (stateFieldName === '') {
            return;
        }

        const newState = Object.assign(this.state, {
            [ stateFieldName ]: event.target.value,
        });

        this.setState(newState);
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isLoggedIn: state,
        }));
    }

    private doLogin() {
        const data = {
            email: this.state.email,
            password: this.state.password,
        };

        api('/auth/login', 'post', data)
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setMessage('Došlo je do greške. Molim Vas pokušajte ponovno!');
                return;
            }

            if (res.data.statusCode !== undefined) {
                switch (res.data.statusCode) {
                    case -3001: this.setMessage('Korisnik ne postoji!'); break;
                    case -3002: this.setMessage('Pogrešna lozinka!'); break;
                }
                return;
            }
            saveUserId(res.data.id);
            saveToken(res.data.token);
            saveRefreshToken(res.data.refreshToken);

            this.setLoggedInState(true);
        });
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <Redirect to="/" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role="visitor"/>
                <Col md={ { span: 6, offset: 3 } }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={ faSignInAlt } /> Prijava
                            </Card.Title>

                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="email">E-mail:</Form.Label>
                                    <Form.Control type="email" id="email"
                                                  value={ this.state.email }
                                                  onChange={ (event) => this.handleFormInputChange(event as any) } />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Lozinka:</Form.Label>
                                    <Form.Control type="password" id="password"
                                                  value={ this.state.password }
                                                  onChange={ (event) => this.handleFormInputChange(event as any) } />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" block
                                            onClick={ () => this.doLogin() }>
                                        <FontAwesomeIcon icon={ faSignInAlt } /> Prijavi se
                                    </Button>
                                </Form.Group>
                            </Form>

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
}
