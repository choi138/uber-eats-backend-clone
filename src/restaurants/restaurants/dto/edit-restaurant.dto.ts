import { Field, InputType, Int, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { CreateRestaurantInput } from "./create-restaurant.dto";

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
    @Field((type) => Int)
    restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput{}