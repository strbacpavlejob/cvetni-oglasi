import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Category } from 'src/entities/category.entity';
import { Flower } from 'src/entities/flower.entity';
import { Picture } from 'src/entities/picture.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from './services/user/user.service';
import { PictureService } from './services/picture/picture.service';
import { FlowerService } from './services/flower/flower.service';
import { CategoryService } from './services/category/category.service';
import { UserController } from './controllers/api/api.user.controller';
import { CategoryController } from './controllers/api/category.controller';
import { PictureController } from './controllers/api/picture.controller';
import { FlowerController } from './controllers/api/flower.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UserToken } from './entities/user-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Ako koristite MySQL, napisite mysql
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Category,        
        Flower,       
        Picture,
        User,
        UserToken
      ]
    }),
    TypeOrmModule.forFeature([User,Flower,Picture,Category,UserToken
    ])
  ],
  controllers: [AppController,
                UserController,
                CategoryController,
                PictureController,
                FlowerController,
                AuthController],
  providers: [UserService, PictureService, FlowerService, CategoryService],
  exports: [UserService,],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
            .exclude({path: 'auth/*', method: RequestMethod.ALL},
                     {path: '/api/category/*', method: RequestMethod.GET },
                     {path: '/api/flower/search/', method:RequestMethod.POST},
                     {path: '/api/flower/*', method: RequestMethod.GET },
                     {path: '/api/picture/*', method: RequestMethod.GET },
                     {path: '/api/user/*', method: RequestMethod.GET },
                     )
            .forRoutes(
                       {path: '/api/flower/*', method:RequestMethod.POST},
                       {path: '/api/flower/*', method:RequestMethod.DELETE},                       
                       {path: '/api/user/*', method:RequestMethod.POST},
                    );
  }
}
