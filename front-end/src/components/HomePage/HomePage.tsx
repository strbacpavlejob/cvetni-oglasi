import React, { CSSProperties } from 'react';
import { Container, Card, Col, Row,Image } from 'react-bootstrap';
import { faHome, faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import {Link } from 'react-router-dom';
import api, { ApiResponse, getId } from '../../api/api';
import { ApiConfig } from '../../config/api.config';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';


const myStyles: CSSProperties = {
  backgroundImage: `url('${ ApiConfig.PHOTO_BASE + 'home/' + "bg.jpg" }')`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  color: 'white',
  textAlign: 'center',
  padding: '10% 10%'
}
const cateforyStyle: CSSProperties = {
  textAlign: 'center',
  color: '#007bff',
}

interface HomePageState {
  categories: CategoryType[];
  isUserLoggedIn: boolean; 
}

interface CategoryDto {
  categoryId: number;
  name: string;
}

export default class HomePage extends React.Component {
  state: HomePageState;
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      isUserLoggedIn: (getId()!=='')? true : false,
      categories: [],
    };
  }


  private setCategories(categories: CategoryType[]) {
    this.setState(Object.assign(this.state, {
      categories: categories,
    }));
  }

  render() {

    return (
      <Container>
        <RoledMainMenu role={this.state.isUserLoggedIn===true? "user" : "visitor"}/>
        <Card>
          <Card.Body>
            <Card.Title>
              <FontAwesomeIcon icon={ faHome } /> Početna
            </Card.Title>
            <Card>
            <div style={myStyles}>
          <h1>Dobrodošli</h1>
          <h2>Cvetni oglasi je web aplikacija koja Vam omogućava da pregledate i postavljate oglase za on-line prodaju cveća.</h2>
          </div>
          </Card>
          <br></br>
          <h3 style={cateforyStyle}>kategorije</h3>
          <h2 style={cateforyStyle}><FontAwesomeIcon icon={ faArrowAltCircleDown } /></h2>
            <Row>
              { this.state.categories.map(this.renderSingleCategory) }
            </Row>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  private renderSingleCategory(category: CategoryType) {
    return (
      <Col xs="12" sm="6" md="4" lg="3">
        <Card className="mt-3">
        <Card.Header>
                        <img src={ ApiConfig.PHOTO_BASE + 'category/' + category.categoryId+".jpg" }
                             alt={ category.name }
                             className="w-100" />
                    </Card.Header>
          <Card.Body>
            <Card.Title as="p">
              <strong>
                { category.name }
              </strong>
            </Card.Title>
            <Link to={ `/category/${ category.categoryId }/` }
                  className="btn btn-sm btn-primary btn-block">
              Otvori
            </Link>
          </Card.Body>
        </Card>
      </Col>
    );
  }

  private getCategories() {
    api('/api/category/', 'get', {})
    .then((res: ApiResponse) => {
      if (res.status === 'error') {
        return;
      }

      this.storeCategoriesIntoTheState(res.data);
    });
  }

  private storeCategoriesIntoTheState(apiCategories: CategoryDto[]) {
    if (!apiCategories || apiCategories.length === 0) {
      this.setCategories([]);
      return;
    }

    const categories: CategoryType[] = apiCategories.map(apiCategory => {
      return {
        categoryId: apiCategory.categoryId,
        name: apiCategory.name,
      };
    });

    this.setCategories(categories);
  }

  componentDidMount() {
    this.getCategories();
  }

  componentDidUpdate() {
    this.getCategories();
  }
  private setLogginState(isLoggedIn: boolean) {
    const newState = Object.assign(this.state, {
        isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
}
}


