import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { CreaetOrderOutput, CreateOrderInput } from "./dto/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dto/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dto/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dto/get-orders.dto";
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
    ): Promise<CreaetOrderOutput> {
        return this.orderService.createOrder(customer, createOrderInput)
    }

    @Query((returns) => GetOrdersOutput)
    @Role(['Any'])
    async getOrders(
        @AuthUser() customer: User,
        @Args('input') getOrdersInput: GetOrdersInput
    ): Promise<GetOrdersOutput> {
        return this.orderService.getOrders(customer, getOrdersInput)
    }

    @Query((returns) => GetOrderOutput)
    @Role(['Any'])
    async getOrder(
        @AuthUser() customer: User,
        @Args('input') getOrderInput: GetOrderInput
    ): Promise<GetOrderOutput> {
        return this.orderService.getOrder(customer, getOrderInput)
    }

    @Mutation((returns) => EditOrderOutput)
    @Role(['Any'])
    async editOrder(
        @AuthUser() user: User,
        @Args('input') editOrderInput: EditOrderInput
    ): Promise<EditOrderOutput> {
        return this.orderService.editOrder(user, editOrderInput)
    }
}