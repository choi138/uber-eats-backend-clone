import { ArgsType, Field, ObjectType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { User } from "src/users/entities/user.entity";

@ArgsType()
export class UserPorfileInput{
    @Field((type) => Number)
    @IsNumber()
    userId:number
}

@ObjectType()
export class UserProfileOutput extends CoreOutput{
    @Field((type) => User, {nullable: true})
    user?: User
}