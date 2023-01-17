import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Menu } from "src/restaurants/menu/entity/Menu.entity";
import { Restaurant } from "src/restaurants/restaurants/entities/restaurants.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreaetOrderOutput, CreateOrderInput } from "./dto/create-order.dto";
import { OrderItem } from "./entitites/order-items.dto";
import { Order } from "./entitites/order.entity";

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
                    error: 'Restaurant not found'
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
                        error: 'Could not found menu'
                    }
                }
                let menuFinalPrice = menu.price;
                // console.log(menuFinalPrice, '초기 값')
                for (const itemOption of item.options) {
                    // console.log(itemOption, '옵션')
                    const menuOption = menu.options.find(
                        (menuOptin) => menuOptin.name == itemOption.name
                    )
                    // console.log(menuOption, '메뉴 옵션');
                    if (menuOption) {
                        if (menuOption.extra) {
                            // console.log(`$USD + ${menuOption.extra}`);
                            menuFinalPrice = menuFinalPrice + menuOption.extra
                        } else {
                            const menuOptionChoice = menuOption.choices.find(
                                (optionChoice) => optionChoice.name === itemOption.choice
                            )
                            // console.log(menuOptionChoice, '엄엄');
                            if (menuOptionChoice) {
                                if (menuOptionChoice.extra) {
                                    // console.log(`$USD + ${dishOptionChoice.extra}`);
                                    menuFinalPrice = menuFinalPrice + menuOptionChoice.extra
                                }
                            }
                        }
                    } else{
                        return{
                            ok: false,
                            error: 'There is not option like that'
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
            return {
                ok: false,
                error: "Could not create order"
            }
        }
    }

    // async getOrders(user: User, {status})
}