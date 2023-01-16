import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { Verification } from './users/entities/verificatoin.entity';

console.log(Joi)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      // ignoreEnvFile: process.env.NODE_ENV === 'prod',
      // validationSchema: Joi.object({
      //   NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
      //   DB_HOST: Joi.string().required(),
      //   DB_PORT: Joi.string().required(),
      //   DB_USERNAME: Joi.string().required(),
      //   DB_PASSWORD: Joi.string().required(),
      //   DB_NAME: Joi.string().required(),
      // })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: process.env.DB_HOST,
      host: 'localhost',
      // port: +process.env.DB_PORT,
      port: 5432,
      // username: process.env.DB_USERNAME,
      username: 'apple',
      // password: process.env.DB_PASSWORD,
      password: 'kidjustin0524',
      // database: process.env.DB_NAME,
      database: 'uber-eats-clone',
      synchronize: process.env.NODE_ENV != 'prod',
      logging:
        process.env.NODE_ENV != 'prod' && process.env.NODE_ENV !== 'test',
      entities: [User, Verification]
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
