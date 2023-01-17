import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { OrderItemOption } from "../entitites/order-items.dto";

@InputType()
class CreateOrderItemInput {
    @Field((type) => Int)
    menuId: number;

    @Field((type) => [OrderItemOption], { nullable: true })
    options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput {
    @Field((type) => Int)
    restaurantId: number;

    @Field((type) => [CreateOrderItemInput])
    items: CreateOrderItemInput[];
}

@ObjectType()
export class CreaetOrderOutput extends CoreOutput { }