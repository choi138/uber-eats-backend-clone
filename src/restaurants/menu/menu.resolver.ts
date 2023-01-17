import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { CreateMenuInput, CreateMenuOutput } from "./dto/create-menu.dto";
import { EditMenuInput, EditMenuOutput } from "./dto/edit-menu.dto";
import { Menu } from "./entity/Menu.entity";
import { MenuService } from "./menu.service";

@Resolver((of) => Menu)
export class MenuResolver {
    constructor(private readonly menuService: MenuService) { }

    @Mutation((type) => CreateMenuOutput)
    @Role(['Owner'])
    createMenu(
        @AuthUser() owner: User,
        @Args('input') createMenuInput: CreateMenuInput
    ): Promise<CreateMenuOutput> {
        return this.menuService.createMenu(owner, createMenuInput);
    }

    @Mutation((type) => EditMenuOutput)
    @Role(['Owner'])
    editMenu(
        @AuthUser() owner: User,
        @Args('input') editMenuInput: EditMenuInput
    ): Promise<EditMenuOutput> {
        return this.menuService.editMenu(owner, editMenuInput);
    }
}