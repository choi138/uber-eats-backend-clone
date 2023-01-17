import { Field, InputType, Int, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { Menu } from "../entity/Menu.entity";

@InputType()
export class EditMenuInput extends PickType(
    PartialType(Menu),
    ['name', 'options', 'price', 'description']
) {
    @Field((type) => Int)
    menuId: number;
}

@ObjectType()
export class EditMenuOutput extends CoreOutput{}