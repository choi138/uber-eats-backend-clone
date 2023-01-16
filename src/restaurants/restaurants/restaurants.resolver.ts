import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGard } from "src/auth/auth.guard";
import { User } from "src/users/entities/user.entity";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dto/create-restaurant.dto";
import { Restaurant } from "./entities/restaurants.entity";
import { RestaurantService } from "./restaurants.service";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Mutation((returns) => CreateRestaurantOutput)
    @UseGuards(AuthGard)
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args('input') createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput)
    }
}