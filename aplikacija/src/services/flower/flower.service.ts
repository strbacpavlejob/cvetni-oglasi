import { Injectable } from '@nestjs/common';
import { Flower } from 'src/entities/flower.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { addFlowerDto } from 'src/dtos/flower/add.flower.dto';
import { ApiResponse } from 'src/controllers/misc/api.response.class';
import { EditFlowerDto } from 'src/dtos/flower/edit.flower.dto';
import { FlowerSearchDto } from 'src/dtos/flower/flower.search.dto';

@Injectable()
export class FlowerService extends TypeOrmCrudService<Flower>
{
    constructor(
        @InjectRepository(Flower) private readonly flower: Repository<Flower>){
        super(flower);
    }

    add(data: addFlowerDto): Promise<Flower | ApiResponse>{
        
   
        
        let newFlower: Flower = new Flower();
        newFlower.name = data.name;
        newFlower.size = data.size;
        newFlower.lifetime = data.lifetime;
        newFlower.price = data.price;
        newFlower.description= data.description;
        newFlower.expiredAt = data.expiredAt;
        newFlower.categoryId = data.categoryId;
        newFlower.userId = data.userId;
        newFlower.country = data.country;
        newFlower.color = data.color;
        

        return new Promise((resolve)=> {
            this.flower.save(newFlower)
            .then(data => resolve(data))
            .catch(error =>{
                const response: ApiResponse = new ApiResponse("error", -4001,"Cannot add a new flower!");
                resolve(response);
            });
        })
    }
 
    async editById(data: EditFlowerDto, flowerId: number): Promise<Flower | ApiResponse>{
        let flower: Flower = await this.flower.findOne(flowerId); 
        
        if (flower === undefined)
        {
            return new Promise((resolve) =>             {
                resolve(new ApiResponse("error",-4002,"Cannot find a flower!"));
            })
        }

        

        flower.name = data.name;
        flower.size = data.size;
        flower.lifetime = data.lifetime;
        flower.price = data.price;
        flower.description= data.description;
        flower.expiredAt = data.expiredAt;
        flower.categoryId = data.categoryId;
        flower.country = data.country;
        flower.color = data.color;

        return this.flower.save(flower);
    }
    async hideById(flowerId: number): Promise<Flower | ApiResponse>{
        let flower: Flower = await this.flower.findOne(flowerId); 
        
        if (flower === undefined)
        {
            return new Promise((resolve) =>             {
                resolve(new ApiResponse("error",-4002,"Cannot find a flower!"));
            })
        }

        //setovanje na trenutno vreme tako da istekne oglas u sledecoj sekundi
        let today = new Date();

        let dateString = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        
        dateString = dateString + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const newDate = new Date(dateString);


        flower.expiredAt = newDate;

        return this.flower.save(flower);
    }
    async findFlowerPictures(flowerId): Promise<Flower[] | ApiResponse>{
        const builder = await this.flower.createQueryBuilder("flower");
        builder.leftJoinAndSelect("flower.pictures", "pictures");
        builder.leftJoinAndSelect("flower.user", "user");
        builder.leftJoinAndSelect("flower.category", "category");
        builder.where('flower.flowerId = :fId', { fId: flowerId });


        let flowers = await builder.getMany();

        if (flowers.length === 0) {
            return new ApiResponse("ok", 0, "No flowers found for these search parameters.");
        }

        return flowers;
    }

    async search(data: FlowerSearchDto): Promise<Flower[] | ApiResponse>{



        
        const builder = await this.flower.createQueryBuilder("flower");

        builder.leftJoinAndSelect("flower.pictures", "pictures");
        builder.leftJoinAndSelect("flower.user", "user");
        builder.leftJoinAndSelect("flower.category", "category");

        if (data.categoryId && typeof data.categoryId === 'number')
        builder.where('flower.categoryId = :catId', { catId: data.categoryId });

       if (data.userId && typeof data.userId === 'number')
        builder.andWhere('flower.userId = :userId', { userId: data.userId });

        if (data.keywords && data.keywords.length > 0) {
            builder.andWhere(`(
                                flower.name LIKE :kw OR
                                flower.description LIKE :kw
                              )`,
                              { kw: '%' + data.keywords.trim() + '%' });
        }

        //price
        if (data.priceMin && typeof data.priceMin === 'number') {
            builder.andWhere('flower.price >= :pmin', { pmin: data.priceMin });
        }

       if (data.priceMax && typeof data.priceMax === 'number') {
            builder.andWhere('flower.price <= :pmax', { pmax: data.priceMax });
        }

        //size
        if (data.sizeMin && typeof data.sizeMin === 'number') {
            builder.andWhere('flower.size >= :smin', { smin: data.sizeMin });
        }

        if (data.sizeMax && typeof data.sizeMax === 'number') {
            builder.andWhere('flower.size <= :smax', { smax: data.sizeMax });
        }

       //lifetime
       if (data.lifetime && typeof data.lifetime === 'string') {
        builder.andWhere('flower.lifetime = :lifetime', { lifetime: data.lifetime });
       }

        //color
        if (data.color && typeof data.color === 'string') {
        builder.andWhere('flower.color = :color', { color: data.color });
        }


        //date 
        if (data.createdAt && typeof data.createdAt === 'string') {
            builder.andWhere('flower.createdAt >= :dateCreated', { dateCreated: data.createdAt });
        }

        if (data.expiredAt && typeof data.expiredAt === 'string') {
            builder.andWhere('flower.expiredAt <= :dateExpired', { dateExpired: data.expiredAt });
        }

        let orderBy = 'flower.name';
        let orderDirection: 'ASC' | 'DESC' = 'ASC';

        if (data.orderBy) {
            orderBy = data.orderBy;

            if (data.orderBy === 'price') {
                orderBy = 'flower.price';
            }
    
            if (data.orderBy === 'name') {
                orderBy = 'flower.name';
            }
        }

        if (data.orderDirection) {
            orderDirection = data.orderDirection;
        }

      
        builder.orderBy(orderBy, orderDirection);

        let page = 0;
        let perPage: 5 | 10 | 25 | 50 | 75 = 25;

        if (data.page && typeof data.page === 'number') {
            page = data.page;
        }

        if (data.itemsPerPage && typeof data.itemsPerPage === 'number') {
            perPage = data.itemsPerPage;
        }

        builder.skip(page * perPage);
        builder.take(perPage);


        let flowers = await builder.getMany();

        if (flowers.length === 0) {
            return new ApiResponse("ok", 0, "No flowers found for these search parameters.");
        }

        return flowers;


    }
 }