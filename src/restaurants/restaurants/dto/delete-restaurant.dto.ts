import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/core-output.dto";

@InputType()
export class DeleteRestaurantInput {
    @Field((type) => Int)
    restaruantId: number
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput{}