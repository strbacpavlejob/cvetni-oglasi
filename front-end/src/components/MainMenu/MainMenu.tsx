import React from 'react';
import { Nav, Container, Row } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';
import { ApiConfig } from '../../config/api.config';


export class MainMenuItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string) {
        this.text = text;
        this.link = link;
    }
}

interface MainMenuProperties {
    items: MainMenuItem[];
}

interface MainMenuState {
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties> {
    state: MainMenuState;

    constructor(props: Readonly<MainMenuProperties>) {
        super(props);

        this.state = {
            items: props.items,
        };
    }

    public setItems(items: MainMenuItem[]) {
        this.setState({
            items: items,
        });
    }

    render() {
        return (
                
                <Nav variant="tabs">
                    <img height="50px" src={ ApiConfig.PHOTO_BASE + 'logo/' + "minilogo.png" }/>
                    <HashRouter>
                        { this.state.items.map(this.makeNavLink) }
                    </HashRouter>
                </Nav>
        
        );
    }

    private makeNavLink(item: MainMenuItem) {
        return (
            <Link to={ item.link } className="nav-link">
                { item.text }
            </Link>
        );
    }
}
