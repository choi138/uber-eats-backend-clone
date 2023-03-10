import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dto/create-restaurant.dto";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dto/delete-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dto/edit-restaurant.dto";
import { RestaurantInput, RestaurantOutput } from "./dto/restaurant.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dto/restaurants.dto";
import { Restaurant } from "./entities/restaurants.entity";
import { RestaurantService } from "./restaurants.service";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Mutation((returns) => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args('input') createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput)
    }

    @Mutation((returns) => EditRestaurantOutput)
    @Role(['Owner'])
    async editRestaurant(
        @AuthUser() owner: User,
        @Args('input') editRestuarantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(owner, editRestuarantInput)
    }

    @Mutation((returns) => DeleteRestaurantOutput)
    @Role(['Owner'])
    async deleteRestaurant(
        @AuthUser() owner: User,
        @Args('input') deleteRestaurantInput: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput)
    }

    @Query((returns) => RestaurantsOutput)
    restaurants(
        @Args('input')
        restaurantsInput: RestaurantsInput
    ): Promise<RestaurantsOutput> {
        return this.restaurantService.allRestaurants(restaurantsInput)
    }

    @Query((returns) => RestaurantOutput)
    restaurant(
        @Args('input')
        restaurantInput: RestaurantInput
    ): Promise<RestaurantOutput> {
        return this.restaurantService.findRestaurantById(restaurantInput)
    }
}