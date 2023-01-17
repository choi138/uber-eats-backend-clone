import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Restaurant } from "../restaurants/entities/restaurants.entity";
import { CreateMenuInput, CreateMenuOutput } from "./dto/create-dish.dto";
import { Menu } from "./entity/Menu.entity";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Menu)
        private readonly menus: Repository<Menu>
    ) { }

    async createMenu(
        owner: User,
        createMenuInput: CreateMenuInput
    ): Promise<CreateMenuOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: { id: createMenuInput.restaurantId }
            })
            if (!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found"
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't do that"
                }
            }
            const dish = await this.menus.save(
                this.menus.create({ ...createMenuInput, restaurant })
            )
            console.log(dish)
            return { ok: true }
        } catch (err) {
            return {
                ok: false,
                error: "Could not create menu."
            }
        }
    }
}