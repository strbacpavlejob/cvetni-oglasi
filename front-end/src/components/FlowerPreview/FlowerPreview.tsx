import React from 'react';
import FlowerType from '../../types/FlowerType';
import { Col, Card } from 'react-bootstrap';
import { ApiConfig } from '../../config/api.config';
import { Link } from 'react-router-dom';

interface FlowerPreviewProperties {
    flower: FlowerType;
}

export default class FlowerPreview extends React.Component<FlowerPreviewProperties> {
    render() {
              
            return (
                
            <Col xs="12" sm="6" md="6" lg="4">
                <Card className="mb-3">
                    <Card.Header>
                        <img src={ ApiConfig.PHOTO_BASE + 'small/' + this.props.flower.imageUrl }
                             alt={ this.props.flower.name }
                             className="w-100" />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="p">
                            { this.props.flower.name }
                        </Card.Title>
                        <Card.Text>
                            Cena: { Number(this.props.flower.price).toFixed(0) } Din
                        </Card.Text>
                        <Link target="_blank"  to={ '/flower/' + this.props.flower.flowerId }
                              className="btn btn-sm btn-primary btn-block">
                            Detaljnije
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    checkFlowerExpiredDate(expiredAtDate: string | undefined){
        var today = new Date();
        if(expiredAtDate===undefined)
            return;
        var givenDate = new Date(expiredAtDate);
        return givenDate < today;
    }
}

