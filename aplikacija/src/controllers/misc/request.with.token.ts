import { JwtDataUserDto } from "src/dtos/user/jwt.data.user.dto";
declare module 'express' {
    interface Request {
        token: JwtDataUserDto;
    }
}
