import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { Restaurant } from "../entities/restaurants.entity";

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
    'name',
    'coverImg',
    'address',
]) {
    @Field((type) => String)
    categoryName: string
}

@ObjectType() 
export class CreateRestaurantOutput extends CoreOutput{}