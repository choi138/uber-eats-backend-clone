import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/orders/entitites/order.entity";
import { Menu } from "src/restaurants/menu/entity/Menu.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Category } from "../../category/entity/category.entity";

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    @Field((type) => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field((type) => String)
    @Column()
    @IsString()
    coverImg: string;

    @Field((type) => String)
    @Column()
    @IsString()
    address: string;

    @Field((type) => User)
    @ManyToOne((type) => User, (user) => user.restaurant, {
        onDelete: 'CASCADE',
    })
    owner: User;

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

    @Field((type) => Category)
    @ManyToOne((type) => Category, (category) => category.restaurant, {
        onDelete: 'CASCADE',
    })
    category: Category;

    @Field((type) => [Menu])
    @OneToMany((type) => Menu, (Menu) => Menu.restaurant, {})
    menu: Menu[];

    @Field((type) => [Order])
    @OneToMany((type) => Order, (order) => order.restaurant, {})
    orders: Order[];
}