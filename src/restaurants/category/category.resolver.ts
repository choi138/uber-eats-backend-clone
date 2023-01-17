import { Query, Args, Resolver, Parent, ResolveField, Int } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { CategoriesInput, CategoriesOutput } from "./dto/categories.dto";
import { CategoryInput, CategoryOutput } from "./dto/category.dto";
import { Category } from "./entity/category.entity";

@Resolver((of) => Category)
export class CategoryResolver {
    constructor(private readonly cateogryService: CategoryService) { }

    @Query((returns) => CategoriesOutput)
    categories(
        @Args('input') categoriesInput: CategoriesInput
    ): Promise<CategoriesOutput> {
        return this.cateogryService.allCategories(categoriesInput)
    }

    @ResolveField((type) => Int)
    restaurantCount(@Parent() category: Category): Promise<Number> {
        return this.cateogryService.countRestaurant(category)
    }

    @Query((returns) => CategoryOutput)
    category(
        @Args('input') categoryInput: CategoryInput
    ): Promise<CategoryOutput> {
        return this.cateogryService.findCategoryBySlug(categoryInput)
    }
}