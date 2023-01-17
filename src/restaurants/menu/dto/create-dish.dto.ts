import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { Menu } from "../entity/Menu.entity";

@InputType()
export class CreateMenuInput extends PickType(Menu, [
    'name',
    'price',
    'description',
    'options'
]) { 
    @Field((type) => Int)
    restaurantId: number;
}

@ObjectType()
export class CreateMenuOutput extends CoreOutput{}