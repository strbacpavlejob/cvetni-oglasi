import React from 'react';
import { Container, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../../types/CategoryType';
import api, { ApiResponse, getId } from '../../api/api';
import FlowerType from '../../types/FlowerType';
import FlowerPreview from '../FlowerPreview/FlowerPreview';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';


interface UserFlowerPageProperties {
    match: {
        params: {
            uId: number;
        }
    }
}

interface UserFlowerPageState {
    isUserLoggedIn: boolean;
    category?: CategoryType;
    message: string;
    flowers: FlowerType[];
    filters: {
        userId: number;
        keywords: string;
        priceMinimum: number;
        priceMaximum: number;
        sizeMin: number;
        sizeMax: number;
        lifetime: string;
        color: string;
        createdAt: string;
        expiredAt: string;
        order: "name asc" | "name desc" | "price asc" | "price desc";
        
    };
}

interface CategoryDto {
    categoryId: number;
    name: string;
   
}

interface FlowerDto {
    flowerId: number;
    name: string;
    description: string;
    price: number;
    expiredAt: string;
    pictures: {
        imagePath: string;
        isPrimary: number;
    }[],
    user:{
        userId: number;
        forename: string;
        surname: string;
        city: string;
    }
}

export default class UserFlowerPage extends React.Component<UserFlowerPageProperties> {
    state: UserFlowerPageState;

    constructor(props: Readonly<UserFlowerPageProperties>) {
        super(props);

        this.state = {
            isUserLoggedIn: (getId()!=='')? true : false,
            message: '',
            flowers: [],
            filters: {
                userId: Number(this.props.match.params.uId),
                keywords: '',
                priceMinimum: 1,
                priceMaximum: 90000,
                sizeMin: 1,
                sizeMax: 200,
                lifetime: '',
                color: '',
                createdAt: '',
                expiredAt: '',
                order: "price asc",
            },
        };
    }

    private filterSearchKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
            keywords: event.target.value,
        })));
    }

    private filterPriceMinimumChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
            priceMinimum: Number(event.target.value),
        })));
    }

    private filterPriceMaximumChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
            priceMaximum: Number(event.target.value),
        })));
    }

    private filterSizeMinChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
            sizeMin: Number(event.target.value),
        })));
    }

    private filterSizeMaxChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
            sizeMax: Number(event.target.value),
        })));
    }

    private filterLifetimeChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
                        lifetime: (event.target.value),
        })));
    }

    private filterCreatedAtChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
                        createdAt: (event.target.value),
        })));
    }
    private filterExpiredAtChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
                        expiredAt: (event.target.value),
        })));
    }
    private filterColorChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
                        color: (event.target.value),
        })));
    }

    private filterSearchOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState(Object.assign(this.state, Object.assign(this.state.filters, {
            order: event.target.value,
        })));
    }
 
    private applyFilters() {
        this.getCategoryData();
    }

    render() {

 
        return (
            <Container>
                 <RoledMainMenu role={this.state.isUserLoggedIn===true? "user" : "visitor"}/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> {this.state.flowers.length!==0? (this.state.flowers[0]?.forename +" "+  this.state.flowers[0]?.surname + ", "+ this.state.flowers[0]?.city): "Korisnik ne postoji"}
                        </Card.Title>

                        {this.printFlowers()}

                        {this.printMessage()}
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private printFlowers() {
        return (
            <Row className="mt-3">
               <Col xs="12" md="3">
               { this.printFilters() }
                </Col>
                <Col xs="12" md="9">
                    <Row>
                        {
                         

                            (this.checkGhostFlowers() || this.state.flowers.length === 0 ) ?                            
                            <p>Oglasi nisu pronadjeni</p> :
                            this.state.flowers.map(flower => 
                            {
                                if(!this.checkFlowerExpiredDate(flower.expiredAt))
                                return (<FlowerPreview flower={ flower } />);
                            })
                        }
                    </Row>
                </Col>
            </Row>
        );
    }

    private printFilters() {
        return (
            <>
                <Form.Group>
                    <Form.Label htmlFor="search-keywords">
                        Ključne reči:
                    </Form.Label>
                    <Form.Control type="text" id="search-keywords"
                                  value={ this.state.filters.keywords }
                                  onChange={ (e) => this.filterSearchKeywordsChanged(e as any) } />
                </Form.Group>


                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="min-price">
                                Minimalna cena:
                            </Form.Label>
                            <Form.Control type="number" id="min-price"
                                        min="1" step="1"
                                        value={ this.state.filters.priceMinimum }
                                        onChange={ (e) => this.filterPriceMinimumChanged(e as any) } />
                        </Col>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="max-price">
                                Maksimalna cena:
                            </Form.Label>
                            <Form.Control type="number" id="max-price"
                                        min="1" step="1"
                                        value={ this.state.filters.priceMaximum }
                                        onChange={ (e) => this.filterPriceMaximumChanged(e as any) } />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="min-size">
                                Minimalna veličina:
                            </Form.Label>
                            <Form.Control type="number" id="min-size"
                                        min="1" step="1"
                                        value={ this.state.filters.sizeMin }
                                        onChange={ (e) => this.filterSizeMinChanged(e as any) } />
                        </Col>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="max-size">
                                Maksimalna veličina:
                            </Form.Label>
                            <Form.Control type="number" id="max-size"
                                        min="1" step="1"
                                        value={ this.state.filters.sizeMax }
                                        onChange={ (e) => this.filterSizeMaxChanged(e as any) } />
                        </Col>
                    </Row>
                </Form.Group>

                
                <Form.Group>
                    <Form.Label htmlFor="lifetime">
                      Životni vek:
                    </Form.Label>
                    <Form.Control as="select" id="lifetime"
                                  value={ this.state.filters.lifetime }
                                  onChange={ (e) => this.filterLifetimeChanged(e as any) }>           
                        <option value="">Svi</option>
                        <option value="seasonal">Sezonsko</option>
                        <option value="annual">Godišnje</option>
                        <option value="perennial">Višegodišnje</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="color">
                      Boja:
                    </Form.Label>
                    <Form.Control as="select" id="color"
                                  value={ this.state.filters.color }
                                  onChange={ (e) => this.filterColorChanged(e as any) }>    
                        <option value="">Sve</option>           
                        <option value="crvena">crvena</option>
                        <option value="narandžasta">narandžasta</option>
                        <option value="žuta">žuta</option>
                        <option value="zelena">zelena</option>
                        <option value="tirkizna">tirkizna</option>
                        <option value="plava">plava</option>
                        <option value="ljubičasta">ljubičasta</option>
                        <option value="roze">roze</option>
                        <option value="bela">bela</option>
                        <option value="siva">siva</option>
                        <option value="crna">crna</option>
                        <option value="smeđa">smeđa</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                <Form.Label>Datum važenja oglasa</Form.Label>
                    <Row>
                            <Form.Label htmlFor="createdAt">
                               Od:
                            </Form.Label>
                            <Form.Control type="date" id="createdAt"
                                        step="1"
                                        value={ this.state.filters.createdAt }
                                        onChange={ (e) => this.filterCreatedAtChanged(e as any) } />
                    </Row>
                    <Row>
                            <Form.Label htmlFor="expiredAt">
                                Do:
                            </Form.Label>
                            <Form.Control type="date" id="expiredAt"
                                        min={String(this.makeTomorrowDateString())}
                                        value={ this.state.filters.expiredAt }
                                        onChange={ (e) => this.filterExpiredAtChanged(e as any) } />
                        </Row>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="search-order">
                       Sortiraj po:
                    </Form.Label>
                    <Form.Control as="select" id="search-order"
                                  value={ this.state.filters.order }
                                  onChange={ (e) => this.filterSearchOrderChanged(e as any) }>
                        <option value="name asc">Nazivu A-Z</option>
                        <option value="name desc">Nazivu Z-A</option>
                        <option value="price asc">Ceni rastućoj</option>
                        <option value="price desc">Ceni opadajućoj</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Button variant="primary" block onClick={ () => this.applyFilters() }>
                        <FontAwesomeIcon icon={ faSearch } /> Pretraži
                    </Button>
                </Form.Group>
            </>
        );
    }

    private printMessage() {
        if (this.state.message) {
            return;
        }

        return (
            <p>{ this.state.message }</p>
        );
    }


    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: UserFlowerPageProperties) {
        if (oldProperties.match.params.uId === this.props.match.params.uId) {
            return;
        }

        this.getCategoryData();
    }

    private setUserLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: state,
        }));
    }

    private setCategoryState(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category,
        }));
    }

    private setMessageState(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setFlowersState(flowers: FlowerType[]) {
        this.setState(Object.assign(this.state, {
            flowers: flowers,
        }));
    }

    private getCategoryData() {
        api('/api/category/' + this.props.match.params.uId, 'get', {})
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    return;
                }

                const data: CategoryDto = res.data;

                const categoryData: CategoryType = {
                    categoryId: data.categoryId,
                    name: data.name
                };

                this.setCategoryState(categoryData);
            });

        const orderParts = this.state.filters.order.split(' ');
        const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();

        api('/api/flower/search/', 'post', {
            userId: Number(this.props.match.params.uId),
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMinimum,
            priceMax: this.state.filters.priceMaximum,
            sizeMin: this.state.filters.sizeMin,
            sizeMax: this.state.filters.sizeMax,
            lifetime: this.state.filters.lifetime,
            color: this.state.filters.color,
            createdAt: this.state.filters.createdAt,
            expiredAt: this.state.filters.expiredAt,

            orderBy: orderBy,
            orderDirection: orderDirection,
            page: 0,
            itemsPerPage: 75,
        })
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return this.setUserLoggedInState(false);
            }

            if (res.data.statusCode === 0) {
                this.setFlowersState([]);
                this.setMessageState('Oglasi nisu pronadjeni');
                return;
            }
   
            const flowers: FlowerType[] =

            res.data.map((flower: FlowerDto) => {
                const object: FlowerType = {
                    flowerId: flower.flowerId,
                    name: flower.name,
                    imageUrl: '',
                    description: flower.description,
                    price: flower.price,
                    expiredAt: flower.expiredAt,
                    forename: flower.user.forename,
                    surname: flower.user.surname,
                    city: flower.user.city
                };

                if (flower.pictures !== undefined && flower.pictures?.length > 0) {
                    for(let i=0; i<flower.pictures?.length;i++){
                        if(flower.pictures[i].isPrimary===1)
                        object.imageUrl = flower.pictures[i].imagePath;    
                    }            
                }
                      

                return object;
            });

            this.setFlowersState(flowers);
        });
    }
    private makeTomorrowDateString(): string
    {     //2019-02-18
        // 2020-08-26

        var d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);;
        var date = d.getDate();
        var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
        var year = d.getFullYear(); 
        var newdate = date+"";
        var newmonth = month+"";
        var newyear =  year+"";
        if(date<10)
        newdate = "0"+newdate;
        if(month<10)
        newmonth = "0"+newmonth;
        var dateStr = newyear+"-" + newmonth + "-" + newdate;
        
        return dateStr.trim();
    }
    checkFlowerExpiredDate(expiredAtDate: string | undefined){
        var today = new Date();
        if(expiredAtDate===undefined)
            return;
        var givenDate = new Date(expiredAtDate);
        return givenDate < today;
    }
    checkGhostFlowers()
    {
        let counter=1;
        let size = this.state.flowers.length;
        this.state.flowers.forEach(flower => {
            
            if(!this.checkFlowerExpiredDate(flower.expiredAt))
                counter++;
        });
        
       

        return counter===size;
    }
}
