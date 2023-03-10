import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Menu } from "src/restaurants/menu/entity/Menu.entity";
import { Restaurant } from "src/restaurants/restaurants/entities/restaurants.entity";
import { User, UserRole } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreaetOrderOutput, CreateOrderInput } from "./dto/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dto/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dto/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dto/get-orders.dto";
import { OrderItem } from "./entitites/order-items.dto";
import { Order, OrderStatus } from "./entitites/order.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Menu) private readonly menus: Repository<Menu>
    ) { }

    async createOrder(
        customer: User,
        { restaurantId, items }: CreateOrderInput
    ): Promise<CreaetOrderOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: { id: restaurantId }
            })
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found.'
                }
            }

            let orderFinalPrice = 0
            const orderItems: OrderItem[] = [];
            for (const item of items) {
                const menu = await this.menus.findOne({
                    where: { id: item.menuId }
                })
                if (!menu) {
                    return {
                        ok: false,
                        error: 'Could not found menu.'
                    }
                }
                let menuFinalPrice = menu.price;
                for (const itemOption of item.options) {
                    const menuOption = menu.options.find(
                        (menuOption) => menuOption.name == itemOption.name
                    )
                    if (menuOption) {
                        if (menuOption.extra) {
                            menuFinalPrice = menuFinalPrice + menuOption.extra
                        }
                        if (menuOption.choices) {
                            const menuOptionChoice = menuOption.choices.find(
                                (optionChoice) => optionChoice.name === itemOption.choice
                            )
                            if (menuOptionChoice) {
                                if (menuOptionChoice.extra) {
                                    menuFinalPrice = menuFinalPrice + menuOptionChoice.extra
                                }
                            } else {
                                return {
                                    ok: false,
                                    error: "There is no choice like that."
                                }
                            }
                        }
                    }
                    else {
                        return {
                            ok: false,
                            error: 'There is not option like that.'
                        }
                    }

                }


                orderFinalPrice = orderFinalPrice + menuFinalPrice;
                // console.log(orderFinalPrice);

                const orderItem = await this.orderItems.save(
                    this.orderItems.create({
                        menu: menu,
                        options: item.options
                    }),
                );
                orderItems.push(orderItem)
                // console.log(item.options);
            }

            // console.log(orderFinalPrice);
            await this.orders.save(
                this.orders.create({
                    customer,
                    restaurant,
                    total: orderFinalPrice,
                    items: orderItems
                })
            );
            // console.log(order);

            return { ok: true }
        } catch (err) {
            console.log(err)
            return {
                ok: false,
                error: "Could not create order."
            }
        }
    }

    async getOrders(
        user: User,
        { status }: GetOrdersInput
    ): Promise<GetOrdersOutput> {
        try {
            let orders: Order[];
            if (user.role === UserRole.Client) {
                orders = await this.orders.find({
                    where: { customer: { id: user.id }, ...(status && { status }) },
                    relations: ['items']
                })
            } else if (user.role === UserRole.Delivery) {
                orders = await this.orders.find({
                    where: { customer: { id: user.id }, ...(status && { status }) },
                    relations: ['items']
                })
            } else if (user.role === UserRole.Owner) {
                const restaurants = await this.restaurants.find({
                    where: { id: user.id },
                    relations: ['orders']
                })
                console.log(restaurants, '??????')
                orders = restaurants.map((restaurant) => restaurant.orders).flat(1)

                if (status) {
                    orders = orders.filter((order) => order.status === status)
                }
            }

            return {
                ok: true,
                orders: orders
            }

        } catch (err) {
            console.log(err)
            return {
                ok: false,
                error: "Could no get orders."
            }
        }
    }

    canSeeOrder(user: User, order: Order): boolean {
        let canSee = true;
        if (user.role == UserRole.Client && order.customerId !== user.id) {
            canSee = false
        }
        if (user.role == UserRole.Delivery && order.driverId !== user.id) {
            canSee = false
        }
        if (user.role == UserRole.Owner && order.restaurant.ownerId !== user.id) {
            canSee = false
        }
        return canSee
    }

    async getOrder(
        user: User,
        { id: orderId }: GetOrderInput
    ): Promise<GetOrderOutput> {
        try {
            const order = await this.orders.findOne({
                where: { id: orderId },
                relations: ['restaurant', 'items']
            })
            if (!order) {
                return {
                    ok: false,
                    error: 'Order not found.'
                }
            }
            if (!this.canSeeOrder(user, order)) {
                return {
                    ok: false,
                    error: "You can't see that."
                }
            }
            return {
                ok: true,
                order: order
            }
        } catch (err) {
            return {
                ok: false,
                error: 'Could not get order.'
            }
        }
    }

    async editOrder(
        user: User,
        { id: orderId, status }: EditOrderInput
    ): Promise<EditOrderOutput> {
        try {
            const order = await this.orders.findOne({
                where: { id: orderId },
                relations: ['restaurant']
            });
            if (!order) {
                return {
                    ok: false,
                    error: "Order not found."
                }
            }
            if (!this.canSeeOrder(user, order)) {
                return {
                    ok: false,
                    error: "You can't see this."
                }
            }
            let canEdit = true;
            if (user.role === UserRole.Client) {
                canEdit = false;
            }
            if (user.role === UserRole.Owner) {
                if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
                    canEdit = false;
                }
            }
            if (user.role === UserRole.Delivery) {
                if (
                    status !== OrderStatus.PickedUp &&
                    status !== OrderStatus.Delivered
                ) {
                    canEdit = false;
                }
            }
            if (!canEdit) {
                return {
                    ok: false,
                    error: "You can't do that",
                }
            }
            await this.orders.save([{ id: orderId, status: status }])
            return { ok: true }
        } catch (err) {
            console.log(err)
            return {
                ok: false,
                error: 'Could not edit order.'
            }
        }
    }
}
