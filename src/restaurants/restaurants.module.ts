import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryResolver } from './category/category.resolver';
import { CategoryService } from './category/category.service';
import { Category } from './category/entity/category.entity';
import { Menu } from './menu/entity/Menu.entity';
import { MenuResolver } from './menu/menu.resolver';
import { MenuService } from './menu/menu.service';
import { Restaurant } from './restaurants/entities/restaurants.entity';
import { RestaurantResolver } from './restaurants/restaurants.resolver';
import { RestaurantService } from './restaurants/restaurants.service';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, Category, Menu])],
    providers: [
        RestaurantResolver,
        RestaurantService,
        CategoryService,
        CategoryResolver,
        MenuService,
        MenuResolver
    ]
})
export class RestaurantsModule { }
