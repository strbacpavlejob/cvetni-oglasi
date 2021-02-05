import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Col, Row } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave, faImages, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile, getId } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ApiFlowerDto from '../../dtos/ApiFlowerDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';


interface UserDashboardFlowerState {
    isUserLoggedIn: boolean;
    flowers: ApiFlowerDto[];
    categories: CategoryType[];

    

    addModal: {
        visible: boolean;
        message: string;
        
        name: string;
        size: number;
        lifetime: "seasonal" | "annual" | "perennial";
        price: number;
        description: string;
        expiredAt: string;
        categoryId: number;
        userId: number;
        country: string;
        color: string;
    };

    editModal: {
        visible: boolean;
        message: string;

        flowerId: number;
        name: string;
        size: number;
        lifetime: "seasonal" | "annual" | "perennial";
        price: number;
        description: string;
        expiredAt: string;
        categoryId: number;
        userId: number;
        country: string;
        color: string;
    };
}


class UserDashboardFlower extends React.Component {
    state: UserDashboardFlowerState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: (getId()!=='')? true : false,
            flowers: [],
            categories: [],
  


            addModal: {
                visible: false,
                message: '',

            name: '',
            size: 0,
            lifetime: "seasonal",
            price: 0.00,
            description: '',
            expiredAt: this.makeTomorrowDateString(),
            categoryId: 1,
            userId: Number(getId()),
            country: '',
            color: 'crvena',
            },

