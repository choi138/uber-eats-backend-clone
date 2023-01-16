import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAccountOutput } from "src/users/dto/user/create-account.dto";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Category } from "../category/entity/category.entity";
import { CreateRestaurantInput } from "./dto/create-restaurant.dto";
import { Restaurant } from "./entities/restaurants.entity";

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category)
        private readonly categories: Repository<Category>
    ) { }

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateAccountOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput)
            newRestaurant.owner = owner;

            const categoryName = createRestaurantInput.categoryName.trim().toLowerCase();
            const categorySlug = categoryName.replace(/ /g, '-');
            console.log(categoryName)

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
            newRestaurant.category = category;
            await this.restaurants.save(newRestaurant);
            return { ok: true }
        } catch (err) {
            console.log(err)
            return {
                ok: false,
                error: 'Could not create restaurant'
            }
        }
    }

}  