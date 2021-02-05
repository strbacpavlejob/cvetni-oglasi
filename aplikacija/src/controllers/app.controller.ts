import { Controller, Get } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserService } from '../services/user/user.service';


@Controller()
export class AppController {

  constructor(
    private userService: UserService
  ){}
  
  @Get() //http://localhost:3000/
  getHello(): string {
    return "Hello World!";
  }

}
