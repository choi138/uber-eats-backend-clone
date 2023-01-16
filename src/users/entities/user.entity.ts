import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";


export enum UserRole {
    Client = 'Client',
    Owner = 'Owner',
    Delivery = 'Delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Column({ unique: true })
    @Field((type) => String)
    @IsEmail()
    email: string;

    @Column({ select: true })
    @Field((type) => String)
    @IsString()
    password: string

    @Column({ type: 'enum', enum: UserRole })
    @Field((type) => UserRole)
    role: UserRole;

    @Column({ default: false })
    @Field((type) => Boolean)
    @IsBoolean()
    verified: boolean;
}