import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Restaurant } from "../restaurants/entities/restaurants.entity";
import { CreateMenuInput, CreateMenuOutput } from "./dto/create-menu.dto";
import { DeleteMenuInput, DeleteMenuOutput } from "./dto/delete-menu.dto";
import { EditMenuInput, EditMenuOutput } from "./dto/edit-menu.dto";
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
                    error: "Restaurant not found."
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't do that."
                }
            }
            const dish = await this.menus.save(
                this.menus.create({ ...createMenuInput, restaurant })
            )
            return { ok: true }
        } catch (err) {
            return {
                ok: false,
                error: "Could not create menu."
            }
        }
    }

    // async findMenu(menuId: number, owner: User) {
    //     const menu = await this.menus.findOne({
    //         where: { id: menuId },
    //         relations: ['restaurant']
    //     });
    //     if (!menu) {
    //         return {
    //             ok: false,
    //             error: "Menu not found."
    //         }
    //     }
    //     console.log(menu.restaurant.ownerId, owner.id)
    //     if (menu.restaurant.ownerId !== owner.id) {
    //         return {
    //             ok: false,
    //             error: "You can't do that,"
    //         }
    //     }
    //     return menu
    // }

    async editMenu(
        owner: User,
        editMenuInput: EditMenuInput
    ): Promise<EditMenuOutput> {
        try {
            const menu = await this.menus.findOne({
                where: { id: editMenuInput.menuId },
                relations: ['restaurant']
            });
            if (!menu) {
                return {
                    ok: false,
                    error: "Menu not found."
                }
            }
            if (menu.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: "You can't do that,"
                }
            }
            await this.menus.save({ id: editMenuInput.menuId, ...editMenuInput })
            return { ok: true }
        } catch (err) {
            return {
                ok: false,
                error: 'Could not edit menu.'
            }
        }
    }

    async deleteMenu(
        owner: User,
        { menuId }: DeleteMenuInput
    ): Promise<DeleteMenuOutput> {
        try {
            const menu = await this.menus.findOne({
                where: { id: menuId },
                relations: ['restaurant']
            });
            if (!menu) {
                return {
                    ok: false,
                    error: "Menu not found."
                }
            }
            if (menu.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: "You can't do that,"
                }
            }
            await this.menus.delete(menuId);
            return { ok: true }
        } catch (err) {
            return {
                ok: false,
                error: 'Could not delete menu'
            }
        }
    }
}