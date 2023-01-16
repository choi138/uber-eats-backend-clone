import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurants.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant])]
})
export class RestaurantsModule {}
