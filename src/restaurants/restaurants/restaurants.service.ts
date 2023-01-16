import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CoreOutput } from "src/common/dto/core-output.dto";
import { CreateAccountOutput } from "src/users/dto/user/create-account.dto";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Category } from "../category/entity/category.entity";
import { CreateRestaurantInput } from "./dto/create-restaurant.dto";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dto/delete-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dto/edit-restaurant.dto";
import { RestaurantInput, RestaurantOutput } from "./dto/restaurant.dto";
import { RestaurantsOutput, RestaurantsInput } from "./dto/restaurants.dto";
import { Restaurant } from "./entities/restaurants.entity";

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category)
        private readonly categories: Repository<Category>
    ) { }

    async getOrCreateCategory(name: string): Promise<Category> {
        const categoryName = name.trim().toLowerCase();
        const categorySlug = categoryName.replace(/ /g, '-');

        let category = await this.categories.findOne({
            where: { slug: categorySlug },
        })
        if (!category) {
            category = await this.categories.save(
                this.categories.create({
                    slug: categorySlug,
                    name: categoryName
                })
            )
        }
        return category
    }

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateAccountOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput)
            newRestaurant.owner = owner;

            const category = await this.getOrCreateCategory(createRestaurantInput.categoryName)
            newRestaurant.category = category;
            await this.restaurants.save(newRestaurant);
            return { ok: true }
        } catch (err) {
            console.log(err)
            return {
                ok: false,
                error: 'Could not create restaurant.'
            }
        }
    }

    // async findAndCheckRestaurant(owner: User, restaurantId: number, error: string):
    //     Promise<{ ok?: boolean, error?: string, restaurant?: Restaurant }> {
    //     const restaurant = await this.restaurants.findOne({
    //         where: { id: restaurantId }
    //     })
    //     if (!restaurant) {
    //         return {
    //             ok: false,
    //             error: 'Restaurant Not found',
    //         }
    //     }
    //     if (owner.id !== restaurant.ownerId) {
    //         return {
    //             ok: false,
    //             error: error
    //         }
    //     }
    //     return {ok: true}
    // }

    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: { id: editRestaurantInput.restaurantId }
            })
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant Not found',
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't edit a restaurant that you don't own."
                }
            }
            let category: Category = null;
            if (editRestaurantInput.categoryName) {
                category = await this.getOrCreateCategory(editRestaurantInput.categoryName);
            }
            await this.restaurants.save([
                {
                    id: editRestaurantInput.restaurantId,
                    ...editRestaurantInput,
                    ...(category && { category })
                }
            ])
            return { ok: true }
        } catch (err) {
            return {
                ok: false,
                error: 'Could not Edit Restaurant.'
            }
        }
    }

    async deleteRestaurant(
        owner: User,
        { restaruantId }: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: { id: restaruantId }
            })
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant Not found.',
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't delete a restaurant that you don't own."
                }
            }
            await this.restaurants.delete(restaruantId)
            return { ok: true }
        } catch (err) {
            return {
                ok: false,
                error: 'Could not delete restaurant.'
            }
        }
    }

    async allRestaurants(
        { page }: RestaurantsInput
    ): Promise<RestaurantsOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                skip: (page - 1) * 25,
                take: 25,
                relations: ['owner', 'category']
            })
            return {
                ok: true,
                results: restaurants,
                totalResults: totalResults,
                totalPages: Math.ceil(totalResults / 25),
            };
        } catch (err) {
            return {
                ok: false,
                error: 'Could not load restaurants.'
            }
        }
    }

    async findRestaurantById(
        { restaurantId }: RestaurantInput
    ): Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: { id: restaurantId },
                relations: ['user']
            });
            if (!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found."
                }
            }
            return {
                ok: true,
                restaurant: restaurant,
            }
        } catch (err) {
            return {
                ok: false,
                error: "Could not find restaurant."
            }
        }
    }
}  