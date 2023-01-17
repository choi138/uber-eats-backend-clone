import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/restaurants/menu/entity/Menu.entity';
import { Restaurant } from 'src/restaurants/restaurants/entities/restaurants.entity';
import { OrderItem } from './entitites/order-items.dto';
import { Order } from './entitites/order.entity';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Menu])],
    providers: [OrderService, OrderResolver]
})
export class OrdersModule { }
