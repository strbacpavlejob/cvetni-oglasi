import React from 'react';
import { MainMenuItem, MainMenu } from '../MainMenu/MainMenu';

interface RoledMainMenuProperties {
    role: 'user' | 'visitor';
}

export default class RoledMainMenu extends React.Component<RoledMainMenuProperties> {
    render() {
        let items: MainMenuItem[] = [];

        switch (this.props.role) {
            case 'visitor'       : items = this.getVisitorMenuItems(); break;
            case 'user'          : items = this.getUserMenuItems(); break;
        }

        return <MainMenu items={ items }/>
    }

    getUserMenuItems(): MainMenuItem[] {
        return [
             new MainMenuItem("Početna", "/"),     
             new MainMenuItem("Moji oglasi", "/dashboard"),             
             new MainMenuItem("Odjavi se", "/logout/"),
        ];
    }

    getVisitorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Početna", "/"),
            new MainMenuItem("Prijavi se", "/login/"),
            new MainMenuItem("Registruj se", "/register/"),
        ];
    }
}