import { Query, Args, Resolver } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { CategoriesInput, CategoriesOutput } from "./dto/categories.dto";
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
}