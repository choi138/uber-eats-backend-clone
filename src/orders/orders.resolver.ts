import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { CreaetOrderOutput, CreateOrderInput } from "./dto/create-order.dto";
import { Order } from "./entitites/order.entity";
import { OrderService } from "./orders.service";

@Resolver((of) => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) { }

    @Mutation((returns) => CreaetOrderOutput)
    @Role(['Client'])
    async createOrder(
        @AuthUser() customer: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreaetOrderOutput>{
        return this.orderService.createOrder(customer, createOrderInput)
    }
}