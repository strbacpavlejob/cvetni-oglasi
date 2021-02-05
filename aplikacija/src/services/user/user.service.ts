import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddUserDto } from 'src/dtos/user/add.user.dto';
import { EditUserDto } from 'src/dtos/user/edit.user.dto';
import { ApiResponse } from 'src/controllers/misc/api.response.class';
import { UserToken } from 'src/entities/user-token.entity';



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>,
        @InjectRepository(UserToken)
        private readonly userToken: Repository<UserToken>,
    ) {}

    getAll(): Promise<User[]>{
        return this.user.find();
    }
    getById(id: number): Promise<User>
    {
        return this.user.findOne(id);
    }


    async getByEmail(emailValue: string): Promise<User | null> {
        const user = await this.user.findOne({
            email: emailValue
        });

        if (user) {
            return user;
        }

        return null;
    }


    add(data: AddUserDto): Promise<User | ApiResponse>{
        //DTO -> Model
       
        //kreiranje hash-a
        const crypto = require('crypto');
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();
        
        let newUser: User = new User();
        newUser.email = data.email;
        newUser.passwordHash = passwordHashString;

        newUser.forename = data.forename;
        newUser.surname = data.surname;
        newUser.phoneNumber = data.phoneNumber;
        newUser.city = data.city;


        return new Promise((resolve)=> {
            this.user.save(newUser)
            .then(data => resolve(data))
            .catch(error =>{
                const response: ApiResponse = new ApiResponse("error", -2001,"Cannot create a user");
                resolve(response);
            });
        })
    }

    async editById(id: number, data: EditUserDto): Promise<User | ApiResponse>{
        let user: User = await this.user.findOne(id); 
        
        if (user === undefined)
        {
            return new Promise((resolve) =>             {
                resolve(new ApiResponse("error",-2002,"Cannot find a user"));
            })
        }

        const crypto = require('crypto');
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        user.passwordHash = passwordHashString;
        user.forename = data.forename;
        user.surname = data.surname;
        user.phoneNumber = data.phoneNumber;
        user.city = data.city;

        return this.user.save(user);
    }

    async addToken(userId: number, token: string, expiresAt: string) {
        const userToken = new UserToken();
        userToken.userId = userId;
        userToken.token = token;
        userToken.expiresAt = expiresAt;

        return await this.userToken.save(userToken);
    }

    async getUserToken(token: string): Promise<UserToken> {
        return await this.userToken.findOne({
            token: token,
        });
    }

    async invalidateToken(token: string): Promise<UserToken | ApiResponse> {
        const userToken = await this.userToken.findOne({
            token: token,
        });

        if (!userToken) {
            return new ApiResponse("error", -10001, "No such refresh token!");
        }

        userToken.isValid = 0;

        await this.userToken.save(userToken);

        return await this.getUserToken(token);
    }

    async invalidateUserTokens(userId: number): Promise<(UserToken | ApiResponse)[]> {
        const userTokens = await this.userToken.find({
            userId: userId,
        });

        const results = [];

        for (const userToken of userTokens) {
            results.push(this.invalidateToken(userToken.token));
        }

        return results;
    }

}
