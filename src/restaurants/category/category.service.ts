import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Restaurant } from "../restaurants/entities/restaurants.entity";
import { CategoriesInput, CategoriesOutput } from "./dto/categories.dto";
import { Category } from "./entity/category.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category)
        private readonly categories: Repository<Category>
    ) { }

    async allCategories({ page }: CategoriesInput): Promise<CategoriesOutput> {
        try {
            const [categories, totalResults] = await this.categories.findAndCount({
                skip: (page - 1) * 25,
                take: 25,
                relations: ['restaurants']
            })
            return {
                ok: true,
                results: categories,
                totalResults: totalResults,
                totalPages: Math.ceil(totalResults / 25)
            }
        } catch (err) {
            return {
                ok: false,
                error: "Could not load categories"
            }
        }
    }
}