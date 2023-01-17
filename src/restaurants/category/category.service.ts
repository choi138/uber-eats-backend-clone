import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Restaurant } from "../restaurants/entities/restaurants.entity";
import { CategoriesInput, CategoriesOutput } from "./dto/categories.dto";
import { CategoryInput, CategoryOutput } from "./dto/category.dto";
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
                relations: ['restaurant']
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
                error: "Could not load categories."
            }
        }
    }

    countRestaurant(category: Category) {
        return this.restaurants.count({ where: { category: { id: category.id } } })
    }

    async findCategoryBySlug({
        slug, page
    }: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne({
                where: { slug: slug }
            })
            if (!category) {
                return {
                    ok: false,
                    error: "Category not found."
                }
            }
            const restaurants = await this.restaurants.find({
                where: { category: { id: category.id } },
                take: 25,
                skip: (page - 1) * 25,
                relations: ['owner', 'menu']
            })
            const totalResults = await this.countRestaurant(category)
            return {
                ok: true,
                category: category,
                restaurants: restaurants,
                totalResults: totalResults,
                totalPages: Math.ceil(totalResults / 25)
            }
        } catch (err) {
            return {
                ok: false,
                error: 'Could not load catory.'
            }
        }
    }
}