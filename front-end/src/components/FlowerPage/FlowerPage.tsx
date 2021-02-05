import React, { CSSProperties } from 'react';
import ApiFlowerDto from '../../dtos/ApiFlowerDto';
import api, { ApiResponse, getId } from '../../api/api';
import { Container, Card, Row, Col, Carousel } from 'react-bootstrap';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { ApiConfig } from '../../config/api.config';
import { Markup } from 'interweave';
import { Link } from 'react-router-dom';

interface FlowerPageProperties {
    match: {
        params: {
            fId: number;
        }
    }
}
const myStyles: CSSProperties = {
    wordBreak:'break-all',
  }



interface FlowerPageState {
    isUserLoggedIn: boolean; 
    message: string;
    hidden?: boolean;
    flower?: ApiFlowerDto[];
}

export default class FlowerPage extends React.Component<FlowerPageProperties> {
    state: FlowerPageState;

    constructor(props: Readonly<FlowerPageProperties>) {
        super(props);
        
        this.state = {
            isUserLoggedIn: (getId()!=='')? true : false,
            hidden: false,
            message: '',
        };
    }

     private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });

        this.setState(newState);
    }
    private setHidden(hidden: boolean) {
        const newState = Object.assign(this.state, {
            hidden: hidden,
        });

        this.setState(newState);
    }

    private setFlowerData(flowerData: ApiFlowerDto | undefined) {
        const newState = Object.assign(this.state, {
            flower: flowerData,
        });

        this.setState(newState);
    }

    componentDidMount() {
        
        this.getFlowerData();
    }

    componentDidUpdate(oldProperties: FlowerPageProperties) {
        if (oldProperties.match.params.fId === this.props.match.params.fId) {
            return;
        }

        this.getFlowerData();
    }

    getFlowerData() {
        api('api/flower/findpictures/' + this.props.match.params.fId, 'get', {})
        .then((res: ApiResponse) => {

            if (res.data.statusCode === 0) {
                this.state.flower=[];
                this.state.message='Oglas nije pronadjen';
                return;
            }
           
            if (res.status === 'error') {
                this.setFlowerData(undefined);
                this.setMessage('Ovaj olgas ne postoji');
                return;
            }

            const data: ApiFlowerDto = res.data;

            this.setMessage('');
            this.setFlowerData(data);

        });
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }

        return (
            <Card.Text>
                { this.state.message }
            </Card.Text>
        );
    }

    render() {

        return (
            <Container>
                <RoledMainMenu role={this.state.isUserLoggedIn===true? "user" : "visitor"}/>

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faBoxOpen } /> {
                                this.state.flower ?
                                this.state.flower[0]?.name :
                                'Oglas nije pronadjen'
                            }
                        </Card.Title>

                        { this.printOptionalMessage() }

                        {
                            ( this.state.flower) ?
                            ( this.renderFlowerData(this.state.flower[0])) :
                            ''
                        }

                    
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    renderFlowerData(flower: ApiFlowerDto) {
        if(this.checkFlowerExpiredDate(new Date(flower.expiredAt)))
        {   
            return this.renderLinkToUser(flower);
        }
        return (
      
            <Row>
            <Row>
            <Col>
            
            <Row>
            <Col xs="12" className="mb-3 align-center">
                   { (this.displayBetterPictureGallery(flower))}
              </Col>   
            </Row>
            
            </Col>
            
            
            <Col  className="mb-3 d-block">
            <Col xs="12" className="text-left mb-3">
            <Link to={`/floweruser/${flower.userId}`}>
            <b>
                { (flower.user.forename + " " + flower.user.surname+", "+ flower.user.city)}
            </b>
            </Link>
            </Col>
            
            <Col xs="12" className="text-left mb-3">
               <b>
                   Kategorija: { (flower.category?.name)}
               </b>
            </Col>
            <Col xs="12" className="text-left mb-3">
               <b>
                   Zemlja porekla: { (flower.country)}
               </b>
            </Col>
            <Col xs="12" className="text-left mb-3">
               <b>
                    Životni vek: { (this.lifetimeToSerbian(flower))}
               </b>
            </Col>
            <Col xs="12" className="text-left mb-3">
               <b>
                    Boja: { (flower.color)}
               </b>
            </Col>
            <Col xs="12" className="text-left mb-3">
               <b>
                   Veličina: { (flower.size)+ ' cm'}
               </b>
            </Col>
            <Col xs="12" className="text-left mb-3">
               <b>
                   Cena: { (flower.price) + ' Din' }
               </b>
            </Col>
            <Col xs="12" className="text-left mb-3">
               <b>
                   Kontakt: { (flower.user.phoneNumber)}
               </b>
            </Col>
            <Col xs="12" className="text-left mb-3">
               <b>
               Datum objave oglasa: { (new Date(flower.createdAt)).toLocaleDateString()}
               </b>
            </Col>
            <Col xs="12" className="text-left mb-3">
               <b>
               Datum isteka oglasa: { (new Date(flower.expiredAt)).toLocaleDateString()}
               </b>
            </Col>

            </Col>
            </Row>
            <Row>
                <Col  className="text-left mb-3 ">
               <b>
               Opis:
               </b>
               <br></br>
               <Col  className="text-left d-grid">
                <div style={myStyles}>
               <b>
               { (flower.description)}
               </b>
               </div>
               </Col>
            </Col></Row>
            </Row>
        );
    }



    renderLinkToUser(flower: ApiFlowerDto)
    {
        

        return(
                <Row>
                <Col xs="12" className="text-left mb-3">
                <Link to={`/floweruser/${flower.userId}`}>
                Oglas je neaktivan, kliknite na link vlasnika:  
                <b>
                { (" "+flower.user.forename + " " + flower.user.surname+", "+ flower.user.city)}
                </b>
                </Link>
                </Col>
                </Row>
        );
    }

    checkFlowerExpiredDate(expiredAtDate: Date | undefined){
        var today = new Date();
        if(expiredAtDate===undefined)
            return;
        var givenDate = (expiredAtDate);
        return givenDate < today;
    }

    displayPictureGallery(flower: ApiFlowerDto)
    {
        let strGenerated='';
        for (let i=0; i<flower.pictures.length; i++)
        {
            let fullImgPath = ApiConfig.PHOTO_BASE + 'small/' + flower.pictures[i].imagePath;

            strGenerated +=       
        `<img src=${fullImgPath} className="w-10" />`
        
        }
        return  (<Markup content={strGenerated} /> );
        

    }
    displayBetterPictureGallery(flower: ApiFlowerDto)
    {
        var pictures = flower.pictures;
        return (<Carousel className="d-inline-flex">{ pictures.map(picture => {
            return(
             <Carousel.Item ><img src={ApiConfig.PHOTO_BASE + 'small/' + picture.imagePath} className="w-10" /></Carousel.Item >);
            }, this) }</Carousel>);
  
    }

    lifetimeToSerbian(flower: ApiFlowerDto)
    {
        switch(flower.lifetime){
            case "seasonal": return  "sezonsko";
            case "annual": return  "godišnje";
            case "perennial": return  "višegodišnje";
        }
    }

}


