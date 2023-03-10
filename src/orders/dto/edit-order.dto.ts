import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { Order } from "../entitites/order.entity";

@InputType()
export class EditOrderInput extends PickType(Order, ['id', 'status']) { }

@ObjectType()
export class EditOrderOutput extends CoreOutput{}