import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "../restaurants/entities/restaurants.entity";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Restaurant
    ) { }
}