import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Picture } from "src/entities/picture.entity";
import { PictureService } from "src/services/picture/picture.service";


@Controller('api/picture')
@Crud({
    model: {
        type: Picture
    },
    params: {
        id: {
            field: 'pictureId',
            type: 'number',
            primary: true
        }
    },
    query:{
        join:{
            flower:{
                eager: true
            }
        }
    }
  
})
export class PictureController {
    constructor(public service: PictureService) {}
}