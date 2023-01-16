import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dto/pagination.dto";
import { User } from "src/users/entities/user.entity";

@InputType()
export class UsersInput extends PaginationInput{}

@ObjectType()
export class UsersOutput extends PaginationOutput{
    @Field((type) => [User], {nullable: true})
    results?: User[];
}