import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGard } from './auth.guard';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGard
        }
    ]
})
export class AuthModule {}
