import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Category } from "./category.entity";

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
    @ManyToOne((type) => User, (user) => user.restaurants, {
        onDelete: 'CASCADE',
    })
    owner: User;

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: string;

    @Field((type) => Category)
    @ManyToOne((type) => Category, (category) => category.restaurants, {
        onDelete: 'CASCADE',
    })
    category: Category;
}