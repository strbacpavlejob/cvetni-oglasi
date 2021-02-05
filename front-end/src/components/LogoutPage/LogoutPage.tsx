import React from 'react';
import { Redirect } from 'react-router-dom';
import { removeTokenData } from '../../api/api';

interface LogoutPageState {
    done: boolean;
}

export class LogoutPage extends React.Component {
    state: LogoutPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            done: false,
        };
    }

    finished() {
        this.setState({
            done: true,
        });
    }

    render() {
        if (this.state.done) {
            return <Redirect to="/login/" />
        }

        return (
            <p>Odlogujem se...</p>
        );
    }

    componentDidMount() {
        this.doLogout();
    }

    componentDidUpdate() {
        this.doLogout();
    }

    doLogout() {
        removeTokenData();
        this.finished();
    }
}