import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Menu } from "src/restaurants/menu/entity/Menu.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
    @Field((type) => String)
    name: string;

    @Field((type) => String, { nullable: true })
    choice?: string
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
    @ManyToOne((type) => Menu, { nullable: true, onDelete: 'CASCADE' })
    menu: Menu;

    @Field((type) => [OrderItemOption], { nullable: true })
    @Column({ type: 'json', nullable: true })
    options?: OrderItemOption[];
}