import { Controller, Param, UploadedFile, Req, Post, UseInterceptors, Delete, Patch, Body, UploadedFiles, Get } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Flower } from "src/entities/flower.entity";
import { FlowerService } from "src/services/flower/flower.service";
import { PictureService } from "src/services/picture/picture.service";
import { ApiResponse } from "../misc/api.response.class";
import { Picture } from "src/entities/picture.entity";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { diskStorage } from "multer";
import { StorageConfig } from "config/storage.config";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { EditPrimaryPictureDTO } from "src/dtos/picture/edit.primary.picture.dto";
import { addFlowerDto } from "src/dtos/flower/add.flower.dto";
import { EditFlowerDto } from "src/dtos/flower/edit.flower.dto";
import { rejects } from "assert";
import { FlowerSearchDto } from "src/dtos/flower/flower.search.dto";

@Controller('api/flower')
@Crud({
    model: {
        type: Flower
    },
    params: {
        id: {
            field: 'flowerId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            category: {
                eager: true
            },
            user: {
                eager: true
            }
        }
    }

})
export class FlowerController {
    constructor(public service: FlowerService,
        public pictureService: PictureService) { }

 
     // GET http://localhost:3000/api/flower/findpictures/2
    @Get("/findpictures/:id")
    async findFlowerPictures(@Param('id') flowerId: number): Promise<Flower[] | ApiResponse> {
        return await this.service.findFlowerPictures(flowerId);
    }   
    // POST http://localhost:3000/api/flower/search
    @Post("/search")
    async search(@Body() data: FlowerSearchDto): Promise<Flower[] | ApiResponse> {
        return await this.service.search(data);
    }   
    @Post() // POST http://localhost:3000/api/flower/
    addFlower(@Body() data: addFlowerDto): Promise<Flower | ApiResponse> {
        return this.service.add(data);
    }
    @Post(":id") // POST http://localhost:3000/api/flower/1
    editFlower(@Body() data: EditFlowerDto, @Param('id') flowerId: number): Promise<Flower | ApiResponse> {
        return this.service.editById(data, flowerId);
    }
    @Post("hide/:id") // POST http://localhost:3000/api/hide/flower/1
    hideFlower(@Param('id') flowerId: number): Promise<Flower | ApiResponse> {
        return this.service.hideById(flowerId);
    }



