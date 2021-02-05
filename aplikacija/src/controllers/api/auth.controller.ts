import { Controller, Post, Body, Req, HttpException, HttpStatus } from "@nestjs/common";
import * as crypto from 'crypto';

import * as jwt from 'jsonwebtoken';

import { Request } from 'express';

import { UserService } from "src/services/user/user.service";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { ApiResponse } from "../misc/api.response.class";
import { LoginInfoUserDto } from "src/dtos/user/login.info.user.dto";
import { JwtDataUserDto } from "src/dtos/user/jwt.data.user.dto";
import { jwtSecret } from "config/jwt.secret.config";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { User } from "src/entities/user.entity";
import { JwtRefreshDataDto } from "src/dtos/user/jwt.refresh.dto";
import { UserRefreshTokenDto } from "src/dtos/user/user.refresh.token.dto";

@Controller('auth') // http://localhost:3000/auth/
export class AuthController {
    constructor(public userService: UserService) { }

    @Post('login') // POST http://localhost:3000/auth/login/
    async doLogin(@Body() data: LoginUserDto, @Req() req: Request): Promise<LoginInfoUserDto | ApiResponse> {
        const user = await this.userService.getByEmail(data.email);
        if (!user) {
            return new ApiResponse('error', -3001,"Cannot find a user with that email!");
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();
        if (passwordHashString !== user.passwordHash) {
            return new ApiResponse('error', -3002,"Wrong password!");
        }

        const jwtData = new JwtDataUserDto();
        jwtData.role = "user";
        jwtData.id = user.userId;
        jwtData.identity = user.email;
        jwtData.exp = this.getDatePlus(60 * 45);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.role = jwtData.role;
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.identity = jwtData.identity;
        jwtRefreshData.exp = this.getDatePlus(60 * 60 * 24 * 31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;

        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoUserDto(
            user.userId,
            user.email,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp),
        );

        await this.userService.addToken(
            user.userId,
            refreshToken,
            this.getDatabseDateFormat(this.getIsoDate(jwtRefreshData.exp))
        );

        return new Promise(resolve => resolve(responseObject));
    }
    @Post('user/refresh') // http://localhost:3000/auth/user/refresh/
    async userTokenRefresh(@Req() req: Request, @Body() data: UserRefreshTokenDto): Promise<LoginInfoUserDto | ApiResponse> {
        const userToken = await this.userService.getUserToken(data.token);

        if (!userToken) {
            return new ApiResponse("error", -10002, "No such refresh token!");
        }

        if (userToken.isValid === 0) {
            return new ApiResponse("error", -10003, "The token is no longer valid!");
        }

        const sada = new Date();
        const datumIsteka = new Date(userToken.expiresAt);

        if (datumIsteka.getTime() < sada.getTime()) {
            return new ApiResponse("error", -10004, "The token has expired!");
        }

        let jwtRefreshData: JwtRefreshDataDto;
        
        try {
            jwtRefreshData = jwt.verify(data.token, jwtSecret);
        } catch (e) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (!jwtRefreshData) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ip !== req.ip.toString()) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ua !== req.headers["user-agent"]) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        const jwtData = new JwtDataUserDto();
        jwtData.role = jwtRefreshData.role;
        jwtData.id = jwtRefreshData.id;
        jwtData.identity = jwtRefreshData.identity;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoUserDto(
            jwtData.id,
            jwtData.identity,
            token,
            data.token,
            this.getIsoDate(jwtRefreshData.exp),
        );

        return responseObject;
    }
    @Post('register') // POST http://localhost:3000/auth/register/
    add(@Body() data: AddUserDto): Promise<User | ApiResponse> {
      return this.userService.add(data);
    }
    private getDatePlus(numberOfSeconds: number): number {
        return new Date().getTime() / 1000 + numberOfSeconds;
    }

    private getIsoDate(timestamp: number): string {
        const date = new Date();
        date.setTime(timestamp * 1000);
        return date.toISOString();
    }

    private getDatabseDateFormat(isoFormat: string): string {
        return isoFormat.substr(0, 19).replace('T', ' ');
    }
  
}
