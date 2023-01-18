import { Field, Float, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Restaurant } from "src/restaurants/restaurants/entities/restaurants.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";

@InputType('MenuChoiceInpuType', { isAbstract: true })
@ObjectType()
export class MenuChoice {
    @Field((type) => String, { nullable: true })
    name?: string

    @Field((type) => Float, { nullable: true })
    extra?: number
}

@InputType('MenuOptionInputType', { isAbstract: true })
@ObjectType()
export class MenuOption {
    @Field((type) => String)
    name: string;

    @Field((type) => [MenuChoice], { nullable: true })
    choices?: MenuChoice[];

    @Field((type) => Float, { nullable: true })
    extra?: number;
}

@InputType('MenuInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Menu extends CoreEntity {
    @Field((type) => String)
    @Column()
    @IsString()
    @Length(3)
    name: string

    @Field((type) => Int)
    @Column()
    @IsNumber()
    price: number;

    @Field((type) => String)
    @Column()
    @IsString()
    @Length(5, 10)
    description: string;

    @Field((type) => Restaurant)
    @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
        onDelete: 'CASCADE'
    })
    restaurant: Restaurant;

    @RelationId((menu: Menu) => menu.restaurant)
    restaurantId: number;

    @Field((type) => [MenuOption], { nullable: true })
    @Column({ type: 'json', nullable: true })
    options?: MenuOption[];
}