import React, { CSSProperties } from 'react';
import { Container, Card, Row, Col, Button, Form, Nav, Carousel } from 'react-bootstrap';
import { faImages, faMinus, faPlus, faBackward, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile, getId } from '../../api/api';
import PictureType from '../../types/PictureType';
import { ApiConfig } from '../../config/api.config';
import { Markup } from 'interweave';

const myStyles: CSSProperties = {
    alignSelf:'center',
  }

interface DashboardPictureProperties {
    match: {
        params: {
            fId: number;
        }
    }
}

interface DashboardPictureState {
    isLoggedIn: boolean;
    pictures: PictureType[];
}

class DashboardPicture extends React.Component<DashboardPictureProperties> {
    state: DashboardPictureState;

    constructor(props: Readonly<DashboardPictureProperties>) {
        super(props);

        this.state = {
            isLoggedIn: (getId()!=='')? true : false,
            pictures: [],
        };
    }

    componentDidMount() {
        this.getPictures();
    }

    componentDidUpdate(oldProps: any) {
        if (this.props.match.params.fId === oldProps.match.params.fId) {
            return;
        }

        this.getPictures();
    }

    private getPictures() {
        api('/api/flower/findpictures/' + this.props.match.params.fId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login" || getId()===null) {
                this.setLogginState(false);
                return;
            }
            
            this.setState(Object.assign(this.state, {
                pictures: res.data[0].pictures,
            }));
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        }));
    }

    render() {

   

        return (
            <Container>
                 <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faImages } /> Oglasi
                        </Card.Title>

                        <Nav className="mb-3">
                            <Nav.Item>
                                <Link to="/dashboard/" className="btn btn-sm btn-info">
                                    <FontAwesomeIcon icon={ faBackward } /> Vrati se na moje oglase
                                </Link>
                            </Nav.Item>
                        </Nav>

                       
                            { this.printSinglePicture(this.state.pictures) }
                        

                        <Form className="mt-5">
                            <p>
                                <strong>Dodaj novu sliku za oglas</strong>
                            </p>
                            <Form.Group>
                                <Form.Label htmlFor="pictures">Nova slika oglasa</Form.Label>
                                <Form.File id="pictures" />
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary"
                                        onClick={ () => this.doUpload() }>
                                    <FontAwesomeIcon icon={ faPlus } /> Okaci sliku
                                </Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private printSinglePicture(pictures: PictureType[]) {
        return  (this.displayCardPictureGallery(pictures));
    }
    
    private async doUpload() {

        const filePicker: any = document.getElementById('pictures');

        if (filePicker?.files.length === 0) {
            return;
        }

        const file = filePicker.files[0];
        await this.uploadFlowerPicture(this.props.match.params.fId, file);
        filePicker.value = '';

        this.refreshPage();
        this.getPictures();
    }
    private async uploadFlowerPicture(flowerId: number, file: File) {
        
        
        return await apiFile('/api/flower/' + flowerId + '/uploadPictures/', 'pictures', file);
    }

    private deletePicture(pictureId: number) {
        if (!window.confirm('Da li ste sigurni?')) {
            return;
        }
        //http://localhost:3000/api/flower/2/deletePicture/17/
        api('/api/flower/' + this.props.match.params.fId + '/deletePicture/'+pictureId, 'delete', {})
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login" || getId()===null) {
                this.setLogginState(false);
                return;
            }
            this.getPictures();
        })
        return(<Redirect to="/dashboard/" />);
    }
    private makePrimaryPicture(imagePath: string) {
       
        //http://localhost:3000/api/flower/12/setPrimaryPicture
        api('/api/flower/' + this.props.match.params.fId + '/setPrimaryPicture/', 'post', {
            imagePath: imagePath
        })
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login" || getId()===null) {
                this.setLogginState(false);
                return;
            }
            this.refreshPage();
            this.getPictures();
        })
    }
    displayPictureGallery(pictures: PictureType[])
    {
        let strGenerated='';
        for (let i=0; i<pictures.length; i++)
        {
            let fullImgPath = ApiConfig.PHOTO_BASE + 'small/' + pictures[i].imagePath;

            strGenerated +=       
        `<img src=${fullImgPath} className="w-10" />`
        
        }
        return  (<Markup content={strGenerated} />);
        

    }
    refreshPage() {
        window.location.reload(false);
      }
    displayCardPictureGallery(pictures: PictureType[])
    {

        return (<Row>{ pictures.map(picture => {
            return(
                <Col  sm="8" md="6" lg="4">
                <Card className="mb-3 text-center"><Card.Img variant="top" src={ApiConfig.PHOTO_BASE + 'small/' + picture.imagePath}  className="w-100"/>
                <Card.Body>
                  {(picture.isPrimary===1)? (<Card.Title className="text-center">Primarna</Card.Title>):''}
               
                {(picture.isPrimary===1)? '':(<Button variant="primary" onClick={ () => this.makePrimaryPicture(picture.imagePath) }><FontAwesomeIcon icon={ faStar} /> Postavi sliku kao primarnu</Button>)}
                
                <div style={myStyles}><Button variant="danger"  onClick={ () => this.deletePicture(picture.pictureId) } className="text-center align-center">
                      <FontAwesomeIcon icon={ faTrash } /> Obriši sliku</Button></div>
                </Card.Body></Card></Col> );
            }, this) }</Row>);
    }
}

export default DashboardPicture;