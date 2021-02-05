import { Controller, Post, Delete, Param, Patch, Put } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "src/entities/category.entity";
import { CategoryService } from "src/services/category/category.service";
import { ApiResponse } from "../misc/api.response.class";


@Controller('api/category')
@Crud({
    model: {
        type: Category
    },
    params: {
        id: {
            field: 'categoryId',
            type: 'number',
            primary: true
        }
    }
  
})
export class CategoryController {
    constructor(public service: CategoryService) {}

    //pregazene metode

    @Post() // POST http://localhost:3000/api/category
    addCatefory(): ApiResponse {
    return new ApiResponse("error",-1001,"Cannot add a new category!");
    }
    @Put() // POST http://localhost:3000/api/category
    putCatefory(): ApiResponse {
    return new ApiResponse("error",-1001,"Cannot add a new category!");
    }
    @Put("/:id") // POST http://localhost:3000/api/category
    putSingleCatefory(@Param('id') categoryId: number): ApiResponse {
    return new ApiResponse("error",-1001,"Cannot add a new category!");
    }
    @Patch("/:id") // PATCH http://localhost:3000/api/category/1
    editCatefory(@Param('id') categoryId: number): ApiResponse {
    return new ApiResponse("error",-1002,"Cannot edit a category!");
    }

    @Delete("/:id") // DELTE http://localhost:3000/api/category/1
    deleteCatefory(@Param('id') categoryId: number): ApiResponse {
    return new ApiResponse("error",-1003,"Cannot delete a category!");
    }

}