import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { Order } from "../entitites/order.entity";

@InputType()
export class GetOrderInput extends PickType(Order, ['id']) { }

@ObjectType()
export class GetOrderOutput extends CoreOutput {
    @Field((type) => Order, { nullable: true })
    order?: Order
}