    @Post(':id/uploadPictures/') // POST http://localhost:3000/api/flower/2/uploadPicture/
    @UseInterceptors(
        FilesInterceptor('pictures', 5, {
            storage: diskStorage({
                destination: StorageConfig.picture.destination,
                filename: (req, file, callback) => { // callback(err, filename)



                    let filename: string = file.originalname;          // "Neka-Datoteka  (11).jpg"
                    filename = filename.toLowerCase();                 // "neka-datoteka  (11).jpg"
                    filename = filename.replace(/\s+/g, '-');          // "neka-datoteka-(11).jpg"
                    filename = filename.replace(/[^a-z0-9\.\-]/g, ''); // "neka-datoteka-11.jpg"

                    const sada = new Date();
                    let prefiksDatuma = '';
                    prefiksDatuma += sada.getFullYear().toString();
                    prefiksDatuma += (sada.getMonth() + 1).toString();
                    prefiksDatuma += sada.getDate();

                    const prefixRandom: string = new Array(10).fill(' ').map(e => (Math.random() * 9).toFixed(0).toString()).join('');
                    const finalFilename = prefiksDatuma + '-' + prefixRandom + '-' + filename;

                    callback(null, finalFilename); // 2020430-1234567890-neka-datoteka-11.jpg


                }
            }),
            fileFilter: (req, file, callback) => {


                if (!file.originalname.toLowerCase().match(/\.(jpg|png)$/)) {
                    req.fileFilterError = 'Bad extension!';
                    callback(null, false); // !!! daje error u konzoli!!!
                    return;
                }

                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
                    req.fileFilterError = 'Bad file content!';
                    callback(null, false);
                    return;
                }

                callback(null, true);



            },
            limits: { files: 5, fileSize: StorageConfig.picture.fileSize },

        }),
    )


    async uploadPictures(
        @Param('id') flowerId: number,
        @UploadedFiles() pictures,
        @Req() req
    ): Promise <ApiResponse> {
    
        //temps
        var first_iteration = true;
        let flower: Flower = await this.service.findOne(flowerId);
        let greska= await false;
    
    
        if(pictures.length == 0) {
            return new ApiResponse('error', -5004, 'Pictures not found!');//File is missing
        }    
        else{
           
            pictures.forEach(async picture => {
    
                //greske o pojedinacnoj slici           
                if (flower === undefined) {
                    fs.unlinkSync(picture.path); 
                }
                if (req.fileFilterError !== undefined) {
                    greska=true;
                    fs.unlinkSync(picture.path);                
                }
                const fileTypeResult = await fileType.fromFile(picture.path);
    
                if (!fileTypeResult) {
                    greska=true;
                    fs.unlinkSync(picture.path);            
                }
    
                
                
                const realMimeType: string = fileTypeResult.mime;
    
                if (!(realMimeType.includes('jpeg') || realMimeType.includes('png'))) {
                    
                    greska=true; 
                    fs.unlinkSync(picture.path);                       
                }
    
                
    
                //cuvanje male slike na storege-u
                await this.createResizedImage(picture, StorageConfig.picture.resize.small);
    
    
                //priprema podataka za sliku za bazu podataka
                const newPicture: Picture = new Picture();
                newPicture.flowerId = flowerId;
    
                newPicture.imagePath = picture.filename;
                newPicture.isPrimary = 0;
                
                
                //Cuvanje podataka u bazu
                const savedPicture = await this.pictureService.add(newPicture);
                if (!savedPicture) {
                    //brisanje ukoliko nije proslo dobro snimanje
                    fs.unlinkSync(picture.imagePath);
                    return new ApiResponse('error', -5002, "File is not uploaded!");
                }
            });
            if (flower === undefined) {
                return new ApiResponse("error", -4002, "Cannot find a flower!");   
            }
            if(greska)
            {
                return new ApiResponse('error', -5003, 'All or some of the files have a bad file content!');
            }
            else{
                return new ApiResponse('ok', 0, 'All pictures were uploaded.');
            }
        }  
    }



    //with primary
    @Post(':id/uploadPicturesF/') // POST http://localhost:3000/api/flower/2/uploadPicture/
    @UseInterceptors(
        FilesInterceptor('pictures', 5, {
            storage: diskStorage({
                destination: StorageConfig.picture.destination,
                filename: (req, file, callback) => { // callback(err, filename)



                    let filename: string = file.originalname;          // "Neka-Datoteka  (11).jpg"
                    filename = filename.toLowerCase();                 // "neka-datoteka  (11).jpg"
                    filename = filename.replace(/\s+/g, '-');          // "neka-datoteka-(11).jpg"
                    filename = filename.replace(/[^a-z0-9\.\-]/g, ''); // "neka-datoteka-11.jpg"

                    const sada = new Date();
                    let prefiksDatuma = '';
                    prefiksDatuma += sada.getFullYear().toString();
                    prefiksDatuma += (sada.getMonth() + 1).toString();
                    prefiksDatuma += sada.getDate();

                    const prefixRandom: string = new Array(10).fill(' ').map(e => (Math.random() * 9).toFixed(0).toString()).join('');
                    const finalFilename = prefiksDatuma + '-' + prefixRandom + '-' + filename;

                    callback(null, finalFilename); // 2020430-1234567890-neka-datoteka-11.jpg


                }
            }),
            fileFilter: (req, file, callback) => {


                if (!file.originalname.toLowerCase().match(/\.(jpg|png)$/)) {
                    req.fileFilterError = 'Bad extension!';
                    callback(null, false); // !!! daje error u konzoli!!!
                    return;
                }

                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
                    req.fileFilterError = 'Bad file content!';
                    callback(null, false);
                    return;
                }

                callback(null, true);



            },
            limits: { files: 5, fileSize: StorageConfig.picture.fileSize },

        }),
    )


    async uploadPicturesF(
        @Param('id') flowerId: number,
        @UploadedFiles() pictures,
        @Req() req
    ): Promise <ApiResponse> {
    
        //temps
        var first_iteration = true;
        let flower: Flower = await this.service.findOne(flowerId);
        let greska= await false;
    
    
        if(pictures.length == 0) {
            return new ApiResponse('error', -5004, 'Pictures not found!');//File is missing
        }    
        else{
           
            pictures.forEach(async picture => {
    
                //greske o pojedinacnoj slici           
                if (flower === undefined) {
                    fs.unlinkSync(picture.path); 
                }
                if (req.fileFilterError !== undefined) {
                    greska=true;
                    fs.unlinkSync(picture.path);                
                }
                const fileTypeResult = await fileType.fromFile(picture.path);
    
                if (!fileTypeResult) {
                    greska=true;
                    fs.unlinkSync(picture.path);            
                }
    
                //mime type 
                
                const realMimeType: string = fileTypeResult.mime;
    
                if (!(realMimeType.includes('jpeg') || realMimeType.includes('png'))) {
                    
                    greska=true; 
                    fs.unlinkSync(picture.path);                       
                }
    
                //pravljenje slike, pogledati u stari kod reciklirati nesto odatle
    
                //cuvanje male slike na storege-u
                await this.createResizedImage(picture, StorageConfig.picture.resize.small);
    
    
                //priprema podataka za sliku za bazu podataka
                const newPicture: Picture = new Picture();
                newPicture.flowerId = flowerId;
    
                newPicture.imagePath = picture.filename;
                newPicture.isPrimary = 0;
                if (first_iteration) {
                    newPicture.isPrimary = 1;
                    first_iteration = false;
                }
    
                
                //Cuvanje podataka u bazu
                const savedPicture = await this.pictureService.add(newPicture);
                if (!savedPicture) {
                    //brisanje ukoliko nije proslo dobro snimanje
                    fs.unlinkSync(picture.imagePath);
                    return new ApiResponse('error', -5002, "File is not uploaded!");
                }
            });
            if (flower === undefined) {
                return new ApiResponse("error", -4002, "Cannot find a flower!");   
            }
            if(greska)
            {
                return new ApiResponse('error', -5003, 'All or some of the files have a bad file content!');
            }
            else{
                return new ApiResponse('ok', 0, 'All pictures were uploaded.');
            }
        }  
    }



    async createResizedImage(picture, resizeOptions) {

        const destination = StorageConfig.picture.destination + // ../storage/picture/
            resizeOptions.directory +         // ../storage/picture/small/
            picture.filename;                   // ../storage/picture/small/file.jpg

        await sharp(picture.path)
            .resize({
                fit: 'cover',
                width: resizeOptions.width,
                height: null, //automatski izracunava visinu i zadrdava proporciju
            })
            .toFile(destination);



    }

    //POST http://localhost:3000/api/flower/2/setPrimaryPicture

    @Post(':flowerId/setPrimaryPicture/')
    async setPrimaryPicture(@Body() data: EditPrimaryPictureDTO,
        @Param('flowerId') flowerId: number

    ) {
        const pictures = await this.pictureService.find({
            flowerId: flowerId
        });

        if (!pictures) {
            return new ApiResponse("error", -5004, 'Pictures not found!');
        }

        let pictureMatch = false; //da li se poklapa slika 
        pictures.forEach(async picture => {



            const newPicture: Picture = new Picture();
            newPicture.flowerId = flowerId;
            newPicture.pictureId = picture.pictureId;
            newPicture.imagePath = picture.imagePath;
            newPicture.isPrimary = 0;


            if (data.imagePath == picture.imagePath) {
                newPicture.isPrimary = 1;
                pictureMatch = true;
            }


            const editResult = await this.pictureService.editById(picture.pictureId, newPicture);
            if (!editResult.affected) {
                return new ApiResponse("error", -5005, 'Picture not changed!');
            }
        });
        if (pictureMatch == false)
            return new ApiResponse("error", -5006, 'Wrong name for new primary picture!');

        return new ApiResponse("ok", 0, 'Primary picture has been changed.');

    }





    // DELETE http://localhost:3000/api/flower/1/deletePicture/
    @Delete(':flowerId/deletePicture/')
    async deleteAllPictures(
        @Param('flowerId') flowerId: number

    ) {

        const pictures = await this.pictureService.find({
            flowerId: flowerId
        });

        if (pictures.length == 0) {

            return new ApiResponse("error", -5004, 'Pictures not found.');
        }
        pictures.forEach(async picture => {
            try {



                fs.unlinkSync(StorageConfig.picture.destination + picture.imagePath);

                fs.unlinkSync(StorageConfig.picture.destination +
                    StorageConfig.picture.resize.small.directory +
                    picture.imagePath);
            } catch (e) { /* ... */ }

            const deleteResult = await this.pictureService.deleteById(picture.pictureId);
            if (!deleteResult.affected) {
                return new ApiResponse("error", -5007, 'Pictures not deleted!');
            }

        });
        return new ApiResponse("ok", 0, 'All pictures have been deleted.');
    }


    // DELETE http://localhost:3000/api/flower/1/deletePicture/12/
    @Delete(':flowerId/deletePicture/:pictureId')
    async deletePicture(
        @Param('flowerId') flowerId: number,
        @Param('pictureId') pictureId: number
    ) {
        const picture = await this.pictureService.findOne({
            pictureId: pictureId,
            flowerId: flowerId
        });

        if (!picture) {
            return new ApiResponse("error", -5008, 'Picture not found!');
        }

        try {
            fs.unlinkSync(StorageConfig.picture.destination + picture.imagePath);

            fs.unlinkSync(StorageConfig.picture.destination +
                StorageConfig.picture.resize.small.directory +
                picture.imagePath);
        } catch (e) { /* ... */ }

        const deleteResult = await this.pictureService.deleteById(pictureId);
        if (!deleteResult.affected) {
            return new ApiResponse("error", -5009, 'Picture not deleted!');
        }

        return new ApiResponse("ok", 0, 'One picture has been deleted.');
    }


}