import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dto/pagination.dto";
import { Category } from "../entity/category.entity";

@InputType()
export class CategoriesInput extends PaginationInput { }

@ObjectType()
export class CategoriesOutput extends PaginationOutput {
    @Field((type) => [Category], { nullable: true })
    results?: Category[];
}