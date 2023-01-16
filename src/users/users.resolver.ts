import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateAccountInput, CreateAccountOutput } from './dto/user/create-account.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query((returns) => String)
    sayHello(): string {
        return 'Hello World!';
    }

    @Mutation((returns) => CreateAccountOutput)
    async createAccount(
        @Args('input') createAccountInput: CreateAccountInput,
    ): Promise<CreateAccountOutput> {
        return this.usersService.createAccount(createAccountInput);
    }
}
