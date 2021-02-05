import { Injectable } from '@nestjs/common';
import { Picture } from 'src/entities/picture.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class PictureService extends TypeOrmCrudService<Picture>
{
    constructor(
        @InjectRepository(Picture) private readonly picture: Repository<Picture>){
        super(picture);
    }

    
    async add(picture: Picture) {
        return await this.picture.save(picture);
    }

    async editById(id: number, picture: Picture){
        return await this.picture.update(id, picture);
    }

    async deleteById(id: number) {
        return await this.picture.delete(id);
    }
}