            editModal: {
                visible: false,
                message: '',

                flowerId: 0,
                name: '',
                size: 1,
                lifetime: "seasonal",
                price: 1.00,
                description: '',
                expiredAt: this.makeTomorrowDateString(),
                categoryId: 1,
                userId: Number(getId()),
                country: '',
                color: 'crvena',
            },
        };
    }


    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: newState,
            })
        ));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: newValue,
            })
        ));
    }
    private setAddModalDateFieldState(fieldName: string, newValue: Date) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: newValue,
            })
        ));
    }
    
    private setAddModalNumberFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            })
        ));
    }

    private async addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setAddModalNumberFieldState('categoryId', event.target.value);
     }
     private async editModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setEditModalNumberFieldState('categoryId', event.target.value);
     }


    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                visible: newState,
            })
        ));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [ fieldName ]: newValue,
            })
        ));
    }
    
    private setEditModalNumberFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            })
        ));
    }


    componentDidMount() {
        this.getCategories();
        this.getFlowers();
    }

   
    private getCategories() {
        api('/api/category/', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
            this.putCategoriesInState(res.data);
        });
    }

    private putCategoriesInState(data?: ApiCategoryDto[]) {
        const categories: CategoryType[] | undefined = data?.map(category => {
            return {
                categoryId: category.categoryId,
                name: category.name,
                imagePath: category.imagePath,
            };
        });
       
        this.setState(Object.assign(this.state, {
            categories: categories,
        }));
    }

    private getFlowers() {       
        api('/api/flower/search/', 'post', {
            userId: Number(getId()), 
        })
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
            let data:ApiResponse[] = res.data;
            if(data[0]===undefined)
            return;
            this.putFlowersInState(res.data);
        });
    }

    private putFlowersInState(data?: ApiFlowerDto[]) {
        const flowers: ApiFlowerDto[] | undefined = data?.map(flower => {
            return {
                flowerId: flower.flowerId,
                name: flower.name,
                size: flower.size,
                lifetime: flower.lifetime,
                price: flower.price,
                description: flower.description,
                createdAt: flower.createdAt,
                expiredAt: flower.expiredAt,
                categoryId: flower.categoryId,
                userId: flower.userId,
                country: flower.country,
                color: flower.color,

                pictures: flower.pictures,
                category: flower.category,
                user: flower.user
            };
        });

        this.setState(Object.assign(this.state, {
            flowers: flowers,
        }));
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        }));
    }

    
    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/login" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role="user" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faListAlt } /> Moji oglasi
                        </Card.Title>

                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan={ 7 }></th>
                                    <th className="text-center">
                                        <Button variant="primary" size="sm"
                                            onClick={ () => this.showAddModal() }>
                                            <FontAwesomeIcon icon={ faPlus } /> Dodaj
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Ime</th>
                                    <th>Kategorija</th>
                                    <th>Datum objave oglasa</th>
                                    <th>Datum isteka oglasa</th>
                                    <th className="text-right">Cena (din)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                { this.state.flowers.map(flower => {
                                   if(!this.checkFlowerExpiredDate(String(flower.expiredAt)))
                                    return (
                                    <tr>
                                        <td className="text-right">{ flower.flowerId }</td>
                                        <td>{ flower.name }</td>
                                        <td>{ flower.category?.name }</td>
                                        <td>{ this.makeDateString(String(flower.createdAt)) }</td>
                                        <td>{ this.makeDateString(String(flower.expiredAt))}</td>
                                        <td className="text-right">{ flower.price }</td>
                                        <td className="text-center">
                                            <Link to={ "/dashboard/picture/" + flower.flowerId }
                                                  className="btn btn-sm btn-info mr-3">
                                                <FontAwesomeIcon icon={ faImages } /> Slike
                                            </Link>

                                            <Button variant="info" size="sm"
                                                onClick={ () => this.showEditModal(flower) }>
                                                <FontAwesomeIcon icon={ faEdit } /> Izmeni
                                            </Button>
                                        </td>
                                        <td className="text-center"><Button variant="danger" size="sm"
                                                onClick={ () => this.doDelteFlower(flower.flowerId) }>
                                                <FontAwesomeIcon icon={ faTrash } /> Obriši
                                            </Button></td>
                                    </tr>
                                 ) }, this) }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.addModal.visible }
                       onHide={ () => this.setAddModalVisibleState(false) }
                       onEntered={ () => {
                            if (document.getElementById('pictures')) {
                                const filePicker: any = document.getElementById('pictures');
                                filePicker.value = '';
                            }
                        } }>
                    <Modal.Header closeButton>
                        <Modal.Title>Dodaj novi oglas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label htmlFor="add-name">Naziv</Form.Label>
                            <Form.Control id="add-name" type="text"  value={ this.state.addModal.name }
                                onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } />
                        </Form.Group> 
                        <Form.Group>
                            <Form.Label htmlFor="add-size">Veličina (cm)</Form.Label>
                            <Form.Control id="add-size" type="number" min={ 1.00 } step={ 1.00 } value={ this.state.addModal.size }
                                onChange={ (e) => this.setAddModalNumberFieldState('size', e.target.value) } />
                        </Form.Group>  
                        <Form.Group>
                            <Form.Label htmlFor="add-price">Cena (din)</Form.Label>
                            <Form.Control id="add-price" type="number" min={ 1.00 } step={ 1.0 } value={ this.state.addModal.price }
                                onChange={ (e) => this.setAddModalNumberFieldState('price', e.target.value) } />
                        </Form.Group>   
                        <Form.Group>
                            <Form.Label htmlFor="add-description">Opis</Form.Label>
                            <Form.Control id="add-description" as="textarea" value={ this.state.addModal.description }
                                onChange={ (e) => this.setAddModalStringFieldState('description', e.target.value) }
                                rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-expiredat">Datum isteka oglasa</Form.Label>
                            <Form.Control id="add-expiredat" type="date"  min={String(this.makeTomorrowDateString())} value={this.makeDateStringForCalendar(String(this.state.addModal.expiredAt))}
                                onChange={ (e) => this.setAddModalStringFieldState('expiredAt', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-country">Zemlja porekla</Form.Label>
                            <Form.Control id="add-country" type="text" value={ this.state.addModal.country }
                                onChange={ (e) => this.setAddModalStringFieldState('country', e.target.value) } />
                        </Form.Group> 
                        <Form.Group>
                            <Form.Label htmlFor="add-color">Boja</Form.Label>
                            <Form.Control id="add-color" as="select" value={  this.state.addModal.color.toString() }
                                onChange={ (e) => this.setAddModalStringFieldState('color', e.target.value) }>
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
                            <Form.Label htmlFor="add-categoryId">Kategorija</Form.Label>
                            <Form.Control id="add-categoryId" as="select" 
                                onChange={ (e) => this.addModalCategoryChanged(e as any) }>
                                { this.state.categories.map(category => (
                                    <option value={ category.categoryId?.toString() }>
                                        { category.name }
                                    </option>
                                )) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-lifetime">Životni vek</Form.Label>
                            <Form.Control id="add-lifetime" as="select" value={   this.state.addModal.lifetime.toString() }
                                onChange={ (e) => this.setAddModalStringFieldState('lifetime', e.target.value) }>
                                <option value="seasonal">Sezonsko</option>
                                <option value="annual">Godišnje</option>
                                <option value="perennial">Višegodišnje</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="pictures">Slika oglasa</Form.Label>
                            <Form.File id="pictures" />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doAddFlower() }>
                                <FontAwesomeIcon icon={ faPlus } /> Dodaj novi oglas
                            </Button>
                        </Form.Group>                
                    </Modal.Body>
                    { this.state.addModal.message ? (
                            <Alert variant="danger" value={ this.state.addModal.message } />
                        ) : '' }
                </Modal>







                <Modal size="lg" centered show={ this.state.editModal.visible }
                       onHide={ () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Izmeni oglas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label htmlFor="edit-name">Naziv</Form.Label>
                            <Form.Control id="edit-name" type="text"  value={ this.state.editModal.name }
                                onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } />
                        </Form.Group> 
                        <Form.Group>
                            <Form.Label htmlFor="edit-size">Veličina (cm)</Form.Label>
                            <Form.Control id="edit-size" type="number" min={ 1.00 } step={ 1.00 } value={ this.state.editModal.size }
                                onChange={ (e) => this.setEditModalNumberFieldState('size', e.target.value) } />
                        </Form.Group>  
                        <Form.Group>
                            <Form.Label htmlFor="edit-price">Cena (din)</Form.Label>
                            <Form.Control id="edit-price" type="number" min={ 1.00 } step={ 1.0 } value={ this.state.editModal.price }
                                onChange={ (e) => this.setEditModalNumberFieldState('price', e.target.value) } />
                        </Form.Group>   
                        <Form.Group>
                            <Form.Label htmlFor="edit-description">Opis</Form.Label>
                            <Form.Control id="edit-description" as="textarea" value={ this.state.editModal.description }
                                onChange={ (e) => this.setEditModalStringFieldState('description', e.target.value) }
                                rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-expiredat">Datum isteka oglasa</Form.Label>
                            <Form.Control id="edit-expiredat" type="date"min={String(this.makeTomorrowDateString())}  value={this.makeDateStringForCalendar(String(this.state.editModal.expiredAt))}
                                onChange={ (e) => this.setEditModalStringFieldState('expiredAt', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-country">Zemlja porekla</Form.Label>
                            <Form.Control id="edit-country" type="text" value={ this.state.editModal.country }
                                onChange={ (e) => this.setEditModalStringFieldState('country', e.target.value) } />
                        </Form.Group> 
                        <Form.Group>
                            <Form.Label htmlFor="edit-color">Boja</Form.Label>
                            <Form.Control id="edit-color" as="select" value={  this.state.editModal.color }
                                onChange={ (e) => this.setEditModalStringFieldState('color', e.target.value) }>
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
                            <Form.Label htmlFor="edit-categoryId">Kategorija</Form.Label>
                            <Form.Control id="edit-categoryId" as="select" 
                                onChange={ (e) => this.editModalCategoryChanged(e as any) }>
                                { this.state.categories.map(category => (
                                    <option value={ category.categoryId?.toString() }>
                                        { category.name }
                                    </option>
                                )) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-lifetime">Životni vek</Form.Label>
                            <Form.Control id="edit-lifetime" as="select" value={   this.state.editModal.lifetime.toString() }
                                onChange={ (e) => this.setEditModalStringFieldState('lifetime', e.target.value) }>
                                <option value="seasonal">Sezonsko</option>
                                <option value="annual">Godišnje</option>
                                <option value="perennial">Višegodišnje</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doEditFlower() }>
                                <FontAwesomeIcon icon={ faSave } /> Izmeni olgas
                            </Button>
                        </Form.Group>
                        { this.state.editModal.message ? (
                            <Alert variant="danger" value={ this.state.editModal.message } />
                        ) : '' }
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }


    private showAddModal() {
        this.setAddModalStringFieldState('message', '');

        this.setAddModalStringFieldState('name', '');
        this.setAddModalNumberFieldState('size', '1');
        this.setAddModalStringFieldState('lifetime', 'seasonal');
        this.setAddModalNumberFieldState('price', '1');
        this.setAddModalStringFieldState('description', '');
        this.setAddModalStringFieldState('expiredAt', '');
        this.setAddModalNumberFieldState('categoryId', '1');
        this.setAddModalStringFieldState('country', '');
        this.setAddModalStringFieldState('color', 'crvena');

        this.setAddModalVisibleState(true);
    }

    private doAddFlower() {
       const filePicker: any = document.getElementById('pictures');
        
        if (filePicker?.files.length === 0) {
            this.setAddModalStringFieldState('message', 'Morate odabrati datoteku za slanje!');
            return;
      }
      
        api('/api/flower/', 'post', {
            name: this.state.addModal.name,
            size: this.state.addModal.size,
            lifetime: this.state.addModal.lifetime,
            price: this.state.addModal.price,
            description: this.state.addModal.description,
            expiredAt: this.state.addModal.expiredAt,
            categoryId: this.state.addModal.categoryId,
            userId: getId(),
            country:  this.state.addModal.country,
            color: this.state.addModal.color
        })
        .then(async (res: ApiResponse) => {
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }

            if (res.status === "error") {
                this.setAddModalStringFieldState('message', JSON.stringify(res.status));
                return;
            }

            const flowerId: number = res.data.flowerId;

           const file = filePicker.files[0];
            await this.doUpload(flowerId);
            
            this.setAddModalVisibleState(false);
            this.getFlowers();
            this.refreshPage();
        });
    }
    private async doUpload(flowerId: number) {

        const filePicker: any = document.getElementById('pictures');

        if (filePicker?.files.length === 0) {
            return;
        }

        const file = filePicker.files[0];
        await this.uploadFlowerPicture(flowerId, file);
        filePicker.value = '';

       
       }
    private async uploadFlowerPicture(flowerId: number, file: File) {
        
       
        return await apiFile('/api/flower/' + flowerId + '/uploadPicturesF/', 'pictures', file);
    }

  

    private async showEditModal(flower: ApiFlowerDto) {
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('flowerId', flower.flowerId);

        this.setEditModalStringFieldState('name',  String(flower.name));
        this.setEditModalNumberFieldState('size', String(flower.size));
        this.setEditModalStringFieldState('lifetime',  String(flower.lifetime));
        this.setEditModalNumberFieldState('price',  String(flower.price));
        this.setEditModalStringFieldState('description',  String(flower.description));
        this.setEditModalStringFieldState('expiredAt', String( flower.expiredAt));
        this.setEditModalNumberFieldState('categoryId', String(flower.categoryId));
        this.setEditModalStringFieldState('country', String(flower.country));
        this.setEditModalStringFieldState('color', String(flower.color));



        if (!flower.categoryId) {
            return;
        }

        const categoryId: number = flower.categoryId;


        this.setEditModalVisibleState(true);
    }

    private doEditFlower() {
        api('/api/flower/' + this.state.editModal.flowerId, 'post', {
            
            name: this.state.editModal.name,
            size: this.state.editModal.size,
            lifetime: this.state.editModal.lifetime,
            price: this.state.editModal.price,
            description: this.state.editModal.description,
            expiredAt: this.state.editModal.expiredAt,
            categoryId: this.state.editModal.categoryId,
            country: this.state.editModal.country,
            color: this.state.editModal.color

        })
        .then((res: ApiResponse) => {
            
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }

            if (res.status === "error") {
                this.setAddModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }

            this.setEditModalVisibleState(false);
            this.getFlowers();
        });
    }
    private doDelteFlower(flowerId: number) {
        if (!window.confirm('Jeste li sigurni?')) {
            return;
        }

        //delte pictures for flower
        api('/api/flower/' + flowerId+'/deletePicture/', 'delete', {})
        .then((res: ApiResponse) => {
            
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }

            if (res.status === "error") {
                return;
            }
            this.getFlowers();
        });

        //hide flower
        api('/api/flower/hide/' + flowerId, 'post', {})
        .then((res: ApiResponse) => {
            
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }

            if (res.status === "error") {
                return;
            }
            this.getFlowers();
        });
        
    }
    private makePrimaryPicture(flowerId: number , imagePath: string) {
       
        //http://localhost:3000/api/flower/12/setPrimaryPicture
        api('/api/flower/' + flowerId + '/setPrimaryPicture/', 'post', {
            imagePath: imagePath
        })
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login" || getId()===null) {
                this.setLogginState(false);
                return;
            }
            this.getFlowers();
        })
    }
checkFlowerExpiredDate(expiredAtDate: string | undefined){
        var today = new Date();
        if(expiredAtDate===undefined)
            return;
        var givenDate = new Date(expiredAtDate);
        return givenDate < today;
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
    private makeDateStringForCalendar(fullDate: string): string
    {     //2019-02-18
        // 2020-08-26
        if(fullDate===null || fullDate==='')
        return '';
        var d = new Date(fullDate);
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

    private makeDateString(fullDate: string)
    {
        if(fullDate===null || fullDate==='')
            return '';
        var d = new Date(fullDate);
        var date = d.getDate();
        var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
        var year = d.getFullYear();      
        var dateStr = date+"/" + month + "/" + year;
        return dateStr;
    }
    refreshPage() {
        window.location.reload(false);
      }
}

export default UserDashboardFlower;