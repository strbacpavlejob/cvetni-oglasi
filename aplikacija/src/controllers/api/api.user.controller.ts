import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { UserService } from "src/services/user/user.service";
import { User } from "src/entities/user.entity";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { EditUserDto } from "src/dtos/user/edit.user.dto";
import { ApiResponse } from "../misc/api.response.class";

@Controller('api/user')
export class UserController{
    constructor(private userService: UserService
    ) { }

    @Get() //http://localhost:3000/api/user
    getWorld(): Promise<User[]> {
      return this.userService.getAll();
    }

    @Get(':id') // GET http://localhost:3000/api/user/2/
    getSingleUser(@Param('id') userId: number): Promise<User | ApiResponse> {
      return new Promise(async (resolve)=>{
        let user = await this.userService.getById(userId);
  
        if(user=== undefined){
          resolve(new ApiResponse("error", -2002,"Cannot find a user"));
        }
  
        resolve(user);
      });
    
    }
 
    @Post(':id') // POST http://localhost:3000/api/user/2
    editById(@Param('id') id: number, @Body() data: EditUserDto): Promise<User | ApiResponse> {
      
      return this.userService.editById(id, data);
    }

}